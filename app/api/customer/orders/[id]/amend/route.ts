import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { items } = body

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Only allow amending PENDING orders
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only PENDING orders can be amended' },
        { status: 400 }
      )
    }

    // Delete existing order items
    await prisma.orderItem.deleteMany({
      where: { orderId: params.id },
    })

    // Delete existing stock blocks
    await prisma.stockBlock.deleteMany({
      where: { orderId: params.id },
    })

    // Get the products to create new order items with proper product IDs
    const productMap = new Map()
    for (const item of items) {
      if (item.productId && item.productId.length > 10) {
        // If it's a valid product ID
        productMap.set(item.productId, null)
      } else if (item.productName) {
        // Find product by name
        const product = await prisma.product.findFirst({
          where: { name: item.productName, isActive: true },
        })
        if (product) {
          productMap.set(product.id, product)
        }
      }
    }

    // Get all products from the map
    const productIds = Array.from(productMap.keys())
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    // Create new order items
    let newTotalPrice = 0
    for (const item of items) {
      let productId = item.productId
      
      // If productId is not a valid ID, find by name
      if (!productId || productId.length <= 10) {
        const product = await prisma.product.findFirst({
          where: { name: item.productName, isActive: true },
        })
        if (product) {
          productId = product.id
        } else {
          continue
        }
      }

      // Create order item
      const price = parseFloat(item.price) || 0
      await prisma.orderItem.create({
        data: {
          orderId: params.id,
          productId: productId,
          quantity: parseInt(item.quantity) || 1,
          price: price,
        },
      })

      newTotalPrice += price * (parseInt(item.quantity) || 1)

      // Create stock blocks for new quantity
      const originalQuantity = item.originalQuantity || 0
      const newQuantity = parseInt(item.quantity) || 1
      const quantityDifference = newQuantity - originalQuantity

      if (quantityDifference > 0) {
        // Adding more items - create additional stock blocks
        for (let i = 0; i < quantityDifference; i++) {
          await prisma.stockBlock.create({
            data: {
              productId: productId,
              orderId: params.id,
              startDate: order.rentalStartDate,
              endDate: order.rentalEndDate,
            },
          })
        }
      }
      // If quantity decreased, the stock blocks are already deleted above
    }

    // Update order total
    await prisma.order.update({
      where: { id: params.id },
      data: {
        totalPrice: newTotalPrice,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error amending order:', error)
    return NextResponse.json(
      { error: 'Failed to amend order' },
      { status: 500 }
    )
  }
}


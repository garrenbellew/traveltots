import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
      },
    })

    // Get current active stock blocks (for active orders, not cancelled)
    const stockBlocks = await prisma.stockBlock.findMany({
      include: {
        order: {
          select: { 
            status: true,
            id: true,
            rentalStartDate: true,
            rentalEndDate: true,
            customerName: true,
            customerEmail: true
          }
        }
      }
    })

    // Calculate available stock for each product
    const now = new Date()
    const productsWithStock = products.map(product => {
      // Count active blocks (not cancelled orders)
      const activeBlocks = stockBlocks.filter(block => 
        block.productId === product.id &&
        block.order?.status !== 'CANCELLED'
      )

      const reserved = activeBlocks.length
      const available = product.totalStock - reserved

      // Get orders for this product that contribute to oversold situation
      const contributingOrders = activeBlocks
        .map(block => block.order)
        .filter(Boolean)
        .map(order => ({
          orderId: order.id,
          rentalStartDate: order.rentalStartDate,
          rentalEndDate: order.rentalEndDate,
          customerName: order.customerName,
          customerEmail: order.customerEmail
        }))

      return {
        ...product,
        reserved,
        available,
        oversoldOrders: contributingOrders
      }
    })

    return NextResponse.json(productsWithStock)
  } catch (error) {
    console.error('Error fetching products with stock:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}


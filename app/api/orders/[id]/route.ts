import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, adminNotes } = body

    // Get the current order to check stock blocks and items
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true
      }
    })

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      status,
      adminNotes,
    }

    // Update timestamps based on status
    const now = new Date()
    if (status === 'CONFIRMED' && currentOrder.status !== 'CONFIRMED') {
      updateData.confirmedAt = now
      
      // Ensure stock blocks exist (in case they weren't created on submission)
      const existingBlocks = await prisma.stockBlock.count({
        where: { orderId: params.id }
      })
      
      if (existingBlocks === 0) {
        // Create stock blocks for each item
        for (const orderItem of currentOrder.items) {
          for (let i = 0; i < orderItem.quantity; i++) {
            await prisma.stockBlock.create({
              data: {
                productId: orderItem.productId,
                orderId: params.id,
                startDate: currentOrder.rentalStartDate,
                endDate: currentOrder.rentalEndDate,
              },
            })
          }
        }
      }
    }
    if (status === 'DELIVERED' && currentOrder.status !== 'DELIVERED') {
      updateData.deliveredAt = now
      // Stock remains blocked until collection
      // Don't delete stock blocks - items are still with customer
    }
    if (status === 'COMPLETED' && currentOrder.status !== 'COMPLETED') {
      updateData.completedAt = now
      // Free up stock when items are collected/completed
      await prisma.stockBlock.deleteMany({
        where: { orderId: params.id },
      })
    }
    if (status === 'CANCELLED' && currentOrder.status !== 'CANCELLED') {
      updateData.cancelledAt = now
      
      // Free up stock by deleting stock blocks
      await prisma.stockBlock.deleteMany({
        where: { orderId: params.id },
      })
    }

    // Update the order
    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}

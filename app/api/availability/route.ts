import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, startDate, endDate, excludeOrderId } = body

    if (!productId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Find overlapping stock blocks (only active orders, not cancelled or completed)
    const where: any = {
      productId,
      order: {
        status: { 
          notIn: ['CANCELLED', 'COMPLETED'] 
        }
      },
      OR: [
        {
          AND: [
            { startDate: { lte: start } },
            { endDate: { gte: start } },
          ],
        },
        {
          AND: [
            { startDate: { lte: end } },
            { endDate: { gte: end } },
          ],
        },
        {
          AND: [
            { startDate: { gte: start } },
            { endDate: { lte: end } },
          ],
        },
      ],
    }

    if (excludeOrderId) {
      where.orderId = { not: excludeOrderId }
    }

    const blockedStock = await prisma.stockBlock.count({
      where,
    })

    const availableStock = product.totalStock - blockedStock

    return NextResponse.json({
      available: availableStock,
      totalStock: product.totalStock,
      blocked: blockedStock,
      availableFrom: new Date(end).toISOString(),
    })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}


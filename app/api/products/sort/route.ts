import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'

// Update product sort order
export async function PUT(request: NextRequest) {
  // Require admin authentication
  const authError = await requireAdminAuth(request)
  if (authError) return authError
  try {
    const body = await request.json()
    const { productId, direction, categoryId } = body

    if (!productId || !direction) {
      return NextResponse.json(
        { error: 'Missing required fields: productId and direction' },
        { status: 400 }
      )
    }

    if (!['up', 'down'].includes(direction)) {
      return NextResponse.json(
        { error: 'Direction must be "up" or "down"' },
        { status: 400 }
      )
    }

    // Build where clause for getting all products in context
    const where: any = {}
    if (categoryId) {
      where.categoryId = categoryId
    }

    // Get all products in the current context, ordered by sortOrder then createdAt
    const allProducts = await prisma.product.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    // Find the current product's index
    const currentIndex = allProducts.findIndex(p => p.id === productId)
    
    if (currentIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate the adjacent index
    const adjacentIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    // Check if adjacent product exists
    if (adjacentIndex < 0 || adjacentIndex >= allProducts.length) {
      return NextResponse.json(
        { error: 'No adjacent product found' },
        { status: 404 }
      )
    }

    // Swap the products in the array
    const swappedProducts = [...allProducts]
    const temp = swappedProducts[currentIndex]
    swappedProducts[currentIndex] = swappedProducts[adjacentIndex]
    swappedProducts[adjacentIndex] = temp

    // Reassign sequential sortOrders to all products to avoid conflicts
    // Start from 0 and increment by 1 for each product
    const updates = swappedProducts.map((product, index) => ({
      id: product.id,
      sortOrder: index,
    }))

    // Update all products in a transaction
    await prisma.$transaction(
      updates.map(update =>
        prisma.product.update({
          where: { id: update.id },
          data: { sortOrder: update.sortOrder },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating product sort order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update sort order' },
      { status: 500 }
    )
  }
}

// Bulk update sort orders (for reordering multiple products)
export async function POST(request: NextRequest) {
  // Require admin authentication
  const authError = await requireAdminAuth(request)
  if (authError) return authError
  
  try {
    const body = await request.json()
    const { updates } = body // Array of { productId, sortOrder }

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates must be an array' },
        { status: 400 }
      )
    }

    // Update all products in a transaction
    await prisma.$transaction(
      updates.map((update: { productId: string; sortOrder: number }) =>
        prisma.product.update({
          where: { id: update.productId },
          data: { sortOrder: update.sortOrder },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error bulk updating product sort order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update sort orders' },
      { status: 500 }
    )
  }
}


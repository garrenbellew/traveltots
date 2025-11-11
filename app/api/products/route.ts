import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categorySlug = searchParams.get('category')
    const all = searchParams.get('all') === 'true'

    const where: any = {}
    
    // Only filter by isActive for public endpoints
    if (!all) {
      where.isActive = true
    }

    if (categorySlug && categorySlug !== 'all') {
      where.category = {
        slug: categorySlug,
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, price, image, categoryId, totalStock, isActive } = body

    // Basic validation
    if (!name || !slug || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the maximum sortOrder to place new product at the end
    const maxSortOrder = await prisma.product.aggregate({
      _max: {
        sortOrder: true,
      },
    })

    const newSortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        image: image || null,
        categoryId,
        totalStock: parseInt(totalStock) || 1,
        isActive: isActive ?? true,
        sortOrder: newSortOrder,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}

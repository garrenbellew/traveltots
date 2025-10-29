import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

// Get bundle products for adding to cart
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bundle = await prisma.bundle.findUnique({
      where: { id: params.id },
      include: {
        products: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    if (!bundle) {
      return NextResponse.json(
        { error: 'Bundle not found' },
        { status: 404 }
      )
    }

    // Return products formatted for cart
    const cartItems = bundle.products.map(pb => ({
      productId: pb.product.id,
      productName: pb.product.name,
      price: pb.product.price,
      image: pb.product.image,
      quantity: pb.quantity,
    }))

    return NextResponse.json({
      bundleName: bundle.name,
      items: cartItems,
    })
  } catch (error: any) {
    console.error('Error fetching bundle for cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bundle' },
      { status: 500 }
    )
  }
}


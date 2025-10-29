import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

// Get products included in a bundle
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bundleProducts = await prisma.productBundle.findMany({
      where: {
        bundleProductId: params.id,
      },
      include: {
        includedProduct: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(bundleProducts)
  } catch (error: any) {
    console.error('Error fetching bundle products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bundle products' },
      { status: 500 }
    )
  }
}

// Add or update products in a bundle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { productIds } = body // Array of { productId: string, quantity: number }

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'productIds must be an array' },
        { status: 400 }
      )
    }

    // Verify bundle exists
    const bundle = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!bundle || !bundle.isBundle) {
      return NextResponse.json(
        { error: 'Bundle not found' },
        { status: 404 }
      )
    }

    // Delete existing bundle products
    await prisma.productBundle.deleteMany({
      where: {
        bundleProductId: params.id,
      },
    })

    // Create new bundle products
    if (productIds.length > 0) {
      await prisma.productBundle.createMany({
        data: productIds.map((item: { productId: string; quantity: number }) => ({
          bundleProductId: params.id,
          includedProductId: item.productId,
          quantity: item.quantity || 1,
        })),
        skipDuplicates: true,
      })
    }

    // Return updated bundle with products
    const updatedBundle = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        bundleProducts: {
          include: {
            includedProduct: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedBundle)
  } catch (error: any) {
    console.error('Error updating bundle products:', error)
    return NextResponse.json(
      { error: 'Failed to update bundle products', details: error.message },
      { status: 500 }
    )
  }
}


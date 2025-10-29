import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

// Get bundles for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        bundles: {
          include: {
            bundle: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product.bundles.map(pb => ({
      bundleId: pb.bundleId,
      bundleName: pb.bundle.name,
      quantity: pb.quantity,
    })))
  } catch (error: any) {
    console.error('Error fetching product bundles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product bundles' },
      { status: 500 }
    )
  }
}

// Update bundles for a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { bundleIds } = body // Array of { bundleId: string, quantity: number }

    if (!Array.isArray(bundleIds)) {
      return NextResponse.json(
        { error: 'bundleIds must be an array' },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete existing bundle assignments for this product
    await prisma.productBundle.deleteMany({
      where: {
        productId: params.id,
      },
    })

    // Create new bundle assignments
    if (bundleIds.length > 0) {
      await prisma.productBundle.createMany({
        data: bundleIds.map((item: { bundleId: string; quantity: number }) => ({
          productId: params.id,
          bundleId: item.bundleId,
          quantity: item.quantity || 1,
        })),
        skipDuplicates: true,
      })
    }

    // Return updated product with bundles
    const updatedProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        bundles: {
          include: {
            bundle: true,
          },
        },
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error: any) {
    console.error('Error updating product bundles:', error)
    return NextResponse.json(
      { error: 'Failed to update product bundles', details: error.message },
      { status: 500 }
    )
  }
}


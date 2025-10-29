import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

// Check which products belong to bundles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds } = body // Array of product IDs

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'productIds must be an array' },
        { status: 400 }
      )
    }

    const bundleProducts = await prisma.productBundle.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
      include: {
        bundle: true,
      },
    })

    // Group by productId and return bundle info
    const productBundles: Record<string, Array<{ bundleId: string; bundleName: string }>> = {}
    
    bundleProducts.forEach(pb => {
      if (!productBundles[pb.productId]) {
        productBundles[pb.productId] = []
      }
      productBundles[pb.productId].push({
        bundleId: pb.bundleId,
        bundleName: pb.bundle.name,
      })
    })

    return NextResponse.json(productBundles)
  } catch (error: any) {
    console.error('Error checking product bundles:', error)
    return NextResponse.json(
      { error: 'Failed to check product bundles' },
      { status: 500 }
    )
  }
}


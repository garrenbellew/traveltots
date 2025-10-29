import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

// Get all bundles with their included products
export async function GET(request: NextRequest) {
  try {
    const bundles = await prisma.product.findMany({
      where: {
        isBundle: true,
      },
      include: {
        category: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(bundles)
  } catch (error: any) {
    console.error('Error fetching bundles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bundles' },
      { status: 500 }
    )
  }
}


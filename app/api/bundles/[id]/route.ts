import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

// Get a specific bundle
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

    return NextResponse.json(bundle)
  } catch (error: any) {
    console.error('Error fetching bundle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bundle' },
      { status: 500 }
    )
  }
}

// Update a bundle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, slug, description, isActive } = body

    const bundle = await prisma.bundle.update({
      where: { id: params.id },
      data: {
        name: name || undefined,
        slug: slug || undefined,
        description: description !== undefined ? description : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
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

    return NextResponse.json(bundle)
  } catch (error: any) {
    console.error('Error updating bundle:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A bundle with this name or slug already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update bundle' },
      { status: 500 }
    )
  }
}

// Delete a bundle
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.bundle.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting bundle:', error)
    return NextResponse.json(
      { error: 'Failed to delete bundle' },
      { status: 500 }
    )
  }
}


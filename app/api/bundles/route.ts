import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { sanitizeInput } from '@/lib/sanitize'

// Get all bundles with their products
export async function GET(request: NextRequest) {
  try {
    const bundles = await prisma.bundle.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(bundles)
  } catch (error: any) {
    console.error('Error fetching bundles:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })
    return NextResponse.json(
      { error: 'Failed to fetch bundles', details: error.message },
      { status: 500 }
    )
  }
}

// Create a new bundle
export async function POST(request: NextRequest) {
  // Require admin authentication
  const authError = await requireAdminAuth(request)
  if (authError) return authError
  
  try {
    const body = await request.json()
    const { name, slug, description, isActive } = body

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name || '')
    const sanitizedSlug = sanitizeInput(slug || '')
    const sanitizedDescription = sanitizeInput(description || '')

    if (!sanitizedName || !sanitizedSlug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const bundle = await prisma.bundle.create({
      data: {
        name: sanitizedName,
        slug: sanitizedSlug,
        description: sanitizedDescription || null,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(bundle)
  } catch (error: any) {
    console.error('Error creating bundle:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A bundle with this name or slug already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create bundle' },
      { status: 500 }
    )
  }
}

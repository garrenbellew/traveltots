import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { sanitizeInput } from '@/lib/sanitize'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Require admin authentication for creating categories
  const authError = await requireAdminAuth(request)
  if (authError) return authError
  
  try {
    const body = await request.json()
    const { name, slug, description } = body

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

    const category = await prisma.category.create({
      data: {
        name: sanitizedName,
        slug: sanitizedSlug,
        description: sanitizedDescription || null,
      },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Error creating category:', error)
    
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field'
      const value = error.meta?.targetValue || ''
      return NextResponse.json(
        { error: `A category with this ${field} "${value}" already exists. Please use a different name.` },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { sanitizeInput, sanitizeHtml } from '@/lib/sanitize'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: params.id },
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require admin authentication
  const authError = await requireAdminAuth(request)
  if (authError) return authError
  
  try {
    const body = await request.json()
    const { title, slug, content, image, isActive } = body

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title || '')
    const sanitizedSlug = sanitizeInput(slug || '')
    const sanitizedContent = sanitizeHtml(content || '') // HTML content needs HTML sanitization

    // Validate required fields
    if (!sanitizedTitle || !sanitizedSlug || !sanitizedContent) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // Update the page
    const page = await prisma.page.update({
      where: { id: params.id },
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        content: sanitizedContent,
        image: image !== undefined ? image : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    })

    return NextResponse.json(page)
  } catch (error: any) {
    console.error('Error updating page:', error)
    
    // Handle not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Handle unique constraint violation (duplicate slug)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A page with this URL already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Require admin authentication
  const authError = await requireAdminAuth(request)
  if (authError) return authError
  
  try {
    await prisma.page.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting page:', error)

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}


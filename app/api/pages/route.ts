import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { sanitizeInput, sanitizeHtml } from '@/lib/sanitize'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const all = searchParams.get('all')

    const pages = await prisma.page.findMany({
      where: {
        // If 'all=true', show all pages (for admin), otherwise only active pages
        ...(all !== 'true' && { isActive: true }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Create the page
    const page = await prisma.page.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        content: sanitizedContent,
        image: image || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(page)
  } catch (error: any) {
    console.error('Error creating page:', error)
    
    // Handle unique constraint violation (duplicate slug)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A page with this URL already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

// GET - Fetch all active testimonials (public) or all testimonials (admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const all = searchParams.get('all')

    const testimonials = await prisma.testimonial.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(testimonials)
  } catch (error: any) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

// POST - Create a new testimonial (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, location, rating, content, image } = body

    if (!name || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 })
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        location: location || null,
        rating: rating || 5,
        content,
        image: image || null,
        isActive: true,
      },
    })

    return NextResponse.json(testimonial)
  } catch (error: any) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}


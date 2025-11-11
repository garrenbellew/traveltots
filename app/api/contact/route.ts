import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

// Get public contact information
export async function GET(request: NextRequest) {
  try {
    const admin = await prisma.admin.findFirst()
    
    if (!admin) {
      return NextResponse.json({
        email: 'info@traveltots.es', // Default fallback
        phone: null,
      })
    }

    return NextResponse.json({
      email: admin.contactEmail || 'info@traveltots.es', // Default fallback
      phone: admin.contactPhone || null,
    })
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json({
      email: 'info@traveltots.es', // Default fallback
      phone: null,
    })
  }
}


import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

// Get admin settings
export async function GET(request: NextRequest) {
  try {
    // Get the first admin (you can modify this to get the logged-in admin)
    const admin = await prisma.admin.findFirst()
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      whatsappNumber: admin.whatsappNumber || '',
      whatsappMessageConfirmed: admin.whatsappMessageConfirmed || '',
      whatsappMessageDelivered: admin.whatsappMessageDelivered || '',
      whatsappMessageCompleted: admin.whatsappMessageCompleted || '',
      whatsappMessageCancelled: admin.whatsappMessageCancelled || '',
      popularCategories: admin.popularCategories || '',
    })
  } catch (error) {
    console.error('Error fetching admin settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// Update admin settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      whatsappNumber,
      whatsappMessageConfirmed,
      whatsappMessageDelivered,
      whatsappMessageCompleted,
      whatsappMessageCancelled,
      popularCategories,
    } = body

    // Get the first admin (you can modify this to get the logged-in admin)
    const admin = await prisma.admin.findFirst()
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Update the admin with new settings
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        whatsappNumber: whatsappNumber || null,
        whatsappMessageConfirmed: whatsappMessageConfirmed || null,
        whatsappMessageDelivered: whatsappMessageDelivered || null,
        whatsappMessageCompleted: whatsappMessageCompleted || null,
        whatsappMessageCancelled: whatsappMessageCancelled || null,
        popularCategories: (popularCategories && popularCategories.trim()) ? popularCategories.trim() : null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating admin settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings', details: error?.message || String(error) },
      { status: 500 }
    )
  }
}


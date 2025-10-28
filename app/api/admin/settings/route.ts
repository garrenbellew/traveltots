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
    } = body

    // Update the first admin (you can modify this to update the logged-in admin)
    const admin = await prisma.admin.updateMany({
      where: {}, // Update all admins or specific one
      data: {
        whatsappNumber: whatsappNumber || null,
        whatsappMessageConfirmed: whatsappMessageConfirmed || null,
        whatsappMessageDelivered: whatsappMessageDelivered || null,
        whatsappMessageCompleted: whatsappMessageCompleted || null,
        whatsappMessageCancelled: whatsappMessageCancelled || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating admin settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}


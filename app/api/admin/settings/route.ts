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
    console.log('Received settings update:', { 
      hasWhatsapp: !!body.whatsappNumber,
      hasPopularCategories: body.popularCategories !== undefined,
      popularCategories: body.popularCategories
    })
    
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
      console.error('No admin found in database')
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Prepare update data - only include fields that are explicitly provided
    const updateData: any = {}
    
    if (whatsappNumber !== undefined) {
      updateData.whatsappNumber = whatsappNumber || null
    }
    if (whatsappMessageConfirmed !== undefined) {
      updateData.whatsappMessageConfirmed = whatsappMessageConfirmed || null
    }
    if (whatsappMessageDelivered !== undefined) {
      updateData.whatsappMessageDelivered = whatsappMessageDelivered || null
    }
    if (whatsappMessageCompleted !== undefined) {
      updateData.whatsappMessageCompleted = whatsappMessageCompleted || null
    }
    if (whatsappMessageCancelled !== undefined) {
      updateData.whatsappMessageCancelled = whatsappMessageCancelled || null
    }
    if (popularCategories !== undefined) {
      // Handle empty string, undefined, or null - convert to null
      const trimmed = typeof popularCategories === 'string' ? popularCategories.trim() : ''
      updateData.popularCategories = trimmed ? trimmed : null
    }

    console.log('Updating admin with data:', updateData)

    // Update the admin with new settings
    const updated = await prisma.admin.update({
      where: { id: admin.id },
      data: updateData,
    })

    console.log('Admin updated successfully')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating admin settings:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    })
    return NextResponse.json(
      { 
        error: 'Failed to update settings', 
        details: error?.message || String(error),
        code: error?.code,
        meta: error?.meta
      },
      { status: 500 }
    )
  }
}


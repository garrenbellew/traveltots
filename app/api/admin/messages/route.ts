import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, message } = body

    if (!orderId || !message) {
      return NextResponse.json(
        { error: 'Order ID and message are required' },
        { status: 400 }
      )
    }

    // Create message
    const newMessage = await prisma.orderMessage.create({
      data: {
        orderId,
        sender: 'ADMIN',
        message,
      },
    })

    return NextResponse.json({ success: true, message: newMessage })
  } catch (error: any) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}


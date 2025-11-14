import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { sanitizeInput, sanitizeHtml } from '@/lib/sanitize'

export async function POST(request: NextRequest) {
  // Require admin authentication
  const authError = await requireAdminAuth(request)
  if (authError) return authError
  
  try {
    const body = await request.json()
    const { orderId, message } = body

    if (!orderId || !message) {
      return NextResponse.json(
        { error: 'Order ID and message are required' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedOrderId = sanitizeInput(orderId)
    const sanitizedMessage = sanitizeInput(message)

    // Validate orderId format (should be a valid UUID)
    if (!sanitizedOrderId || sanitizedOrderId.length > 100) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      )
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: sanitizedOrderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Create message with sanitized content
    const newMessage = await prisma.orderMessage.create({
      data: {
        orderId: sanitizedOrderId,
        sender: 'ADMIN',
        message: sanitizedMessage,
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


import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find the customer by email
    const customer = await prisma.customer.findUnique({
      where: { email }
    })

    if (!customer) {
      // Don't reveal that the email doesn't exist for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Save the reset token
    await prisma.passwordResetToken.create({
      data: {
        customerId: customer.id,
        token,
        expiresAt
      }
    })

    // In a real implementation, you would send a WhatsApp message here
    // For now, we'll return the reset link (in production, send via WhatsApp)
    const resetUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/customer/reset-password?token=${token}`

    // TODO: Send WhatsApp message with reset link to customer's phone
    console.log('Password reset link:', resetUrl)
    console.log('Send this to customer:', customer.phone)

    return NextResponse.json(
      { 
        message: 'If an account with that email exists, a password reset link has been sent.',
        // In development only - remove in production
        resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error requesting password reset:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
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
    const siteUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) {
      console.error('NEXT_PUBLIC_URL or NEXT_PUBLIC_SITE_URL must be set for password reset')
    }
    const resetUrl = siteUrl ? `${siteUrl}/customer/reset-password?token=${token}` : null

    // TODO: Send WhatsApp message with reset link to customer's phone
    // SECURITY: Only log in development, never in production
    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset link (DEV ONLY):', resetUrl)
      console.log('Send this to customer:', customer.phone)
    }

    // SECURITY: Only return reset URL in development for testing
    // In production, the link should be sent via WhatsApp/email
    const response: any = {
      message: 'If an account with that email exists, a password reset link has been sent.',
    }
    
    // Only include resetUrl in development
    if (process.env.NODE_ENV === 'development' && resetUrl) {
      response.resetUrl = resetUrl
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error('Error requesting password reset:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}


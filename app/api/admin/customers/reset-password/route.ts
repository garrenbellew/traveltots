import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId } = body

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    // Generate a random temporary password (8 characters, alphanumeric)
    const tempPassword = Math.random().toString(36).slice(-8)
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Update the customer's password in the database
    await prisma.customer.update({
      where: { id: customerId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      tempPassword, // Return the plain text password for the admin to share
    })
  } catch (error: any) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}


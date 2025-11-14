/**
 * Refresh token endpoint
 * Generates new access token using refresh token
 */

import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { verifyToken, generateAccessToken, setTokenCookies } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      )
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken)
    
    if (!payload || !payload.adminId || (payload as any).type !== 'refresh') {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    // Verify admin still exists
    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 401 }
      )
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      adminId: admin.id,
      username: admin.username,
      email: admin.email,
    })

    // Update access token cookie
    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error refreshing token:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    )
  }
}


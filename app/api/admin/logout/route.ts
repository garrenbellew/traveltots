/**
 * Logout endpoint
 * Clears JWT tokens and CSRF token
 */

import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { clearTokenCookies } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Clear JWT tokens
    await clearTokenCookies()
    
    // Clear CSRF token
    const cookieStore = await cookies()
    cookieStore.delete('csrf_token')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}


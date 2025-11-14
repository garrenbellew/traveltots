import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { authenticate } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeInput } from '@/lib/sanitize'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 5 attempts per 15 minutes per IP
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    if (!checkRateLimit(`login:${clientIp}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      )
    }

    const { username, password } = await request.json()

    // Sanitize input
    const sanitizedUsername = sanitizeInput(username || '')
    const sanitizedPassword = password || '' // Don't sanitize password, but validate it exists

    if (!sanitizedUsername || !sanitizedPassword) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Additional validation
    if (sanitizedUsername.length > 100 || sanitizedPassword.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      )
    }

    const user = await authenticate(sanitizedUsername, sanitizedPassword)

    if (!user) {
      // Don't reveal whether username exists
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // TODO: Add 2FA verification here

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to authenticate' },
      { status: 500 }
    )
  }
}


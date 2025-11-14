/**
 * Authentication middleware for API routes
 * 
 * SECURITY NOTE: This is a basic implementation. For production, consider:
 * - Using JWT tokens with proper signing/verification
 * - Storing sessions in Redis or database
 * - Implementing proper session expiration
 * - Using httpOnly cookies instead of localStorage
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'

export interface AuthenticatedRequest extends NextRequest {
  adminId?: string
  adminUsername?: string
}

/**
 * Verify admin session from request headers or cookies
 * 
 * Current implementation: Checks for admin_session in Authorization header
 * The client should send: Authorization: Bearer <session_token>
 * 
 * TODO: Implement proper JWT or session store verification
 */
export async function verifyAdminSession(request: NextRequest): Promise<{
  isValid: boolean
  adminId?: string
  adminUsername?: string
  error?: string
}> {
  try {
    // Check for session in Authorization header (Bearer token)
    // Client should send: Authorization: Bearer <admin_session_value>
    const authHeader = request.headers.get('authorization')
    let sessionToken: string | null = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      sessionToken = authHeader.substring(7).trim()
    } else {
      // Fallback: Check for session in cookie
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=')
          acc[key] = decodeURIComponent(value || '')
          return acc
        }, {} as Record<string, string>)
        sessionToken = cookies['admin_session'] || null
      }
    }

    if (!sessionToken || sessionToken === 'null' || sessionToken === 'undefined') {
      return { isValid: false, error: 'No session token provided' }
    }

    // SECURITY: In production, verify the session token against a session store
    // For now, we'll check if an admin exists (basic validation)
    // The session token should ideally be a JWT or reference to a session store
    
    // Verify admin exists (basic check)
    const admin = await prisma.admin.findFirst()

    if (!admin) {
      return { isValid: false, error: 'Admin not found' }
    }

    // TODO: Implement proper session verification
    // - Decode JWT token if using JWT
    // - Check session store if using server-side sessions
    // - Verify token hasn't expired
    // - Verify token signature
    
    // For now, if a token is provided and admin exists, consider it valid
    // This is NOT secure for production - implement proper session management
    
    return {
      isValid: true,
      adminId: admin.id,
      adminUsername: admin.username,
    }
  } catch (error) {
    console.error('Error verifying admin session:', error)
    return { isValid: false, error: 'Session verification failed' }
  }
}

/**
 * Middleware to protect admin API routes
 * Returns 401 if not authenticated
 */
export async function requireAdminAuth(
  request: NextRequest
): Promise<NextResponse | null> {
  const session = await verifyAdminSession(request)

  if (!session.isValid) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in.' },
      { status: 401 }
    )
  }

  return null // Continue to route handler
}

/**
 * Helper to get admin ID from authenticated request
 */
export async function getAdminFromRequest(
  request: NextRequest
): Promise<string | null> {
  const session = await verifyAdminSession(request)
  return session.isValid ? session.adminId || null : null
}


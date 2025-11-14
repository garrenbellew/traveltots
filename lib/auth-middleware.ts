/**
 * Authentication middleware for API routes
 * 
 * Uses JWT tokens for secure session management
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'
import { verifyToken, getTokenFromHeader, getTokenFromCookies } from './jwt'
import { verifyCSRFToken, getCSRFTokenFromHeader } from './csrf'

export interface AuthenticatedRequest extends NextRequest {
  adminId?: string
  adminUsername?: string
}

/**
 * Verify admin session from JWT token in headers or cookies
 * 
 * Checks for JWT token in:
 * 1. Authorization header: Bearer <token>
 * 2. HTTP-only cookie: access_token
 */
export async function verifyAdminSession(request: NextRequest): Promise<{
  isValid: boolean
  adminId?: string
  adminUsername?: string
  error?: string
}> {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get('authorization')
    let token: string | null = getTokenFromHeader(authHeader)

    // If no token in header, try to get from cookie
    if (!token) {
      token = await getTokenFromCookies()
    }

    if (!token) {
      return { isValid: false, error: 'No authentication token provided' }
    }

    // Verify JWT token
    const payload = verifyToken(token)
    
    if (!payload || !payload.adminId) {
      return { isValid: false, error: 'Invalid or expired token' }
    }

    // Verify admin still exists in database
    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
    })

    if (!admin) {
      return { isValid: false, error: 'Admin not found' }
    }

    return {
      isValid: true,
      adminId: payload.adminId,
      adminUsername: payload.username,
    }
  } catch (error) {
    console.error('Error verifying admin session:', error)
    return { isValid: false, error: 'Session verification failed' }
  }
}

/**
 * Middleware to protect admin API routes
 * Returns 401 if not authenticated
 * Also verifies CSRF token for state-changing operations
 */
export async function requireAdminAuth(
  request: NextRequest,
  requireCSRF: boolean = true
): Promise<NextResponse | null> {
  // Verify authentication
  const session = await verifyAdminSession(request)

  if (!session.isValid) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in.' },
      { status: 401 }
    )
  }

  // Verify CSRF token for state-changing operations (POST, PUT, DELETE, PATCH)
  if (requireCSRF) {
    const method = request.method
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const csrfToken = getCSRFTokenFromHeader(request)
      const isValidCSRF = await verifyCSRFToken(csrfToken)
      
      if (!isValidCSRF) {
        return NextResponse.json(
          { error: 'Invalid CSRF token. Please refresh the page and try again.' },
          { status: 403 }
        )
      }
    }
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


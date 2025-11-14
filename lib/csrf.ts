/**
 * CSRF protection utilities
 */

import { randomBytes, createHash } from 'crypto'
import { cookies } from 'next/headers'

const CSRF_TOKEN_LENGTH = 32
const CSRF_COOKIE_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'X-CSRF-Token'

/**
 * Generate a random CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
}

/**
 * Hash a CSRF token for secure storage
 */
export function hashCSRFToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Set CSRF token in cookie (server-side)
 */
export async function setCSRFTokenCookie(token: string) {
  const cookieStore = await cookies()
  
  // Store hashed token in cookie for verification
  const hashedToken = hashCSRFToken(token)
  
  cookieStore.set(CSRF_COOKIE_NAME, hashedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

/**
 * Get CSRF token from cookie (server-side)
 */
export async function getCSRFTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || null
}

/**
 * Verify CSRF token from request
 */
export async function verifyCSRFToken(requestToken: string | null): Promise<boolean> {
  if (!requestToken) {
    return false
  }

  const cookieToken = await getCSRFTokenFromCookie()
  if (!cookieToken) {
    return false
  }

  // Hash the request token and compare with stored hash
  const hashedRequestToken = hashCSRFToken(requestToken)
  return hashedRequestToken === cookieToken
}

/**
 * Get CSRF token from request header
 */
export function getCSRFTokenFromHeader(request: Request): string | null {
  return request.headers.get(CSRF_HEADER_NAME) || null
}

/**
 * Generate and return a new CSRF token (for API endpoint)
 */
export async function generateAndSetCSRFToken(): Promise<string> {
  const token = generateCSRFToken()
  await setCSRFTokenCookie(token)
  return token
}


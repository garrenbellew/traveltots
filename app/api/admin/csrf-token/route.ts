/**
 * API endpoint to get CSRF token
 * Should be called after login to get the CSRF token
 */

import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { generateAndSetCSRFToken } from '@/lib/csrf'
import { requireAdminAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  // Require authentication to get CSRF token
  const authError = await requireAdminAuth(request, false) // Don't require CSRF for GET
  if (authError) return authError

  try {
    const csrfToken = await generateAndSetCSRFToken()
    return NextResponse.json({ csrfToken })
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}


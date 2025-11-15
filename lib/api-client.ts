/**
 * Authenticated API client utility
 * Handles adding Authorization headers and CSRF tokens to admin API requests
 */

let csrfToken: string | null = null

/**
 * Get the current admin session from localStorage (for backward compatibility)
 * Note: JWT tokens are now stored in HTTP-only cookies
 */
export function getAdminSession(): { id?: string; username?: string; email?: string } | null {
  if (typeof window === 'undefined') return null
  
  try {
    const sessionStr = localStorage.getItem('admin_session')
    if (!sessionStr) return null
    
    const session = JSON.parse(sessionStr)
    return session
  } catch (error) {
    console.error('Error parsing admin session:', error)
    return null
  }
}

/**
 * Get CSRF token (fetches from server if not cached)
 */
export async function getCSRFToken(): Promise<string | null> {
  if (csrfToken) return csrfToken

  try {
    const session = getAdminSession()
    const headers: HeadersInit = {}
    
    // Add Authorization header if session exists (for backward compatibility)
    if (session?.id) {
      headers['Authorization'] = `Bearer ${session.id}`
    }
    
    const response = await fetch('/api/admin/csrf-token', {
      credentials: 'include', // Include cookies for JWT tokens
      headers,
    })
    
    if (response.ok) {
      const data = await response.json()
      csrfToken = data.csrfToken
      return csrfToken
    } else {
      console.error('Failed to fetch CSRF token:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
  }
  
  return null
}

/**
 * Set CSRF token (called after login)
 */
export function setCSRFToken(token: string) {
  csrfToken = token
}

/**
 * Clear CSRF token (called on logout)
 */
export function clearCSRFToken() {
  csrfToken = null
}

/**
 * Make an authenticated API request
 * Automatically adds Authorization header and CSRF token
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = getAdminSession()
  const headers = new Headers(options.headers)
  
  // Add Authorization header if session exists (for backward compatibility)
  // JWT tokens are now in HTTP-only cookies, but we keep this for compatibility
  if (session?.id) {
    headers.set('Authorization', `Bearer ${session.id}`)
  }
  
  // Add CSRF token for state-changing operations
  const method = options.method || 'GET'
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const token = await getCSRFToken()
    if (token) {
      headers.set('X-CSRF-Token', token)
    }
  }
  
  // Set Content-Type if not already set and body exists
  // Don't set Content-Type for FormData - browser will set it with boundary
  if (options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for JWT tokens
  })
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAdminSession() !== null
}

/**
 * Clear admin session (logout)
 */
export function clearAdminSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_session')
  }
}


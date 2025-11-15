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
 * 
 * Note: Authentication is handled via JWT cookies, not Authorization header
 */
export async function getCSRFToken(): Promise<string | null> {
  if (csrfToken) return csrfToken

  try {
    // JWT tokens are in HTTP-only cookies, so we just need to include credentials
    const response = await fetch('/api/admin/csrf-token', {
      credentials: 'include', // Include cookies for JWT tokens
    })
    
    if (response.ok) {
      const data = await response.json()
      csrfToken = data.csrfToken
      return csrfToken
    } else {
      console.error('Failed to fetch CSRF token:', response.status, response.statusText)
      // If unauthorized, the user might need to log in again
      if (response.status === 401) {
        console.warn('Not authenticated. User may need to log in again.')
      }
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
 * Automatically adds CSRF token and includes cookies for JWT authentication
 * 
 * Note: JWT tokens are stored in HTTP-only cookies, so we don't need to
 * manually add them to headers. The browser automatically includes cookies
 * when credentials: 'include' is set.
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers)
  
  // Check if user is authenticated (has session in localStorage)
  // This is just for client-side checks - actual auth is via JWT cookies
  const session = getAdminSession()
  if (!session) {
    // If no session, redirect to login (but let the server handle auth)
    console.warn('No admin session found. Request may fail if not authenticated.')
  }
  
  // Add CSRF token for state-changing operations
  const method = options.method || 'GET'
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const token = await getCSRFToken()
    if (token) {
      headers.set('X-CSRF-Token', token)
    } else {
      console.warn('CSRF token not available. Request may fail.')
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
    credentials: 'include', // Include cookies for JWT tokens (this is the key!)
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


/**
 * Authenticated API client utility
 * Handles adding Authorization headers to admin API requests
 */

/**
 * Get the current admin session from localStorage
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
 * Make an authenticated API request
 * Automatically adds Authorization header with admin session
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = getAdminSession()
  
  const headers = new Headers(options.headers)
  
  // Add Authorization header if session exists
  if (session?.id) {
    headers.set('Authorization', `Bearer ${session.id}`)
  }
  
  // Set Content-Type if not already set and body exists
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  
  return fetch(url, {
    ...options,
    headers,
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


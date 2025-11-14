/**
 * Simple in-memory rate limiting
 * For production, use Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

/**
 * Rate limit check
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes default
): boolean {
  const now = Date.now()
  const record = store[identifier]

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    }
    return true
  }

  if (record.count >= maxRequests) {
    return false // Rate limited
  }

  record.count++
  return true
}

/**
 * Get rate limit info
 */
export function getRateLimitInfo(identifier: string): {
  remaining: number
  resetTime: number
} | null {
  const record = store[identifier]
  if (!record) return null

  return {
    remaining: Math.max(0, 5 - record.count), // Assuming max 5
    resetTime: record.resetTime,
  }
}

/**
 * Clean up expired entries periodically
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })
  }, 60 * 1000) // Clean up every minute
}


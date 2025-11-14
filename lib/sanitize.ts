/**
 * HTML sanitization utilities to prevent XSS attacks
 */

/**
 * Basic HTML sanitization - removes script tags and dangerous attributes
 * For production, use a library like DOMPurify
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '')
  
  // Remove data: URLs that could contain scripts
  sanitized = sanitized.replace(/data:text\/html/gi, '')
  
  return sanitized
}

/**
 * Sanitize user input for database queries
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '')
  
  // Trim whitespace
  sanitized = sanitized.trim()
  
  // Limit length (adjust as needed)
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000)
  }
  
  return sanitized
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  // Allow international format with + and numbers
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''))
}


/**
 * Simple in-memory rate limiting utility
 * Tracks requests by key (IP, email, etc) within time windows
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

/**
 * Check if request should be rate limited
 * @param key - Unique identifier (IP, email, etc)
 * @param limit - Max requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request should be allowed, false if rate limited
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetTime) {
    // Create new window
    store.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  // Within existing window
  if (entry.count < limit) {
    entry.count++
    return true
  }

  return false
}

/**
 * Get remaining requests for current window
 */
export function getRemainingRequests(
  key: string,
  limit: number
): number {
  const entry = store.get(key)
  if (!entry) return limit
  return Math.max(0, limit - entry.count)
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
  store.delete(key)
}

/**
 * Common rate limit configurations
 */
export const rateLimits = {
  login: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 per 15 minutes
  register: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  forgotPassword: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  api: { limit: 100, windowMs: 60 * 1000 }, // 100 per minute
}

/**
 * Cleanup old entries periodically (runs every 5 minutes)
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

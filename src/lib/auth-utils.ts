import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const PASSWORD_SALT_ROUNDS = 10

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcryptjs.genSalt(PASSWORD_SALT_ROUNDS)
    return await bcryptjs.hash(password, salt)
  } catch (error) {
    throw new Error('Failed to hash password')
  }
}

/**
 * Compare plaintext password with hashed password
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcryptjs.compare(plainPassword, hashedPassword)
  } catch (error) {
    throw new Error('Failed to compare passwords')
  }
}

/**
 * Create JWT token
 */
export function createToken(payload: {
  id: string
  email: string
  role: string
  name: string
}): string {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7days',
      algorithm: 'HS256'
    })
  } catch (error) {
    throw new Error('Failed to create token')
  }
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): {
  id: string
  email: string
  role: string
  name: string
} | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    }) as {
      id: string
      email: string
      role: string
      name: string
      iat: number
      exp: number
    }
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    }
  } catch (error) {
    return null
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

/**
 * Extract token from cookie
 */
export function extractTokenFromCookie(cookieHeader?: string, cookieName = 'auth_token'): string | null {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === cookieName) {
      return decodeURIComponent(value)
    }
  }
  return null
}

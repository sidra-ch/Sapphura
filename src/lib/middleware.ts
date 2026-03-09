import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'

/**
 * Middleware to verify authentication
 */
export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    try {
      // Get token from cookie
      const token = request.cookies.get('auth_token')?.value

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // Verify token
      const decoded = verifyToken(token)

      if (!decoded) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Add user info to request
      const requestWithUser = request.clone()
      ;(requestWithUser as any).user = decoded

      return handler(requestWithUser)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to verify authentication' },
        { status: 500 }
      )
    }
  }
}

/**
 * Middleware to check user role/permissions
 */
export function withRole(roles: string[], handler: Function) {
  return async (request: NextRequest) => {
    try {
      const token = request.cookies.get('auth_token')?.value

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        )
      }

      const decoded = verifyToken(token)

      if (!decoded || !roles.includes(decoded.role)) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: insufficient permissions' },
          { status: 403 }
        )
      }

      const requestWithUser = request.clone()
      ;(requestWithUser as any).user = decoded

      return handler(requestWithUser)
    } catch (error) {
      console.error('Role middleware error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to verify permissions' },
        { status: 500 }
      )
    }
  }
}

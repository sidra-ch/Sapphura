import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify session' },
      { status: 500 }
    )
  }
}

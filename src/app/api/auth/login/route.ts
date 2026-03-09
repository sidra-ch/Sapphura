import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { loginSchema } from '@/lib/validation'
import { comparePassword, createToken } from '@/lib/auth-utils'
import { checkRateLimit, rateLimits } from '@/lib/rate-limit'
import { validationError, unauthorizedResponse, rateLimitResponse } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    if (!checkRateLimit(`login:${ip}`, rateLimits.login.limit, rateLimits.login.windowMs)) {
      return rateLimitResponse()
    }

    const body = await request.json()

    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    const { email, password } = validationResult.data

    // Check database for user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if email exists (security best practice)
      return unauthorizedResponse('Invalid email or password')
    }

    // Compare password
    const passwordMatch = await comparePassword(password, user.password)

    if (!passwordMatch) {
      return unauthorizedResponse('Invalid email or password')
    }

    // Create JWT token
    const token = createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    })

    // Set secure HTTP-only cookie with JWT token
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)

    if (error instanceof Error && error.message.includes('JWT_SECRET')) {
      return NextResponse.json(
        { success: false, error: 'Server auth is not configured. Please set JWT_SECRET in environment variables.' },
        { status: 500 }
      )
    }

    if (error instanceof Error && error.message.includes('.prisma/client')) {
      return NextResponse.json(
        { success: false, error: 'Prisma client is not generated. Run: npm run db:generate' },
        { status: 500 }
      )
    }

    if (error instanceof Error && (
      error.message.includes('P1001') ||
      error.message.includes('DatabaseNotReachable') ||
      error.message.includes('Can\'t reach database server')
    )) {
      return NextResponse.json(
        { success: false, error: 'Database is not configured for production. Please set DATABASE_URL in Vercel environment variables.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}

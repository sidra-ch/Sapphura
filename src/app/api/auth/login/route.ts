import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { loginSchema } from '@/lib/validation'
import { comparePassword, createToken, hashPassword } from '@/lib/auth-utils'
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

    const rawBody = await request.json()
    const body = {
      ...rawBody,
      email: typeof rawBody?.email === 'string' ? rawBody.email.trim().toLowerCase() : rawBody?.email,
    }

    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    const { email, password } = validationResult.data
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()

    // Check database for user (case-insensitive for legacy records)
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    })

    if (!user) {
      // Don't reveal if email exists (security best practice)
      return unauthorizedResponse('Invalid email or password')
    }

    // Compare password (support legacy plaintext values and migrate)
    let passwordMatch = false

    try {
      passwordMatch = await comparePassword(trimmedPassword, user.password)
    } catch {
      passwordMatch = false
    }

    const isLegacyPlaintext = !passwordMatch && user.password === trimmedPassword

    if (isLegacyPlaintext) {
      passwordMatch = true
      const migratedHash = await hashPassword(trimmedPassword)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: migratedHash,
          email: normalizedEmail,
        },
      })
    }

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

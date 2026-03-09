import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { registerSchema } from '@/lib/validation'
import { hashPassword, createToken } from '@/lib/auth-utils'
import { checkRateLimit, rateLimits } from '@/lib/rate-limit'
import { validationError, rateLimitResponse } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    if (!checkRateLimit(`register:${ip}`, rateLimits.register.limit, rateLimits.register.windowMs)) {
      return rateLimitResponse()
    }

    const body = await request.json()

    // Validate input
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    const { name, email, password } = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      }
    })

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
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}

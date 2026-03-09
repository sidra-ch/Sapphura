import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { passwordResetSchema } from '@/lib/validation'
import { sendEmail, generatePasswordResetEmail } from '@/lib/email-service'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = passwordResetSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return same message for security (don't reveal if email exists)
    // But still generate token and send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

      // Store reset token (expires in 1 hour)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

      await prisma.passwordReset.create({
        data: {
          email: user.email,
          token: resetToken,
          tokenHash: resetTokenHash,
          expiresAt
        }
      })

      // Generate reset link
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://sappura.com'}/reset-password?token=${resetToken}`

      // Send password reset email
      const emailHtml = generatePasswordResetEmail({
        name: user.name,
        resetLink
      })

      await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        html: emailHtml
      })
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    )
  }
}

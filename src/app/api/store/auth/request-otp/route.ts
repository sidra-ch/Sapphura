import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendEmail, generateOTPEmail } from '@/lib/email-service'
import { checkRateLimit, rateLimits } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    if (!checkRateLimit(`otp:${ip}`, rateLimits.login.limit, rateLimits.login.windowMs)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })
    }

    const { email } = await request.json()
    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Upsert customer (create if doesn't exist)
    await prisma.customer.upsert({
      where: { email: normalizedEmail },
      update: {
        otp,
        otpExpiry,
      },
      create: {
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
        otp,
        otpExpiry,
      },
    })

    // Send Email
    const emailSent = await sendEmail({
      to: normalizedEmail,
      subject: 'Your Sappura Code',
      html: generateOTPEmail({ otp }),
    })

    if (!emailSent) {
      return NextResponse.json({ success: false, error: 'Failed to send OTP email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Request OTP error:', error)
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 })
  }
}

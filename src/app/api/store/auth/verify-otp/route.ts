import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createToken } from '@/lib/auth-utils'

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()
    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP are required' }, { status: 400 })
    }

    const customer = await prisma.customer.findUnique({
      where: { email: normalizedEmail },
    })

    if (!customer) {
      return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 })
    }

    if (customer.otp !== otp) {
      return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 401 })
    }

    if (!customer.otpExpiry || customer.otpExpiry < new Date()) {
      return NextResponse.json({ success: false, error: 'OTP has expired' }, { status: 401 })
    }

    // OTP is valid. Clear the OTP and mark as verified!
    const updatedCustomer = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        otp: null,
        otpExpiry: null,
        verified: true,
      },
    })

    // Create JWT token for Customer
    const token = createToken({
      id: updatedCustomer.id,
      email: updatedCustomer.email,
      name: updatedCustomer.name,
      role: 'CUSTOMER'
    })

    const response = NextResponse.json({
      success: true,
      customer: {
        id: updatedCustomer.id,
        email: updatedCustomer.email,
        name: updatedCustomer.name,
      },
      token
    })

    // Set HTTP-only cookie using 'store_auth_token' to not conflict with 'auth_token' (used by Admin)
    response.cookies.set('store_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    return response
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ success: false, error: 'An error occurred' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth-utils'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const token = cookies().get('store_auth_token')?.value

    if (!token) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 })
    }

    const payload = verifyToken(token)

    if (!payload || payload.role !== 'CUSTOMER') {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 })
    }

    // Always fetch fresh customer data just in case
    const customer = await prisma.customer.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        totalOrders: true,
        totalSpent: true,
      }
    })

    if (!customer) {
       return NextResponse.json({ success: false, authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: customer
    })
  } catch (error) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 })
  }
}

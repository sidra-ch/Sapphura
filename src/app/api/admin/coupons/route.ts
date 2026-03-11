import { NextResponse } from 'next/server'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export async function GET(request: Request) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const coupons = await prisma.coupon.findMany({
      where: active === null ? {} : { active: active === 'true' },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, coupons, count: coupons.length })
  } catch (error) {
    console.error('Failed to fetch coupons:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch coupons' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      minAmount,
      validFrom,
      validUntil,
      active,
    } = body

    if (!code || !discountType || discountValue === undefined || !validFrom || !validUntil) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    if (!['PERCENTAGE', 'FIXED_AMOUNT'].includes(String(discountType).toUpperCase())) {
      return NextResponse.json({ success: false, error: 'Invalid discount type' }, { status: 400 })
    }

    const parsedDiscountValue = Number(discountValue)
    if (!Number.isFinite(parsedDiscountValue) || parsedDiscountValue <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid discount value' }, { status: 400 })
    }

    const parsedValidFrom = parseDate(validFrom)
    const parsedValidUntil = parseDate(validUntil)
    if (!parsedValidFrom || !parsedValidUntil || parsedValidUntil <= parsedValidFrom) {
      return NextResponse.json({ success: false, error: 'Invalid validity dates' }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: String(code).trim().toUpperCase(),
        description: description ? String(description).trim() : null,
        discountType: String(discountType).toUpperCase() as 'PERCENTAGE' | 'FIXED_AMOUNT',
        discountValue: parsedDiscountValue,
        maxUses: maxUses !== undefined && maxUses !== null ? Number(maxUses) : null,
        minAmount: minAmount !== undefined && minAmount !== null ? Number(minAmount) : 0,
        validFrom: parsedValidFrom,
        validUntil: parsedValidUntil,
        active: typeof active === 'boolean' ? active : true,
      },
    })

    return NextResponse.json({ success: true, coupon }, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 409 })
    }
    console.error('Failed to create coupon:', error)
    return NextResponse.json({ success: false, error: 'Failed to create coupon' }, { status: 500 })
  }
}

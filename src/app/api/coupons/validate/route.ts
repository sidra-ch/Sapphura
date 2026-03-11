import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const code = String(body?.code || '').trim().toUpperCase()
    const orderAmount = Number(body?.orderAmount || 0)

    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({ where: { code } })
    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 404 })
    }

    const now = new Date()
    if (!coupon.active || coupon.validFrom > now || coupon.validUntil < now) {
      return NextResponse.json({ success: false, error: 'Coupon is not active' }, { status: 400 })
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 400 })
    }

    if (orderAmount < coupon.minAmount) {
      return NextResponse.json(
        { success: false, error: `Minimum order amount is ${coupon.minAmount}` },
        { status: 400 }
      )
    }

    const discount = coupon.discountType === 'PERCENTAGE'
      ? (orderAmount * coupon.discountValue) / 100
      : coupon.discountValue

    const appliedDiscount = Math.max(0, Math.min(discount, orderAmount))
    const finalAmount = Math.max(0, orderAmount - appliedDiscount)

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount: Number(appliedDiscount.toFixed(2)),
      finalAmount: Number(finalAmount.toFixed(2)),
    })
  } catch (error) {
    console.error('Failed to validate coupon:', error)
    return NextResponse.json({ success: false, error: 'Failed to validate coupon' }, { status: 500 })
  }
}

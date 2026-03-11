import { NextResponse } from 'next/server'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'
import prisma from '@/lib/prisma'

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const data: Record<string, unknown> = {}

    if (code !== undefined) data.code = String(code).trim().toUpperCase()
    if (description !== undefined) data.description = description ? String(description).trim() : null
    if (discountType !== undefined) {
      const normalized = String(discountType).toUpperCase()
      if (!['PERCENTAGE', 'FIXED_AMOUNT'].includes(normalized)) {
        return NextResponse.json({ success: false, error: 'Invalid discount type' }, { status: 400 })
      }
      data.discountType = normalized
    }
    if (discountValue !== undefined) {
      const parsed = Number(discountValue)
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return NextResponse.json({ success: false, error: 'Invalid discount value' }, { status: 400 })
      }
      data.discountValue = parsed
    }
    if (maxUses !== undefined) data.maxUses = maxUses === null ? null : Number(maxUses)
    if (minAmount !== undefined) data.minAmount = minAmount === null ? 0 : Number(minAmount)
    if (validFrom !== undefined) {
      const parsed = parseDate(validFrom)
      if (!parsed) return NextResponse.json({ success: false, error: 'Invalid validFrom date' }, { status: 400 })
      data.validFrom = parsed
    }
    if (validUntil !== undefined) {
      const parsed = parseDate(validUntil)
      if (!parsed) return NextResponse.json({ success: false, error: 'Invalid validUntil date' }, { status: 400 })
      data.validUntil = parsed
    }
    if (active !== undefined) data.active = Boolean(active)

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json({ success: true, coupon })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 })
    }
    if (error?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Coupon code already exists' }, { status: 409 })
    }
    console.error('Failed to update coupon:', error)
    return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.coupon.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 })
    }
    console.error('Failed to delete coupon:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete coupon' }, { status: 500 })
  }
}

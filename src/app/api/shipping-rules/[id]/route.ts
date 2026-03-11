import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

const ensureShippingRulesTable = async () => {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS shipping_rules (
      id TEXT PRIMARY KEY,
      region TEXT NOT NULL,
      cost DOUBLE PRECISION NOT NULL DEFAULT 0,
      free_shipping_threshold DOUBLE PRECISION,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await ensureShippingRulesTable()

    const body = await request.json()
    const region = body?.region !== undefined ? String(body.region).trim() : undefined
    const cost = body?.cost !== undefined ? Number(body.cost) : undefined
    const freeShippingThreshold = body?.freeShippingThreshold !== undefined
      ? (body.freeShippingThreshold === null ? null : Number(body.freeShippingThreshold))
      : undefined

    if ((cost !== undefined && !Number.isFinite(cost)) || (freeShippingThreshold !== undefined && freeShippingThreshold !== null && !Number.isFinite(freeShippingThreshold))) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    await prisma.$executeRawUnsafe(
      `UPDATE shipping_rules SET
        region = COALESCE($1, region),
        cost = COALESCE($2, cost),
        free_shipping_threshold = COALESCE($3, free_shipping_threshold)
       WHERE id = $4`,
      region ?? null,
      cost ?? null,
      freeShippingThreshold ?? null,
      params.id
    )

    const updated = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, region, cost, free_shipping_threshold, created_at
       FROM shipping_rules WHERE id = $1 LIMIT 1`,
      params.id
    )

    if (!updated[0]) {
      return NextResponse.json({ success: false, error: 'Shipping rule not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, shippingRule: updated[0] })
  } catch (error) {
    console.error('Failed to update shipping rule:', error)
    return NextResponse.json({ success: false, error: 'Failed to update shipping rule' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await ensureShippingRulesTable()

    const deleted = await prisma.$queryRawUnsafe<any[]>(
      `DELETE FROM shipping_rules WHERE id = $1 RETURNING id`,
      params.id
    )

    if (!deleted.length) {
      return NextResponse.json({ success: false, error: 'Shipping rule not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Shipping rule deleted successfully' })
  } catch (error) {
    console.error('Failed to delete shipping rule:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete shipping rule' }, { status: 500 })
  }
}

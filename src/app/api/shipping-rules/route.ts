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

export async function GET() {
  try {
    await ensureShippingRulesTable()

    const rules = await prisma.$queryRawUnsafe<any[]>(`
      SELECT id, region, cost, free_shipping_threshold, created_at
      FROM shipping_rules
      ORDER BY created_at DESC
    `)

    return NextResponse.json({ success: true, shippingRules: rules, count: rules.length })
  } catch (error) {
    console.error('Failed to fetch shipping rules:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch shipping rules' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await ensureShippingRulesTable()

    const body = await request.json()
    const region = String(body?.region || '').trim()
    const cost = Number(body?.cost)
    const freeShippingThreshold =
      body?.freeShippingThreshold !== undefined && body?.freeShippingThreshold !== null
        ? Number(body.freeShippingThreshold)
        : null

    if (!region || !Number.isFinite(cost)) {
      return NextResponse.json({ success: false, error: 'Invalid shipping rule payload' }, { status: 400 })
    }

    if (freeShippingThreshold !== null && !Number.isFinite(freeShippingThreshold)) {
      return NextResponse.json({ success: false, error: 'Invalid freeShippingThreshold' }, { status: 400 })
    }

    const id = crypto.randomUUID()

    await prisma.$executeRawUnsafe(
      `INSERT INTO shipping_rules (id, region, cost, free_shipping_threshold)
       VALUES ($1, $2, $3, $4)`,
      id,
      region,
      cost,
      freeShippingThreshold
    )

    const inserted = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, region, cost, free_shipping_threshold, created_at
       FROM shipping_rules WHERE id = $1 LIMIT 1`,
      id
    )

    return NextResponse.json({ success: true, shippingRule: inserted[0] }, { status: 201 })
  } catch (error) {
    console.error('Failed to create shipping rule:', error)
    return NextResponse.json({ success: false, error: 'Failed to create shipping rule' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

const ensureCampaignsTable = async () => {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      banner_image TEXT,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      discount DOUBLE PRECISION NOT NULL DEFAULT 0,
      featured_products TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `)
}

const parseDate = (value: string) => {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export async function GET() {
  try {
    await ensureCampaignsTable()

    const campaigns = await prisma.$queryRawUnsafe<any[]>(`
      SELECT id, name, banner_image, start_date, end_date, discount, featured_products, created_at
      FROM campaigns
      ORDER BY created_at DESC
    `)

    return NextResponse.json({ success: true, campaigns })
  } catch (error) {
    console.error('Failed to fetch campaigns:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await ensureCampaignsTable()

    const body = await request.json()
    const name = String(body?.name || '').trim()
    const bannerImage = body?.bannerImage ? String(body.bannerImage).trim() : null
    const startDate = parseDate(String(body?.startDate || ''))
    const endDate = parseDate(String(body?.endDate || ''))
    const discount = Number(body?.discount || 0)
    const featuredProducts = Array.isArray(body?.featuredProducts)
      ? body.featuredProducts.map((item: unknown) => String(item))
      : []

    if (!name || !startDate || !endDate || !Number.isFinite(discount)) {
      return NextResponse.json({ success: false, error: 'Invalid campaign payload' }, { status: 400 })
    }

    if (endDate <= startDate) {
      return NextResponse.json({ success: false, error: 'endDate must be after startDate' }, { status: 400 })
    }

    const id = crypto.randomUUID()

    await prisma.$executeRawUnsafe(
      `INSERT INTO campaigns (id, name, banner_image, start_date, end_date, discount, featured_products)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      id,
      name,
      bannerImage,
      startDate,
      endDate,
      discount,
      featuredProducts
    )

    const inserted = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, banner_image, start_date, end_date, discount, featured_products, created_at
       FROM campaigns WHERE id = $1 LIMIT 1`,
      id
    )

    return NextResponse.json({ success: true, campaign: inserted[0] }, { status: 201 })
  } catch (error) {
    console.error('Failed to create campaign:', error)
    return NextResponse.json({ success: false, error: 'Failed to create campaign' }, { status: 500 })
  }
}

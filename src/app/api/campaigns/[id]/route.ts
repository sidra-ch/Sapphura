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

const parseDate = (value?: string) => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await ensureCampaignsTable()

    const body = await request.json()
    const name = body?.name !== undefined ? String(body.name).trim() : undefined
    const bannerImage = body?.bannerImage !== undefined ? (body.bannerImage ? String(body.bannerImage).trim() : null) : undefined
    const startDate = body?.startDate !== undefined ? parseDate(String(body.startDate)) : undefined
    const endDate = body?.endDate !== undefined ? parseDate(String(body.endDate)) : undefined
    const discount = body?.discount !== undefined ? Number(body.discount) : undefined
    const featuredProducts = body?.featuredProducts !== undefined
      ? (Array.isArray(body.featuredProducts) ? body.featuredProducts.map((item: unknown) => String(item)) : [])
      : undefined

    if (startDate === null || endDate === null || (discount !== undefined && !Number.isFinite(discount))) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    if (startDate && endDate && endDate <= startDate) {
      return NextResponse.json({ success: false, error: 'endDate must be after startDate' }, { status: 400 })
    }

    await prisma.$executeRawUnsafe(
      `UPDATE campaigns SET
        name = COALESCE($1, name),
        banner_image = CASE WHEN $2::text IS NULL THEN banner_image ELSE $2 END,
        start_date = COALESCE($3, start_date),
        end_date = COALESCE($4, end_date),
        discount = COALESCE($5, discount),
        featured_products = COALESCE($6, featured_products)
       WHERE id = $7`,
      name ?? null,
      bannerImage ?? null,
      startDate ?? null,
      endDate ?? null,
      discount ?? null,
      featuredProducts ?? null,
      params.id
    )

    const updated = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, banner_image, start_date, end_date, discount, featured_products, created_at
       FROM campaigns WHERE id = $1 LIMIT 1`,
      params.id
    )

    if (!updated[0]) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, campaign: updated[0] })
  } catch (error) {
    console.error('Failed to update campaign:', error)
    return NextResponse.json({ success: false, error: 'Failed to update campaign' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await ensureCampaignsTable()

    const deleted = await prisma.$queryRawUnsafe<any[]>(
      `DELETE FROM campaigns WHERE id = $1 RETURNING id`,
      params.id
    )

    if (!deleted.length) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Campaign deleted successfully' })
  } catch (error) {
    console.error('Failed to delete campaign:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete campaign' }, { status: 500 })
  }
}

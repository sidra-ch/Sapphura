import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' }
    })
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
    const body = await request.json()
    const { name, bannerImage, startDate, endDate, discount, featuredProducts } = body

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'Name, Start Date, and End Date are required' }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (end <= start) {
      return NextResponse.json({ success: false, error: 'End Date must be after Start Date' }, { status: 400 })
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        bannerImage: bannerImage || null,
        startDate: start,
        endDate: end,
        discount: Number(discount) || 0,
        featuredProducts: Array.isArray(featuredProducts) ? featuredProducts : [],
        isActive: body.isActive !== undefined ? body.isActive : true,
      }
    })

    return NextResponse.json({ success: true, campaign }, { status: 201 })
  } catch (error) {
    console.error('Failed to create campaign:', error)
    return NextResponse.json({ success: false, error: 'Failed to create campaign' }, { status: 500 })
  }
}

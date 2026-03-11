import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rules = await prisma.shippingRule.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, rules })
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
    const body = await request.json()
    const { region, cost, freeShippingThreshold, isActive } = body

    if (!region) {
      return NextResponse.json({ success: false, error: 'Region is required' }, { status: 400 })
    }

    const rule = await prisma.shippingRule.create({
      data: {
        region,
        cost: Number(cost) || 0,
        freeShippingThreshold: freeShippingThreshold ? Number(freeShippingThreshold) : null,
        isActive: isActive !== undefined ? isActive : true,
      }
    })

    return NextResponse.json({ success: true, rule }, { status: 201 })
  } catch (error) {
    console.error('Failed to create shipping rule:', error)
    return NextResponse.json({ success: false, error: 'Failed to create shipping rule' }, { status: 500 })
  }
}

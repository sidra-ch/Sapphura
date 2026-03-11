import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const body = await request.json()
    const { region, cost, freeShippingThreshold, isActive } = body

    const rule = await prisma.shippingRule.update({
      where: { id },
      data: {
        ...(region && { region }),
        ...(cost !== undefined && { cost: Number(cost) }),
        ...(freeShippingThreshold !== undefined && { freeShippingThreshold: freeShippingThreshold ? Number(freeShippingThreshold) : null }),
        ...(isActive !== undefined && { isActive }),
      }
    })

    return NextResponse.json({ success: true, rule })
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
    const { id } = params
    await prisma.shippingRule.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete shipping rule' }, { status: 500 })
  }
}

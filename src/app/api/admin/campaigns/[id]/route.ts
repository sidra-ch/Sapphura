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
    const { name, bannerImage, startDate, endDate, discount, featuredProducts, isActive } = body

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(bannerImage !== undefined && { bannerImage }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(discount !== undefined && { discount: Number(discount) }),
        ...(featuredProducts && { featuredProducts }),
        ...(isActive !== undefined && { isActive }),
      }
    })

    return NextResponse.json({ success: true, campaign })
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
    const { id } = params
    await prisma.campaign.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete campaign' }, { status: 500 })
  }
}

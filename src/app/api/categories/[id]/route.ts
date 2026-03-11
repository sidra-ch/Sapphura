import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const authUser = getAuthUserFromRequest(request)
    if (!authUser || !isAdminRole(authUser.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const data: Record<string, unknown> = {}
    if (body?.name !== undefined) data.name = String(body.name).trim()
    if (body?.slug !== undefined) data.slug = normalizeSlug(String(body.slug))
    if (body?.description !== undefined) data.description = body.description ? String(body.description).trim() : null
    if (body?.image !== undefined) data.image = body.image ? String(body.image).trim() : null

    const category = await prisma.category.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }
    if (error?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Category name or slug already exists' }, { status: 409 })
    }
  console.error('Error updating category:', error)
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const authUser = getAuthUserFromRequest(request)
    if (!authUser || !isAdminRole(authUser.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.category.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
    }
    console.error('Error deleting category:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      categories,
      count: categories.length,
    })
  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create category (admin)
export async function POST(request: Request) {
  try {
    const authUser = getAuthUserFromRequest(request)
    if (!authUser || !isAdminRole(authUser.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const name = String(body?.name || '').trim()
    const slug = String(body?.slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    const description = body?.description ? String(body.description).trim() : null
    const image = body?.image ? String(body.image).trim() : null

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: 'Name and slug are required' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    })

    return NextResponse.json({ success: true, category }, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Category name or slug already exists' }, { status: 409 })
    }
    console.error('❌ Error creating category:', error)
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}

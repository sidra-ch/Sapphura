import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')
    const includeProducts = searchParams.get('includeProducts') === 'true'

    if (slug) {
      // Get specific collection by slug
      const collection = await prisma.collection.findFirst({
        where: {
          slug,
          isActive: true
        },
        include: includeProducts ? {
          products: {
            where: {
              product: { isActive: true }
            },
            include: {
              product: true
            },
            orderBy: { sortOrder: 'asc' },
            take: limit
          }
        } : undefined
      })

      if (!collection) {
        return NextResponse.json(
          { success: false, error: 'Collection not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        collection
      })
    }

    // Get collections with optional filtering
    const where: any = {
      isActive: true
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    const collections = await prisma.collection.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      include: includeProducts ? {
        products: {
          where: {
            product: { isActive: true }
          },
          include: {
            product: true
          },
          take: 5,
          orderBy: { sortOrder: 'asc' }
        }
      } : undefined
    })

    return NextResponse.json({
      success: true,
      collections
    })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, image, bannerImage, type, showInMenu, showOnHome, sortOrder } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingCollection = await prisma.collection.findFirst({
      where: { slug }
    })

    if (existingCollection) {
      return NextResponse.json(
        { success: false, error: 'Collection with this slug already exists' },
        { status: 409 }
      )
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description,
        image,
        bannerImage,
        type: type?.toUpperCase() || 'STANDARD',
        showInMenu: showInMenu !== undefined ? showInMenu : true,
        showOnHome: showOnHome !== undefined ? showOnHome : true,
        sortOrder: sortOrder || 0
      }
    })

    return NextResponse.json({
      success: true,
      collection
    })
  } catch (error) {
    console.error('Error creating collection:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Collection ID is required' },
        { status: 400 }
      )
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      collection
    })
  } catch (error) {
    console.error('Error updating collection:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update collection' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Collection ID is required' },
        { status: 400 }
      )
    }

    await prisma.collection.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getDynamicMediaLibrary } from '@/lib/cloudinary'
import { toCatalogProducts } from '@/lib/cloudinary-catalog'

export const dynamic = 'force-dynamic'

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

// GET /api/products/[id] - Get single product by ID or slug
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        reviews: true,
      },
    })

    if (product) {
      const relatedProducts = await prisma.product.findMany({
        where: {
          category: product.category,
          NOT: { id: product.id },
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({
        success: true,
        product,
        relatedProducts,
        source: 'database',
      })
    }

    const requestedId = decodeURIComponent(id)
    const media = await getDynamicMediaLibrary()
    const cloudinaryProducts = toCatalogProducts(
      media.allAssets.filter((asset) => asset.resourceType === 'image')
    )

    const target = cloudinaryProducts.find(
      (item) => item.publicId.toLowerCase() === requestedId.toLowerCase() || item.slug.toLowerCase() === id.toLowerCase()
    )

    if (!target) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const relatedProducts = cloudinaryProducts
      .filter((item) => item.publicId !== target.publicId && item.category === target.category)
      .slice(0, 4)

    return NextResponse.json({
      success: true,
      product: {
        ...target,
        reviews: [],
      },
      relatedProducts,
      source: 'cloudinary',
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const product = await prisma.product.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

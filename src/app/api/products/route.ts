import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getDynamicMediaLibrary } from '@/lib/cloudinary'
import { toCatalogProducts } from '@/lib/cloudinary-catalog'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const filterCloudinaryProducts = (products: ReturnType<typeof toCatalogProducts>, category: string | null, limit: string | null) => {
  const normalizedCategory = category?.toLowerCase()
  return products
    .filter((item) => {
      if (!normalizedCategory || normalizedCategory === 'all') return true
      const haystack = `${item.category} ${item.name} ${item.description}`.toLowerCase()
      return haystack.includes(normalizedCategory)
    })
    .slice(0, limit ? parseInt(limit) : undefined)
}

// GET /api/products - Get all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    const where = category && category !== 'all'
      ? { category: { contains: category, mode: 'insensitive' as const } }
      : {}

    const products = await prisma.product.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { createdAt: 'desc' },
    })

    if (products.length > 0) {
      return NextResponse.json({ success: true, products, count: products.length, source: 'database' })
    }

    const media = await getDynamicMediaLibrary()
    const cloudinaryProducts = toCatalogProducts(
      media.allAssets.filter((asset) => asset.resourceType === 'image')
    )
    const filteredProducts = filterCloudinaryProducts(cloudinaryProducts, category, limit)

    return NextResponse.json({ success: true, products: filteredProducts, count: filteredProducts.length, source: 'cloudinary' })
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    try {
      const { searchParams } = new URL(request.url)
      const category = searchParams.get('category')
      const limit = searchParams.get('limit')

      const media = await getDynamicMediaLibrary()
      const cloudinaryProducts = toCatalogProducts(
        media.allAssets.filter((asset) => asset.resourceType === 'image')
      )
      const filteredProducts = filterCloudinaryProducts(cloudinaryProducts, category, limit)

      return NextResponse.json({ success: true, products: filteredProducts, count: filteredProducts.length, source: 'cloudinary' })
    } catch {
      return NextResponse.json({ success: true, products: [], count: 0, source: 'none' })
    }
  }
}

// POST /api/products - Create a product
export async function POST(request: Request) {
  try {
    const authUser = getAuthUserFromRequest(request)
    if (!authUser || !isAdminRole(authUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      images,
      sizes,
      stock,
      features,
      inStock,
    } = body

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, description, price and category are required' },
        { status: 400 }
      )
    }

    const validImages = Array.isArray(images)
      ? images.filter((img: string) => typeof img === 'string' && img.trim().length > 0)
      : []

    const validSizes = Array.isArray(sizes)
      ? sizes.filter((size: string) => typeof size === 'string' && size.trim().length > 0)
      : ['Standard']

    const validFeatures = Array.isArray(features)
      ? features.filter((item: string) => typeof item === 'string' && item.trim().length > 0)
      : []

    let baseSlug = slugify(name)
    if (!baseSlug) {
      baseSlug = `product-${Date.now()}`
    }

    let finalSlug = baseSlug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`
      counter += 1
    }

    const parsedPrice = Number(price)
    const parsedOriginalPrice = originalPrice ? Number(originalPrice) : null
    const parsedStock = Number.isFinite(Number(stock)) ? Number(stock) : 0

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be a valid positive number' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        price: parsedPrice,
        originalPrice: parsedOriginalPrice && Number.isFinite(parsedOriginalPrice)
          ? parsedOriginalPrice
          : null,
        category: category.trim(),
        images: validImages,
        sizes: validSizes,
        features: validFeatures,
        stock: parsedStock,
        inStock: typeof inStock === 'boolean' ? inStock : parsedStock > 0,
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

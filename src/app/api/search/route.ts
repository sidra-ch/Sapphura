import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, products: [] })
    }
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } }
        ],
        isActive: true, // Only show active products
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        images: true,
        category: true,
      },
      take: 5, // Limit simply to 5 for autocomplete
    })

    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error('Search Autocomplete Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch search results' },
      { status: 500 }
    )
  }
}

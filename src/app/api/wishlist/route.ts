import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth-utils'

const resolveEmail = (request: Request, bodyEmail?: string | null): string | null => {
  const authUser = getAuthUserFromRequest(request)
  if (authUser?.email) return authUser.email.toLowerCase()

  if (bodyEmail && bodyEmail.trim()) return bodyEmail.trim().toLowerCase()

  const { searchParams } = new URL(request.url)
  const queryEmail = searchParams.get('email')
  if (queryEmail && queryEmail.trim()) return queryEmail.trim().toLowerCase()

  return null
}

export async function GET(request: Request) {
  try {
    const email = resolveEmail(request)
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const items = await prisma.wishlist.findMany({
      where: { email },
      include: { product: true },
      orderBy: { addedAt: 'desc' },
    })

    return NextResponse.json({ success: true, items, count: items.length })
  } catch (error) {
    console.error('Failed to fetch wishlist:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = resolveEmail(request, body?.email)
    const productId = String(body?.productId || '').trim()

    if (!email || !productId) {
      return NextResponse.json({ success: false, error: 'Email and productId are required' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const wishlistItem = await prisma.wishlist.upsert({
      where: {
        email_productId: {
          email,
          productId,
        },
      },
      update: {},
      create: {
        email,
        productId,
      },
      include: { product: true },
    })

    return NextResponse.json({ success: true, item: wishlistItem })
  } catch (error) {
    console.error('Failed to add wishlist item:', error)
    return NextResponse.json({ success: false, error: 'Failed to add wishlist item' }, { status: 500 })
  }
}

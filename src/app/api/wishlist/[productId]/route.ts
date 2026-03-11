import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest } from '@/lib/auth-utils'

const resolveEmail = (request: Request): string | null => {
  const authUser = getAuthUserFromRequest(request)
  if (authUser?.email) return authUser.email.toLowerCase()

  const { searchParams } = new URL(request.url)
  const queryEmail = searchParams.get('email')
  if (queryEmail && queryEmail.trim()) return queryEmail.trim().toLowerCase()
  return null
}

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const email = resolveEmail(request)
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    await prisma.wishlist.delete({
      where: {
        email_productId: {
          email,
          productId: params.productId,
        },
      },
    })

    return NextResponse.json({ success: true, message: 'Removed from wishlist' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Wishlist item not found' }, { status: 404 })
    }
    console.error('Failed to remove wishlist item:', error)
    return NextResponse.json({ success: false, error: 'Failed to remove wishlist item' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { productId: string } }
) {
  return NextResponse.json({ success: false, error: 'Wishlist temporarily disabled' }, { status: 503 })
}

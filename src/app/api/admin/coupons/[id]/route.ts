import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ success: false, error: 'Coupons temporarily disabled' }, { status: 503 })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ success: false, error: 'Coupons temporarily disabled' }, { status: 503 })
}

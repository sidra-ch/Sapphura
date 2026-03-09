import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ success: false, error: 'Wishlist temporarily disabled' }, { status: 503 })
}

export async function POST(request: Request) {
  return NextResponse.json({ success: false, error: 'Wishlist temporarily disabled' }, { status: 503 })
}

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return NextResponse.json({ success: false, error: 'Coupons temporarily disabled' }, { status: 503 })
}

export async function POST(request: Request) {
  return NextResponse.json({ success: false, error: 'Coupons temporarily disabled' }, { status: 503 })
}

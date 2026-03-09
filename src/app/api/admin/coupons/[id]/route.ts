import { NextResponse } from 'next/server'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ success: false, error: 'Coupons temporarily disabled' }, { status: 503 })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authUser = getAuthUserFromRequest(request)
  if (!authUser || !isAdminRole(authUser.role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ success: false, error: 'Coupons temporarily disabled' }, { status: 503 })
}

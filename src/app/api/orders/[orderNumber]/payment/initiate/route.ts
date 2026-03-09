import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  createPaymentToken,
  getGatewayInfo,
  isOnlinePaymentMethod,
} from '@/lib/payment-gateways'

export const dynamic = 'force-dynamic'

// POST /api/orders/[orderNumber]/payment/initiate
export async function POST(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params
    const body = await request.json()
    const method = String(body?.method || '').toUpperCase()

    if (!isOnlinePaymentMethod(method)) {
      return NextResponse.json(
        { success: false, error: 'Invalid online payment method' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.paymentStatus === 'PAID') {
      return NextResponse.json(
        { success: false, error: 'Order already paid' },
        { status: 400 }
      )
    }

    const gateway = getGatewayInfo(method)
    const expiresAt = Date.now() + 15 * 60 * 1000
    const paymentToken = createPaymentToken({
      orderNumber,
      method,
      total: order.total,
      expiresAt,
    })

    return NextResponse.json({
      success: true,
      payment: {
        orderNumber,
        method,
        label: gateway.label,
        total: order.total,
        currency: 'PKR',
        accountTitle: gateway.accountTitle,
        accountNumber: gateway.accountNumber,
        merchantId: gateway.merchantId,
        expiresAt,
        paymentToken,
      },
    })
  } catch (error) {
    console.error('Payment initiate error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}

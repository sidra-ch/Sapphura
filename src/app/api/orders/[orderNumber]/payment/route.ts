import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPaymentToken } from '@/lib/payment-gateways'

export const dynamic = 'force-dynamic'

// PATCH /api/orders/[orderNumber]/payment - Mark order payment status
export async function PATCH(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const body = await request.json()
    const { paid, transactionRef, paymentToken } = body
    const { orderNumber } = params

    if (!paymentToken || typeof paymentToken !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing payment token' },
        { status: 400 }
      )
    }

    const verified = verifyPaymentToken(paymentToken)
    if (!verified.valid || verified.orderNumber !== orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired payment token' },
        { status: 401 }
      )
    }

    if (!transactionRef || String(transactionRef).trim().length < 4) {
      return NextResponse.json(
        { success: false, error: 'Transaction reference is required' },
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

    const updatedOrder = await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentStatus: paid ? 'PAID' : 'UNPAID',
        status: paid ? 'CONFIRMED' : order.status,
        notes: transactionRef
          ? `${order.notes || ''}\nPayment Ref: ${transactionRef}\nPayment Method: ${verified.method}`.trim()
          : order.notes,
      },
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: paid ? 'Payment marked as paid' : 'Payment status updated',
    })
  } catch (error) {
    console.error('Payment update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update payment status' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
  paymentStatus: z.enum(['UNPAID', 'PAID', 'REFUNDED', 'FAILED']).optional(),
  notes: z.string().optional()
})

export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: params.orderNumber },
      include: { items: true }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = updateOrderSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { orderNumber: params.orderNumber }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { orderNumber: params.orderNumber },
      data: {
        status: validationResult.data.status,
        paymentStatus: validationResult.data.paymentStatus,
        notes: validationResult.data.notes
      },
      include: { items: true }
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

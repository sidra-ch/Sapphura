import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateInvoicePDF } from '@/lib/invoice-generator'

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

    // Generate PDF
    const pdfBuffer = generateInvoicePDF({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      postalCode: order.postalCode || '',
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod
    })

    // Return PDF as response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${order.orderNumber}.pdf"`
      }
    })
  } catch (error) {
    console.error('Invoice generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

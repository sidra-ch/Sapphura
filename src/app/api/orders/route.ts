import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/email-service'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

// POST /api/orders - Create new order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('📦 Creating order with data:', { customerName: body.customerName, email: body.email, itemCount: body.items?.length })
    
    const {
      customerName,
      email,
      phone,
      address,
      city,
      postalCode,
      items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      notes,
    } = body

    // Validate required fields
    if (!customerName || !email || !phone || !address || !items || items.length === 0) {
      console.error('❌ Validation failed: Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    console.log('📝 Generated order number:', orderNumber)

    // Check which products exist in database
    const productIds = items.map((item: any) => item.id)
    console.log('🔍 Checking products in database:', productIds)
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true }
    })
    const existingProductIds = new Set(existingProducts.map(p => p.id))
    console.log('✅ Found products in DB:', existingProductIds.size, 'out of', productIds.length)

    // Create order and line items in a transaction.
    // Using createMany for order items avoids required relation validation for Cloudinary-only items.
    console.log('💾 Creating order in database...')
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          email,
          phone,
          address,
          city: city || '',
          postalCode: postalCode || '',
          subtotal,
          shipping: shipping || 0,
          tax: tax || 0,
          total,
          paymentMethod: paymentMethod || 'COD',
          notes: notes || '',
        },
      })

      await tx.orderItem.createMany({
        data: items.map((item: any) => ({
          orderId: createdOrder.id,
          productId: existingProductIds.has(item.id) ? item.id : null,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
          image: item.image || null,
        })),
      })

      const createdWithItems = await tx.order.findUnique({
        where: { id: createdOrder.id },
        include: { items: true },
      })

      if (!createdWithItems) {
        throw new Error('Order creation failed after transaction')
      }

      return createdWithItems
    })

    // Update product stock (only for products that exist in database)
    for (const item of items) {
      try {
        const product = await prisma.product.findUnique({
          where: { id: item.id },
        })
        
        if (product) {
          await prisma.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        }
      } catch (error) {
        // Skip stock update if product doesn't exist in database (e.g., Cloudinary-only products)
        console.log(`Skipping stock update for product ${item.id} - not in database`)
      }
    }

    // Create or update customer
    const customerRecord = await prisma.customer.upsert({
      where: { email },
      update: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: total },
        phone,
        address,
        city: city || '',
      },
      create: {
        name: customerName,
        email,
        phone,
        address,
        city: city || '',
        postalCode: postalCode || '',
        totalOrders: 1,
        totalSpent: total,
      },
    })
    
    // Explicitly link this specific Order row to the Customer user row
    await prisma.order.update({
      where: { id: order.id },
      data: { customerId: customerRecord.id }
    })

    // Send order confirmation email (don't fail order if email fails)
    try {
      const emailHtml = generateOrderConfirmationEmail({
        orderNumber,
        customerName,
        email,
        products: items,
        subtotal,
        shipping: shipping || 0,
        tax: tax || 0,
        total,
        address,
        city: city || ''
      })

      await sendEmail({
        to: email,
        subject: `Order Confirmation - ${orderNumber}`,
        html: emailHtml
      })
    } catch (emailError) {
      console.error('❌ Error sending confirmation email:', emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully.',
    })
  } catch (error) {
    console.error('❌ Error creating order:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}

// GET /api/orders - Get orders (with optional email filter)
export async function GET(request: Request) {
  try {
    const authUser = getAuthUserFromRequest(request)
    const isAdmin = !!authUser && isAdminRole(authUser.role)

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const orderNumber = searchParams.get('orderNumber')

    let where: any = {}

    if (isAdmin) {
      where = email
        ? { email }
        : orderNumber
          ? { orderNumber }
          : {}
    } else {
      if (!email || !orderNumber) {
        return NextResponse.json(
          { success: false, error: 'Email and order number are required' },
          { status: 400 }
        )
      }
      where = { email, orderNumber }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
    })
  } catch (error) {
    console.error('❌ Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

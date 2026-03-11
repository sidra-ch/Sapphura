import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const token = cookies().get('store_auth_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload || payload.role !== 'CUSTOMER') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the customer's orders from Prisma
    const orders = await prisma.order.findMany({
      where: {
        email: payload.email as string, // Link by email because current orders API only saves emails, not IDs
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    });

    // Formatting them into the shape the frontend `OrderHistory` expects
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString(),
      total: order.total,
      status: order.status.toLowerCase(), // Prisma Enum needs to be lowercase for UI
      paymentMethod: order.paymentMethod,
      shippingAddress: `${order.address}, ${order.city}`,
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error: any) {
    console.error('Failed to fetch customer orders:', error.message);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

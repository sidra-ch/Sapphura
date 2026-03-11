import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma'; // Using default export as in orders/route.ts

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    // error logging removed for production
    // console.error(`Webhook signature verification failed:`, error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // Find order in DB and update paymentStatus to PAID
        await prisma.order.update({
          where: { orderNumber: orderId },
          data: {
            paymentStatus: 'PAID', // or whatever the enum uses
            status: 'CONFIRMED'
          },
        });
        // status logging removed for production
        // console.log(`Order ${orderId} successfully marked as PAID from Stripe webhook`);
      }
    }

    return new NextResponse('Webhook handled successfully', { status: 200 });
  } catch (error: any) {
    // error logging removed for production
    // console.error('Webhook processing failed:', error);
    return new NextResponse(`Server Error: ${error.message}`, { status: 500 });
  }
}

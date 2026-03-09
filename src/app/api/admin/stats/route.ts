import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Get total products
    const totalProducts = await prisma.product.count()

    // Get total orders
    const totalOrders = await prisma.order.count().catch(() => 0)

    // Get total revenue
    const orders = await prisma.order.findMany({
      select: { total: true }
    }).catch(() => [])
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Get total customers (unique email addresses from orders)
    const customers = await prisma.order.findMany({
      select: { email: true },
      distinct: ['email']
    }).catch(() => [])

    const totalCustomers = customers.length

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers,
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
      }
    })
  }
}

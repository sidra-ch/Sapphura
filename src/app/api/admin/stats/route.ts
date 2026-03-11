import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const authUser = getAuthUserFromRequest(request)
    if (!authUser || !isAdminRole(authUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get total products
    const totalProducts = await prisma.product.count()

    // Get total orders
    const totalOrders = await prisma.order.count().catch(() => 0)

    // Get total revenue - Calculate only from non-cancelled/completed logic or all for sum
    const orders = await prisma.order.findMany({
      select: { total: true }
    }).catch(() => [])

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Get total customers from Customer table (instead of order emails)
    const totalCustomers = await prisma.customer.count().catch(() => 0)

    // Get Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        createdAt: true,
        customer: {
          select: { name: true, email: true }
        }
      }
    }).catch(() => [])

    // Get Low Stock Products (stock < 10)
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lt: 10 } },
      take: 5,
      orderBy: { stock: 'asc' },
      select: {
        id: true,
        name: true,
        stock: true,
        slug: true,
        price: true
      }
    }).catch(() => [])

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalCustomers,
        recentOrders,
        lowStockProducts
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    }, { status: 500 })
  }
}

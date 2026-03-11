import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAuthUserFromRequest, isAdminRole } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

export async function GET(request: Request) {
  try {
    const authUser = getAuthUserFromRequest(request)
    if (!authUser || !isAdminRole(authUser.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const last30Days = new Date(now)
    last30Days.setDate(now.getDate() - 30)

    const last12Months = new Date(now)
    last12Months.setMonth(now.getMonth() - 11)
    last12Months.setDate(1)
    last12Months.setHours(0, 0, 0, 0)

    const [orders30Days, orders12Months, orderItems, customers12Months] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: last30Days } },
        select: { createdAt: true, total: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: last12Months } },
        select: { createdAt: true, total: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.orderItem.findMany({
        select: { productId: true, productName: true, quantity: true, price: true },
      }),
      prisma.customer.findMany({
        where: { createdAt: { gte: last12Months } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    const dailySalesMap = new Map<string, { date: string; orders: number; revenue: number }>()
    for (const order of orders30Days) {
      const key = order.createdAt.toISOString().slice(0, 10)
      const current = dailySalesMap.get(key) || { date: key, orders: 0, revenue: 0 }
      current.orders += 1
      current.revenue += order.total
      dailySalesMap.set(key, current)
    }

    const monthlyRevenueMap = new Map<string, { month: string; revenue: number; orders: number }>()
    for (const order of orders12Months) {
      const key = monthKey(order.createdAt)
      const current = monthlyRevenueMap.get(key) || { month: key, revenue: 0, orders: 0 }
      current.orders += 1
      current.revenue += order.total
      monthlyRevenueMap.set(key, current)
    }

    const topProductsMap = new Map<string, { productId: string | null; name: string; quantity: number; revenue: number }>()
    for (const item of orderItems) {
      const key = item.productId || item.productName
      const current = topProductsMap.get(key) || {
        productId: item.productId,
        name: item.productName,
        quantity: 0,
        revenue: 0,
      }
      current.quantity += item.quantity
      current.revenue += item.quantity * item.price
      topProductsMap.set(key, current)
    }

    const customerGrowthMap = new Map<string, { month: string; newCustomers: number }>()
    for (const customer of customers12Months) {
      const key = monthKey(customer.createdAt)
      const current = customerGrowthMap.get(key) || { month: key, newCustomers: 0 }
      current.newCustomers += 1
      customerGrowthMap.set(key, current)
    }

    const dailySales = Array.from(dailySalesMap.values()).sort((a, b) => a.date.localeCompare(b.date))
    const monthlyRevenue = Array.from(monthlyRevenueMap.values()).sort((a, b) => a.month.localeCompare(b.month))
    const topProducts = Array.from(topProductsMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
    const customerGrowth = Array.from(customerGrowthMap.values()).sort((a, b) => a.month.localeCompare(b.month))

    return NextResponse.json({
      success: true,
      analytics: {
        dailySales,
        monthlyRevenue,
        topProducts,
        customerGrowth,
      },
    })
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

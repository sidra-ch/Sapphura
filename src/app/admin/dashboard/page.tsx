'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Plus,
  Edit,
  Eye,
  AlertTriangle,
  Clock
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  customer: { name: string; email: string } | null
}

interface ProductWarn {
  id: string
  name: string
  stock: number
  slug: string
  price: number
}

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  recentOrders: Order[]
  lowStockProducts: ProductWarn[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: [],
    lowStockProducts: []
  })

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      if (data.success) {
        setUser(data.user)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }, [router])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [checkAuth, fetchStats])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-primary text-xl flex items-center gap-2">
          <Clock className="animate-spin" />
          Loading Dashboard...
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      hint: 'Accumulated from orders',
      href: '/admin/orders',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      hint: 'View all orders',
      href: '/admin/orders',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'from-yellow-500 to-yellow-600',
      hint: 'Manage products',
      href: '/admin/products',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      hint: 'Registered users',
      href: '/admin/customers',
    },
  ]

  const quickActions = [
    {
      title: 'Add Product',
      icon: Plus,
      href: '/admin/products/new',
      color: 'bg-green-500/10 text-green-400 border-green-500/30',
    },
    {
      title: 'Manage Products',
      icon: Edit,
      href: '/admin/products',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    {
      title: 'Orders',
      icon: Eye,
      href: '/admin/orders',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-navy text-primary">
      <header className="bg-navy-light border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Sappura Dashboard</h1>
              <p className="text-sm sm:text-base text-primary/70">Welcome back, {user.name}!</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <Link href="/" className="text-primary/70 hover:text-primary transition-colors text-sm font-semibold tracking-wider uppercase">
                View Store
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href}>
              <div className={`p-4 rounded-xl border flex items-center justify-center gap-3 hover:opacity-80 transition-opacity ${action.color}`}>
                <action.icon size={20} />
                <span className="font-semibold text-sm md:text-base">{action.title}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="gold-glass rounded-xl p-6"
              >
                <Link href={stat.href} className="block">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-primary/80">{stat.title}</h3>
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-primary/60 mt-2">{stat.hint}</p>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Recent Orders & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 gold-glass rounded-xl p-4 md:p-6 overflow-hidden w-full">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold truncate pr-2">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs md:text-sm font-semibold tracking-wider uppercase text-primary/70 hover:text-primary transition-colors whitespace-nowrap">
                View All
              </Link>
            </div>
            
            <div className="w-full">
              {stats.recentOrders.length === 0 ? (
                <p className="text-primary/60 py-4">No recent orders found.</p>
              ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto w-full pb-2">
                    <table className="w-full min-w-[600px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-primary/20 text-sm text-primary/70">
                          <th className="py-3 px-2 md:px-4 font-semibold whitespace-nowrap">Order</th>
                          <th className="py-3 px-2 md:px-4 font-semibold whitespace-nowrap">Customer</th>
                          <th className="py-3 px-2 md:px-4 font-semibold whitespace-nowrap">Status</th>
                          <th className="py-3 px-2 md:px-4 font-semibold whitespace-nowrap">Amount</th>
                          <th className="py-3 px-2 md:px-4 font-semibold whitespace-nowrap">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-primary/10 hover:bg-white/5 transition-colors text-sm md:text-base">
                            <td className="py-3 px-2 md:px-4 font-medium whitespace-nowrap">{order.orderNumber}</td>
                            <td className="py-3 px-2 md:px-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] md:max-w-none">{order.customer?.name || order.customer?.email || 'Guest'}</td>
                            <td className="py-3 px-2 md:px-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 md:px-4 font-semibold whitespace-nowrap">Rs. {order.total.toLocaleString()}</td>
                            <td className="py-3 px-2 md:px-4 text-xs md:text-sm text-primary/70 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden flex flex-col gap-4">
                    {stats.recentOrders.map((order) => (
                      <div key={order.id} className="border border-primary/20 rounded-lg p-3 hover:bg-white/5 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm break-all">{order.orderNumber}</span>
                          <span className={`px-2 py-0.5 text-[10px] rounded-full border whitespace-nowrap ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm mb-2 text-primary/80 line-clamp-1">
                          {order.customer?.name || order.customer?.email || 'Guest'}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold">Rs. {order.total.toLocaleString()}</span>
                          <span className="text-xs text-primary/60">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="gold-glass rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-red-400">
                <AlertTriangle size={20} />
                Low Stock
              </h2>
            </div>
            
            {stats.lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-primary/60">
                <Package className="mx-auto mb-2 opacity-50" size={32} />
                <p>All stock levels are healthy.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center border-b border-primary/10 pb-4 last:border-0 last:pb-0">
                    <div>
                      <Link href={`/admin/products/edit/${product.id}`} className="font-semibold hover:underline block truncate w-40">
                        {product.name}
                      </Link>
                      <p className="text-sm text-primary/60">Rs. {product.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock === 0 ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                      }`}>
                        {product.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {stats.lowStockProducts.length > 0 && (
              <div className="mt-6 pt-4 border-t border-primary/20 text-center">
                <Link href="/admin/products" className="text-sm font-semibold tracking-wider uppercase text-primary/70 hover:text-primary transition-colors">
                  Manage Inventory
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}

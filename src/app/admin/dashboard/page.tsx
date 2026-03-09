'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
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
    } finally {
      setLoading(false)
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
        <div className="text-primary text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      change: '+8%',
    },
    {
      title: 'Total Revenue',
      value: `PKR ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600',
      change: '+23%',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      change: '+5%',
    },
  ]

  const quickActions = [
    {
      title: 'Add New Product',
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
      title: 'View Orders',
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

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="bg-navy-light border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Sappura Admin Dashboard</h1>
              <p className="text-primary/70">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-primary/70 hover:text-primary transition-colors">
                View Store
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <span className="text-sm text-green-400">{stat.change}</span>
                </div>
                <h3 className="text-primary/70 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className={`block p-6 rounded-xl border ${action.color} hover:scale-105 transition-transform`}
                  >
                    <Icon size={32} className="mb-3" />
                    <h3 className="font-semibold">{action.title}</h3>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="gold-glass rounded-xl p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Recent Orders</h2>
            <div className="space-y-4">
              <div className="text-primary/70 text-center py-8">
                No orders yet. Start selling!
              </div>
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="gold-glass rounded-xl p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Low Stock Alert</h2>
            <div className="space-y-4">
              <div className="text-primary/70 text-center py-8">
                All products are well stocked!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

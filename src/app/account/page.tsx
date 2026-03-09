'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ProfileEditor from '@/components/account/ProfileEditor'
import AddressManager from '@/components/account/AddressManager'
import OrderHistory from '@/components/account/OrderHistory'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import Loader from '@/components/ui/Loader'
import { User, MapPin, ShoppingBag, LogOut, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

type Tab = 'profile' | 'addresses' | 'orders'

// Mock user data
const mockProfile = {
  id: '1',
  name: 'Ahmed Hassan',
  email: 'ahmed@example.com',
  phone: '+92 300 1234567',
}

const mockAddresses = [
  {
    id: '1',
    label: 'Home',
    street: '123 Main Street, Apt 4B',
    city: 'Karachi',
    state: 'Sindh',
    zipCode: '75500',
    phone: '+92 300 1234567',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    street: '456 Business Avenue',
    city: 'Lahore',
    state: 'Punjab',
    zipCode: '54000',
    phone: '+92 300 7654321',
    isDefault: false,
  },
]

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    total: 24999,
    status: 'delivered' as const,
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Main Street, Karachi',
    items: [
      {
        id: 'item1',
        productName: 'Classic Lawn Suit',
        quantity: 1,
        price: 4999,
      },
      {
        id: 'item2',
        productName: 'Printed Dupatta',
        quantity: 2,
        price: 1999,
      },
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    total: 8999,
    status: 'shipped' as const,
    paymentMethod: 'Bank Transfer',
    shippingAddress: '456 Business Avenue, Lahore',
    items: [
      {
        id: 'item3',
        productName: 'Cotton T-Shirt',
        quantity: 1,
        price: 8999,
      },
    ],
  },
]

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [loading, setLoading] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [profile, setProfile] = useState(mockProfile)
  const [addresses, setAddresses] = useState(mockAddresses)

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' })
        const data = await response.json()
        setIsAdminAuthenticated(Boolean(data?.success))
      } catch {
        setIsAdminAuthenticated(false)
      }
    }

    checkAdminSession()
  }, [])

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ]

  const handleProfileSave = async (data: { name: string; email: string; phone: string }) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProfile({ ...profile, ...data })
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async (address: any) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const newAddress = {
        ...address,
        id: Date.now().toString(),
      }
      setAddresses([...addresses, newAddress])
      toast.success('Address added successfully!')
    } catch (error) {
      toast.error('Failed to add address')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAddress = async (id: string, address: any) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setAddresses(addresses.map((a) => (a.id === id ? { ...address, id } : a)))
      toast.success('Address updated successfully!')
    } catch (error) {
      toast.error('Failed to update address')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setAddresses(addresses.filter((a) => a.id !== id))
      toast.success('Address deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete address')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setAddresses(
        addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      )
      toast.success('Default address updated!')
    } catch (error) {
      toast.error('Failed to set default address')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAdminAuthenticated(false)
      toast.success('Admin logged out successfully')
    } catch {
      toast.error('Failed to logout admin session')
    }
  }

  return (
    <main className="min-h-screen bg-navy pt-28 md:pt-32">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Account' }]} />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header with Account Actions */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-primary">My Account</h1>
            <div className="flex items-center gap-3">
              <Link
                href={isAdminAuthenticated ? '/admin/dashboard' : '/admin/login'}
                className="flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
              >
                <ShieldCheck size={20} />
                {isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
              </Link>

              {isAdminAuthenticated && (
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={20} />
                  Admin Logout
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'gold-btn text-navy'
                      : 'border-2 border-primary text-primary hover:bg-primary/10'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                  {tab.label}
                </motion.button>
              )
            })}
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Loader />
            </div>
          )}

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'profile' && (
              <ProfileEditor
                profile={{ name: profile.name, email: profile.email, phone: profile.phone }}
                onSave={handleProfileSave}
                loading={loading}
              />
            )}

            {activeTab === 'addresses' && (
              <AddressManager
                addresses={addresses}
                onAdd={handleAddAddress}
                onUpdate={handleUpdateAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefaultAddress}
                loading={loading}
              />
            )}

            {activeTab === 'orders' && <OrderHistory orders={mockOrders} loading={loading} />}
          </motion.div>
        </div>
      </section>
    </main>
  )
}

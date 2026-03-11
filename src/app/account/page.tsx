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
  const [loading, setLoading] = useState(true)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState(false)
  
  // OTP Form State
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<1 | 2>(1)
  const [authLoading, setAuthLoading] = useState(false)

  const [profile, setProfile] = useState<any>(null)
  const [addresses, setAddresses] = useState(mockAddresses)
  const [orders, setOrders] = useState([]) // added orders state

  useEffect(() => {
    const checkSessions = async () => {
      try {
        // Check Admin Session
        fetch('/api/auth/session', { cache: 'no-store' })
          .then(res => res.json())
          .then(data => setIsAdminAuthenticated(Boolean(data?.success)))
          .catch(() => setIsAdminAuthenticated(false))

        // Check Customer Session
        const res = await fetch('/api/store/auth/session', { cache: 'no-store' })
        const data = await res.json()

        if (data?.success && data?.authenticated) {
           setIsCustomerAuthenticated(true)
           setProfile(data.user)

           // Fetch real order history
           const ordersRes = await fetch('/api/store/orders', { cache: 'no-store' })
           const ordersData = await ordersRes.json()
           if (ordersData.success) {
             setOrders(ordersData.orders)
           }
        }
      } catch {
        setIsCustomerAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkSessions()
  }, [])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')
    
    setAuthLoading(true)
    try {
      const res = await fetch('/api/store/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      
      if (data.success) {
         toast.success('OTP sent! Please check your email.')
         setStep(2)
      } else {
         toast.error(data.error || 'Failed to send OTP')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) return toast.error('Please enter the OTP')
    
    setAuthLoading(true)
    try {
      const res = await fetch('/api/store/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const data = await res.json()
      
      if (data.success) {
         toast.success('Logged in successfully!')
         setIsCustomerAuthenticated(true)
         setProfile(data.customer)
         // Refresh the layout correctly
         window.location.reload()
      } else {
         toast.error(data.error || 'Invalid OTP')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setAuthLoading(false)
    }
  }
  
  const handleCustomerLogout = async () => {
    if (!confirm('Are you sure you want to log out?')) return
    try {
      await fetch('/api/store/auth/logout', { method: 'POST' })
      toast.success('Logged out successfully')
      window.location.reload()
    } catch {
      toast.error('Failed to logout')
    }
  }

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

      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header with Account Actions */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-3xl font-bold text-primary md:text-4xl">My Account</h1>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={isAdminAuthenticated ? '/admin/dashboard' : '/admin/login'}
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 py-2 font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <ShieldCheck size={20} />
                {isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
              </Link>

              {isAdminAuthenticated && (
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-red-500 px-4 py-2 font-semibold text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <LogOut size={20} />
                  Admin Logout
                </button>
              )}
            </div>
          </div>

          {loading ? (
             <div className="flex items-center justify-center py-20">
               <Loader />
             </div>
          ) : !isCustomerAuthenticated ? (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-md mx-auto gold-glass p-8 rounded-2xl border border-primary/20 backdrop-blur-md"
             >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-2">Welcome Back</h2>
                  <p className="text-primary/70">Login or sign up to manage your orders</p>
                </div>
                
                {step === 1 ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                      <label className="block text-primary/80 mb-2 font-medium">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-navy border-2 border-primary/20 rounded-xl px-4 py-3 text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full gold-btn py-3 rounded-xl font-bold text-navy flex justify-center items-center gap-2 mt-6"
                    >
                      {authLoading ? <Loader /> : 'Send OTP Code'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                      <label className="block text-primary/80 mb-2 font-medium">Enter 6-digit Setup Code</label>
                      <input
                         type="text"
                         required
                         maxLength={6}
                         value={otp}
                         onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                         className="w-full bg-navy border-2 border-primary/20 rounded-xl px-4 py-3 text-primary text-center text-2xl tracking-widest focus:outline-none focus:border-primary transition-colors"
                         placeholder="------"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full gold-btn py-3 rounded-xl font-bold text-navy flex justify-center items-center gap-2 mt-6"
                    >
                      {authLoading ? <Loader /> : 'Verify & Login'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="w-full text-primary/70 hover:text-primary text-sm mt-4 transition-colors"
                    >
                      Wrong email? Go back
                    </button>
                  </form>
                )}
             </motion.div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="mb-8 grid grid-cols-1 gap-2 sm:flex sm:gap-2 sm:overflow-x-auto sm:pb-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 font-semibold transition-all sm:px-6 ${
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

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'profile' && profile && (
                  <div>
                    <ProfileEditor
                      profile={{ name: profile.name || '', email: profile.email || '', phone: profile.phone || '' }}
                      onSave={handleProfileSave}
                      loading={loading}
                    />
                    <div className="mt-8 flex justify-center sm:justify-start">
                      <button 
                        onClick={handleCustomerLogout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold px-4 py-2 rounded-lg border border-red-500/30 hover:border-red-400"
                      >
                         <LogOut size={16} /> Logout from Customer Account
                      </button>
                    </div>
                  </div>
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
            </>
          )}
        </div>
      </section>
    </main>
  )
}

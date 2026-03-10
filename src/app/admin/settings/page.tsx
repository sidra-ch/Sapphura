'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, KeyRound, UserPlus } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' })
        const data = await response.json()

        if (!data.success) {
          router.push('/admin/login')
          return
        }

        setUser(data.user)
      } catch {
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-primary text-xl">Loading settings...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-navy">
      <header className="bg-navy-light border-b border-primary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 text-primary/70 hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                Dashboard
              </Link>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-primary">Admin Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="gold-glass rounded-xl p-6">
          <h2 className="text-lg font-bold text-primary mb-4">Account Information</h2>
          <div className="space-y-3 text-primary/85">
            <p><span className="text-primary/60">Name:</span> {user.name}</p>
            <p><span className="text-primary/60">Email:</span> {user.email}</p>
            <p><span className="text-primary/60">Role:</span> {user.role}</p>
          </div>
        </div>

        <div className="gold-glass rounded-xl p-6">
          <h2 className="text-lg font-bold text-primary mb-4">Security</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/forgot-password"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 px-4 py-3 text-primary font-medium hover:bg-primary/10 transition-colors"
            >
              <KeyRound size={18} />
              Reset Password
            </Link>
            <Link
              href="/admin/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 px-4 py-3 text-primary font-medium hover:bg-primary/10 transition-colors"
            >
              <UserPlus size={18} />
              Create Admin Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

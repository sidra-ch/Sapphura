'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import LoginForm from '@/components/account/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (payload: { email: string; password: string }) => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="gold-glass rounded-2xl p-5 sm:p-7 md:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Sappura Admin</h1>
            <p className="text-primary/70">Sign in to your account</p>
          </div>

          <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />

          <div className="mt-4 text-right">
            <Link
              href="/admin/forgot-password"
              className="text-sm text-primary transition-colors hover:text-gold"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-6 text-center">
                        <p className="text-sm text-primary/70 mb-4">
                          Don&apos;t have an account?{' '}
                          <Link href="/admin/register" className="text-primary hover:text-gold transition-colors font-semibold">
                            Create Account
                          </Link>
                        </p>
                      </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-primary/70 hover:text-primary transition-colors">
              ← Back to Store
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to submit request')
        return
      }

      setMessage(data.message || 'Request submitted successfully')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy px-3 sm:px-4 py-8 sm:py-16 md:py-24 flex items-center justify-center">
      <div className="gold-glass rounded-2xl p-5 sm:p-7 md:p-10 shadow-2xl w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3">Forgot Password</h1>
        <p className="text-primary/75 mb-6">Enter your admin email to request a reset link.</p>

        {message && <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">{message}</div>}
        {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@sappura.com"
            className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="gold-btn w-full rounded-lg px-6 py-3 font-semibold text-black disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4">
          <Link href="/admin/login" className="text-primary/80 hover:text-primary transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

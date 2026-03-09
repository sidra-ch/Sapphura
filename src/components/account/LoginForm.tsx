'use client'

import { useState } from 'react'

type LoginFormProps = {
  onSubmit: (payload: { email: string; password: string }) => Promise<void> | void
  loading?: boolean
  error?: string
}

export default function LoginForm({ onSubmit, loading = false, error }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">{error}</div>
      ) : null}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-primary">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="admin@sappura.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-primary">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="gold-btn w-full rounded-lg px-4 py-3 font-semibold text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

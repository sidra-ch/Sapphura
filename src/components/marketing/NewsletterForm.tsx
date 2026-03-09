'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Check } from 'lucide-react'
import toast from 'react-hot-toast'

type NewsletterFormProps = {
  onSubscribe?: (email: string) => void
  className?: string
}

export default function NewsletterForm({ onSubscribe, className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email')
      return
    }

    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    onSubscribe?.(email)
    toast.success('Subscribed successfully!')
    setSubscribed(true)
    setEmail('')

    // Reset after 3 seconds
    setTimeout(() => setSubscribed(false), 3000)
    setLoading(false)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
        <p className="text-primary/70">Get exclusive offers and new arrivals straight to your inbox</p>
      </div>

      {subscribed ? (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="gold-glass rounded-lg p-6 text-center"
        >
          <div className="inline-block rounded-full bg-primary/20 p-3 text-primary mb-3">
            <Check size={24} />
          </div>
          <p className="font-semibold text-primary">Thank you for subscribing!</p>
          <p className="text-sm text-primary/70 mt-2">Check your email for exclusive offers</p>
        </motion.div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={20} />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-primary/30 bg-navy pl-12 pr-4 py-3 text-primary placeholder-primary/50 outline-none transition-colors focus:border-primary disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="gold-btn px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      )}
    </motion.form>
  )
}

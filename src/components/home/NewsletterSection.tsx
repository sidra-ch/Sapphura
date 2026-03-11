'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface NewsletterSectionProps {
  title?: string
  subtitle?: string
  placeholder?: string
  buttonText?: string
  className?: string
}

export default function NewsletterSection({
  title = 'Stay in the Loop',
  subtitle = 'Get exclusive offers, new arrivals, and insider updates delivered to your inbox',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe',
  className = ''
}: NewsletterSectionProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSubscribed(true)
        toast.success('Thank you for subscribing!')
        setEmail('')
      } else {
        toast.error(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  if (isSubscribed) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="gold-glass rounded-3xl p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-primary mb-4">
              You&apos;re All Set!
            </h2>
            
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
              Thank you for subscribing to our newsletter. Check your inbox for a confirmation email and get ready for exclusive offers and updates!
            </p>
            
            <button
              onClick={() => setIsSubscribed(false)}
              className="text-primary hover:opacity-80 transition-opacity font-semibold"
            >
              Subscribe another email
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="gold-glass rounded-3xl p-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            
            <h2 className="text-3xl font-bold text-primary mb-4">
              {title}
            </h2>
            
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-6 py-4 bg-navy-light border-2 border-primary/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary/60 transition-colors"
                  disabled={isLoading}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="gold-btn px-8 py-4 rounded-xl font-bold text-lg whitespace-nowrap flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    {buttonText}
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm opacity-60">
              By subscribing, you agree to receive our newsletter and accept our{' '}
              <a href="/policies/privacy-policy" className="text-primary hover:opacity-80 transition-opacity">
                Privacy Policy
              </a>
              {' '}and{' '}
              <a href="/policies/terms-of-service" className="text-primary hover:opacity-80 transition-opacity">
                Terms of Service
              </a>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🎁</span>
              </div>
              <h3 className="font-semibold text-primary mb-2">Exclusive Offers</h3>
              <p className="text-sm opacity-70">Get access to member-only discounts and promotions</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">✨</span>
              </div>
              <h3 className="font-semibold text-primary mb-2">New Arrivals</h3>
              <p className="text-sm opacity-70">Be the first to know about our latest collections</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🌟</span>
              </div>
              <h3 className="font-semibold text-primary mb-2">Style Tips</h3>
              <p className="text-sm opacity-70">Receive expert jewelry care and styling advice</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

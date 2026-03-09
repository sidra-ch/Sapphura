'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        
        if (data.authenticated) {
          router.push('/admin/dashboard')
        }
      } catch (error) {
        console.error('Session check failed:', error)
      }
    }
    
    checkSession()
  }, [router])

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="gold-glass rounded-2xl p-12 max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">
            Sappura Admin
          </h1>
          <p className="text-primary/70 mb-8">
            Manage your jewelry store
          </p>
          
          <div className="space-y-4">
            <Link
              href="/admin/login"
              className="block w-full gold-btn py-3 px-6 rounded-lg font-semibold text-black hover:scale-[1.02] transition-transform"
            >
              Sign In
            </Link>
            
            <Link
              href="/admin/register"
              className="block w-full bg-navy-light border-2 border-primary/30 py-3 px-6 rounded-lg font-semibold text-primary hover:bg-primary/10 transition-all"
            >
              Create Account
            </Link>
          </div>
          
          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-primary/70 hover:text-primary transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

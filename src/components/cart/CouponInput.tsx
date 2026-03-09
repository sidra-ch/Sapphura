'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

type CouponInputProps = {
  onApply?: (code: string, discount: number) => void
  onRemove?: () => void
  appliedCoupon?: { code: string; discount: number } | null
  disabled?: boolean
}

// Mock coupon codes for demo
const mockCoupons: Record<string, number> = {
  'SAVE10': 10,
  'WELCOME20': 20,
  'SAPPURA15': 15,
  'FLAT500': 500,
}

export default function CouponInput({
  onApply,
  onRemove,
  appliedCoupon,
  disabled = false,
}: CouponInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a coupon code')
      return
    }

    setLoading(true)
    setError('')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const upperCode = code.toUpperCase()
    const discount = mockCoupons[upperCode]

    if (discount !== undefined) {
      onApply?.(upperCode, discount)
      toast.success(`Coupon "${upperCode}" applied! You saved ${discount}%`)
      setCode('')
    } else {
      setError('Invalid coupon code')
      toast.error('Invalid coupon code')
    }

    setLoading(false)
  }

  const handleRemove = () => {
    setCode('')
    setError('')
    onRemove?.()
    toast.success('Coupon removed')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleApply()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      {appliedCoupon ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="gold-glass rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/20 p-2 text-primary">
              <Check size={20} />
            </div>
            <div>
              <p className="font-semibold text-primary">{appliedCoupon.code}</p>
              <p className="text-sm text-primary/70">{appliedCoupon.discount}% discount applied</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="rounded-lg border border-primary/30 p-2 text-primary transition-colors hover:bg-red-600/20 hover:border-red-600/50"
          >
            <X size={20} />
          </button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <label className="block text-sm font-medium flex items-center gap-2">
            <Tag size={16} />
            Apply Coupon Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError('')
              }}
              onKeyPress={handleKeyPress}
              disabled={disabled || loading}
              className="flex-1 rounded-lg border border-primary/30 bg-navy px-4 py-3 text-primary placeholder-primary/50 outline-none transition-colors focus:border-primary disabled:opacity-50"
            />
            <button
              onClick={handleApply}
              disabled={disabled || loading}
              className="gold-btn px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Apply'}
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500 flex items-center gap-1"
            >
              <X size={14} /> {error}
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  )
}

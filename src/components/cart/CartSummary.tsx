'use client'

import { motion } from 'framer-motion'

type CartSummaryProps = {
  subtotal: number
  shipping: number
  discount?: number // Discount amount in PKR
  discountPercent?: number // Discount percentage
  tax?: number
  showFreeShippingThreshold?: boolean
  freeShippingThreshold?: number
}

export default function CartSummary({
  subtotal,
  shipping,
  discount = 0,
  discountPercent = 0,
  tax = 0,
  showFreeShippingThreshold = true,
  freeShippingThreshold = 3000,
}: CartSummaryProps) {
  const discountAmount = discount || (discountPercent > 0 ? Math.round((subtotal * discountPercent) / 100) : 0)
  const taxAmount = tax
  const total = subtotal - discountAmount + shipping + taxAmount

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex justify-between">
        <span className="text-primary/75">Subtotal:</span>
        <span className="font-semibold">PKR {subtotal.toLocaleString()}</span>
      </div>

      {discountAmount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between text-green-500"
        >
          <span className="text-primary/75">Discount:</span>
          <span className="font-semibold">-PKR {discountAmount.toLocaleString()}</span>
        </motion.div>
      )}

      <div className="flex justify-between">
        <span className="text-primary/75">Shipping:</span>
        <span className="font-semibold text-green-600">
          {shipping === 0 ? 'FREE' : `PKR ${shipping.toLocaleString()}`}
        </span>
      </div>

      {showFreeShippingThreshold && shipping > 0 && subtotal < freeShippingThreshold && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-yellow-500 bg-yellow-500/10 rounded p-2"
        >
          Add PKR {(freeShippingThreshold - subtotal).toLocaleString()} more for free shipping!
        </motion.p>
      )}

      {taxAmount > 0 && (
        <div className="flex justify-between">
          <span className="text-primary/75">Tax:</span>
          <span className="font-semibold">PKR {taxAmount.toLocaleString()}</span>
        </div>
      )}

      <div className="border-t border-primary/20 pt-4">
        <div className="flex justify-between text-xl">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-primary text-2xl">PKR {total.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  )
}

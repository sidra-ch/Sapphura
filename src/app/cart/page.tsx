'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import CartSummary from '@/components/cart/CartSummary'
import CouponInput from '@/components/cart/CouponInput'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
    toast.success('Quantity updated')
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id)
    toast.success(`${name} removed from cart`)
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart()
      toast.success('Cart cleared')
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-navy">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto gold-glass rounded-2xl p-12"
          >
            <ShoppingBag size={80} className="mx-auto text-primary/40 mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-primary/75 mb-8">
              Start shopping to add items to your cart
            </p>
            <Link href="/collections">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gold-btn px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Continue Shopping
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 3000 ? 0 : 200

  return (
    <div className="pt-32 pb-20 min-h-screen bg-navy">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
              <p className="text-primary/75">{items.length} items in your cart</p>
            </div>
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center space-x-2"
            >
              <Trash2 size={20} />
              <span>Clear Cart</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="gold-glass rounded-xl p-6"
                >
                  <div className="flex items-center space-x-6">
                    {/* Product Image Placeholder */}
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="text-primary" size={40} />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-primary/75 mb-2">Variant: {item.variant}</p>
                      )}
                      <p className="text-lg font-bold text-primary">
                        PKR {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-2 rounded-lg bg-navy hover:bg-secondary transition-colors border border-primary/30"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-2 rounded-lg bg-navy hover:bg-secondary transition-colors border border-primary/30"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-primary/75">Subtotal:</span>
                    <span className="text-xl font-bold text-primary">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="gold-glass rounded-xl p-6 sticky top-32 space-y-6"
              >
                <h2 className="text-2xl font-bold">Order Summary</h2>

                <CartSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  discount={appliedCoupon ? Math.round((subtotal * appliedCoupon.discount) / 100) : 0}
                />

                <CouponInput
                  appliedCoupon={appliedCoupon}
                  onApply={(code, discount) => setAppliedCoupon({ code, discount })}
                  onRemove={() => setAppliedCoupon(null)}
                />

                <Link href="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full gold-btn py-4 rounded-lg font-semibold transition-colors"
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>

                <Link href="/collections">
                  <button className="w-full border-2 border-primary text-primary py-4 rounded-lg font-semibold hover:bg-primary hover:text-navy transition-colors flex items-center justify-center space-x-2">
                    <ArrowLeft size={20} />
                    <span>Continue Shopping</span>
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

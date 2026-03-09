'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck, MapPin, DollarSign, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

type OrderConfirmationProps = {
  orderNumber?: string
  orderDate?: string
  estimatedDelivery?: string
  total?: number
  paymentMethod?: string
  shippingAddress?: {
    name: string
    street: string
    city: string
    phone: string
  }
  items?: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
}

const defaultProps: OrderConfirmationProps = {
  orderNumber: 'ORD-2024-12345',
  orderDate: new Date().toLocaleDateString(),
  estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  total: 25999,
  paymentMethod: 'Credit Card',
  shippingAddress: {
    name: 'Ahmed Hassan',
    street: '123 Main Street, Apt 4B',
    city: 'Karachi, Sindh 75500',
    phone: '+92 300 1234567',
  },
  items: [
    {
      id: '1',
      name: 'Classic Lawn Suit - 2 Piece',
      quantity: 1,
      price: 4999,
    },
    {
      id: '2',
      name: 'Printed Dupatta with Tassels',
      quantity: 2,
      price: 1999,
    },
  ],
}

export default function OrderConfirmation(props: OrderConfirmationProps = {}) {
  const data = { ...defaultProps, ...props }

  const steps = [
    { label: 'Order Confirmed', completed: true },
    { label: 'Processing', completed: false },
    { label: 'Shipped', completed: false },
    { label: 'Delivered', completed: false },
  ]

  return (
    <main className="min-h-screen bg-navy py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <CheckCircle size={80} className="text-green-500" />
          </motion.div>
          <h1 className="text-4xl font-bold text-primary mb-2">Order Confirmed!</h1>
          <p className="text-primary/70 text-lg">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </motion.div>

        {/* Order Number */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gold-glass rounded-xl p-8 mb-8 text-center"
        >
          <p className="text-primary/70 text-sm mb-2">Order Number</p>
          <p className="text-3xl font-bold text-primary mb-4">{data.orderNumber}</p>
          <p className="text-primary/60">Order Date: {data.orderDate}</p>
        </motion.div>

        {/* Order Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gold-glass rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-primary mb-8">Order Status</h2>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : idx === 0
                        ? 'bg-primary text-navy'
                        : 'bg-primary/20 text-primary'
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      step.completed || idx === 0 ? 'text-primary' : 'text-primary/50'
                    }`}
                  >
                    {step.label}
                  </p>
                  {idx === 0 && (
                    <p className="text-sm text-primary/70">
                      Estimated delivery: {data.estimatedDelivery}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="gold-glass rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <MapPin size={24} />
              Shipping Address
            </h3>
            <div className="space-y-2 text-primary/80">
              <p className="font-semibold">{data.shippingAddress?.name}</p>
              <p>{data.shippingAddress?.street}</p>
              <p>{data.shippingAddress?.city}</p>
              <p className="flex items-center gap-2 mt-3 pt-3 border-t border-primary/20">
                <Phone size={16} />
                {data.shippingAddress?.phone}
              </p>
            </div>
          </motion.div>

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="gold-glass rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <DollarSign size={24} />
              Payment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-primary/70">Subtotal</span>
                <span className="font-semibold text-primary">
                  PKR {(data.total! * 0.9).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary/70">Tax</span>
                <span className="font-semibold text-primary">
                  PKR {(data.total! * 0.1).toLocaleString()}
                </span>
              </div>
              <div className="border-t border-primary/20 pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-primary">Total Amount</span>
                  <span className="text-xl font-bold text-primary">
                    PKR {data.total?.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-primary/70 mt-3">
                Payment Method: {data.paymentMethod}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="gold-glass rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Package size={24} />
            Order Items
          </h3>
          <div className="space-y-3">
            {data.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center pb-3 border-b border-primary/20 last:border-0">
                <div>
                  <p className="font-semibold text-primary">{item.name}</p>
                  <p className="text-sm text-primary/70">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-primary">
                  PKR {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/account/orders"
            className="flex-1 gold-btn py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-center text-navy"
          >
            <Truck size={20} />
            Track Order
          </Link>
          <Link
            href="/collections"
            className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </motion.div>

        {/* Support Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-primary/70"
        >
          <p className="mb-3">Need help? We&apos;re here to assist you!</p>
          <div className="flex items-center justify-center gap-4">
            <a href="mailto:support@sappura.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail size={18} />
              support@sappura.com
            </a>
            <span>•</span>
            <a href="tel:+92300" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone size={18} />
              +92 (300) 0000-000
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

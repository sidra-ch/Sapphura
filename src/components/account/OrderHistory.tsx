'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Calendar, MapPin, DollarSign, Eye } from 'lucide-react'
import Link from 'next/link'

type OrderItem = {
  id: string
  productName: string
  quantity: number
  price: number
}

type Order = {
  id: string
  orderNumber: string
  date: string
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  shippingAddress: string
  items: OrderItem[]
}

type OrderHistoryProps = {
  orders?: Order[]
  loading?: boolean
}

const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function OrderHistory({ orders = [], loading = false }: OrderHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
        <div className="rounded-full bg-primary/20 p-3">
          <ShoppingBag size={24} className="text-primary" />
        </div>
        Order History
      </h2>

      {loading ? (
        <div className="text-center py-12 text-primary/60">Loading orders...</div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="gold-glass rounded-xl p-12 text-center"
        >
          <ShoppingBag size={64} className="mx-auto mb-4 text-primary/40" />
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-primary/70 mb-6">Start shopping to see your orders here</p>
          <Link href="/collections" className="gold-btn px-6 py-3 rounded-lg font-semibold inline-block">
            Browse Collections
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="gold-glass rounded-xl p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-primary/60 mb-1">Order Number</p>
                  <p className="font-bold text-primary">{order.orderNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-primary/60 flex items-center gap-1 mb-1">
                    <Calendar size={14} />
                    Order Date
                  </p>
                  <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-sm text-primary/60 flex items-center gap-1 mb-1">
                    <DollarSign size={14} />
                    Total Amount
                  </p>
                  <p className="text-lg font-bold text-primary">PKR {order.total.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-primary/60 mb-1">Status</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-block ${statusStyles[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-t border-primary/20 pt-4">
                <div>
                  <p className="text-sm text-primary/60 mb-1">Payment Method</p>
                  <p className="font-semibold text-primary">{order.paymentMethod}</p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-primary/60 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-primary/60 mb-1">Shipping Address</p>
                    <p className="text-sm text-primary">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-primary mb-2">Items ({order.items.length})</p>
                <div className="space-y-1 text-sm">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-primary/75">
                      <span>{item.productName} x{item.quantity}</span>
                      <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex-1 gold-btn py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-center"
                >
                  <Eye size={18} />
                  View Details
                </Link>

                {['pending', 'confirmed', 'shipped'].includes(order.status) && (
                  <button className="flex-1 border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                    Track Order
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

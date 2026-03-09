'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import WishlistCard from '@/components/product/WishlistCard'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useWishlistStore } from '@/store/wishlistStore'

// Mock wishlist data
const mockWishlistItems = [
  {
    id: '1',
    slug: 'classic-lawn-suit',
    name: 'Classic Lawn Suit - 2 Piece',
    price: 4999,
    image:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&h=500&fit=crop',
    category: 'Unstitched',
    rating: 4.5,
    addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    slug: 'printed-dupatta',
    name: 'Printed Dupatta with Tassels',
    price: 1999,
    image:
      'https://images.unsplash.com/photo-1589231474651-0a7f90f0c05c?w=500&h=500&fit=crop',
    category: 'Accessories',
    rating: 4.8,
    addedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    slug: 'embroidered-kurti',
    name: 'Embroidered Kurti with Palazzo',
    price: 3499,
    image:
      'https://images.unsplash.com/photo-1552252881-4a5590229f00?w=500&h=500&fit=crop',
    category: 'Stitched',
    rating: 4.3,
    addedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    slug: 'cotton-dupatta-white',
    name: 'Pure Cotton White Dupatta',
    price: 899,
    image:
      'https://images.unsplash.com/photo-1520323205657-c74a8e6fbfe7?w=500&h=500&fit=crop',
    category: 'Accessories',
    rating: 4.6,
    addedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function WishlistPage() {
  const [items, setItems] = useState(mockWishlistItems)
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent')

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    toast.success('Removed from wishlist')
  }

  const handleViewDetails = (id: string) => {
    // Navigate to product details
    toast.success('Opening product details...')
  }

  const getSortedItems = () => {
    const sorted = [...items]
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'recent':
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.addedDate || 0).getTime() - new Date(a.addedDate || 0).getTime()
        )
    }
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
  const sortedItems = getSortedItems()

  return (
    <main className="min-h-screen bg-navy">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
              <Heart size={32} className="fill-primary" />
              My Wishlist
            </h1>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                PKR {totalPrice.toLocaleString()}
              </p>
              <p className="text-primary/60">{items.length} items</p>
            </div>
          </div>

          {items.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="gold-glass rounded-xl p-16 text-center"
            >
              <Heart size={80} className="mx-auto mb-4 text-primary/30" />
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-primary/70 mb-8">
                Add items to your wishlist to save them for later
              </p>
              <Link
                href="/collections"
                className="gold-btn px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                <ShoppingBag size={20} />
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Sorting Controls */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="gold-glass rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <p className="text-primary font-semibold">Sort by:</p>
                <div className="flex gap-2">
                  {[
                    { value: 'recent' as const, label: 'Most Recent' },
                    { value: 'price-low' as const, label: 'Price: Low to High' },
                    { value: 'price-high' as const, label: 'Price: High to Low' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                        sortBy === option.value
                          ? 'bg-primary text-navy'
                          : 'bg-primary/20 text-primary hover:bg-primary/30'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {sortedItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <WishlistCard
                      item={item}
                      onRemove={handleRemove}
                      onViewDetails={handleViewDetails}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Action Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="gold-glass rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div>
                  <p className="text-primary/70 text-sm mb-1">Total Wishlist Value</p>
                  <p className="text-2xl font-bold text-primary">
                    PKR {totalPrice.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-4 w-full sm:w-auto">
                  <Link
                    href="/collections"
                    className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    disabled={items.length === 0}
                    className="flex-1 gold-btn py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingBag size={20} />
                    Add All to Cart
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

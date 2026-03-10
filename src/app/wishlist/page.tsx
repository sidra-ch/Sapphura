'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Breadcrumb from '@/components/navigation/Breadcrumb'
import WishlistCard from '@/components/product/WishlistCard'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useWishlistStore } from '@/store/wishlistStore'

type ProductImageMap = Record<string, string>

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.items)
  const removeWishlistItem = useWishlistStore((state) => state.removeItem)
  const hasHydrated = useWishlistStore((state) => state.hasHydrated)
  const [imageMap, setImageMap] = useState<ProductImageMap>({})
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high'>('recent')

  useEffect(() => {
    const loadProductImages = async () => {
      try {
        const response = await fetch('/api/products?limit=300', { cache: 'no-store' })
        const json = await response.json()
        if (!json.success || !Array.isArray(json.products)) return

        const nextMap: ProductImageMap = {}
        for (const product of json.products) {
          if (product?.slug && Array.isArray(product.images) && product.images[0]) {
            nextMap[product.slug] = product.images[0]
          }
        }
        setImageMap(nextMap)
      } catch {
        setImageMap({})
      }
    }

    loadProductImages()
  }, [])

  const items = useMemo(
    () =>
      wishlistItems.map((item) => ({
        id: item.productId,
        slug: item.slug,
        name: item.productName,
        price: item.price,
        image:
          imageMap[item.slug] ||
          (item.image?.includes('images.unsplash.com') ? '' : item.image) ||
          'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004805/logo-1_gzmux1.png',
        category: 'Wishlist',
      })),
    [wishlistItems, imageMap]
  )

  const handleRemove = (id: string) => {
    removeWishlistItem(id)
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
        return sorted.reverse()
    }
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
  const sortedItems = getSortedItems()

  return (
    <main className="min-h-screen bg-navy pt-28 md:pt-32">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="flex items-center gap-3 text-3xl font-bold text-primary sm:text-4xl">
              <Heart size={32} className="fill-primary" />
              My Wishlist
            </h1>
            <div className="text-left sm:text-right">
              <p className="text-2xl font-bold text-primary">
                PKR {totalPrice.toLocaleString()}
              </p>
              <p className="text-primary/60">{items.length} items</p>
            </div>
          </div>

          {!hasHydrated ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="gold-glass rounded-xl p-16 text-center"
            >
              <p className="text-primary/70">Loading wishlist...</p>
            </motion.div>
          ) : items.length === 0 ? (
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
                className="gold-glass mb-8 flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-primary font-semibold">Sort by:</p>
                <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
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
              <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                className="gold-glass flex flex-col gap-4 rounded-xl p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-primary/70 text-sm mb-1">Total Wishlist Value</p>
                  <p className="text-2xl font-bold text-primary">
                    PKR {totalPrice.toLocaleString()}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                  <Link
                    href="/collections"
                    className="flex-1 rounded-lg border-2 border-primary py-3 text-center font-semibold text-primary transition-colors hover:bg-primary/10"
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

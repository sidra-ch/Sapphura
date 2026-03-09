'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

type ProductCardProps = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  rating?: number
  originalPrice?: number
  badge?: string
  onAddToCart?: (id: string) => void
  onWishlist?: (id: string) => void
  showAnimations?: boolean
  showWishlistButton?: boolean
  animationDelay?: number
}

export default function ProductCard({
  id,
  slug,
  name,
  image,
  price,
  rating = 0,
  originalPrice,
  badge,
  onAddToCart,
  onWishlist,
  showAnimations = false,
  showWishlistButton = false,
  animationDelay = 0,
}: ProductCardProps) {
  const [hoveredProduct, setHoveredProduct] = useState(false)
  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const content = (
    <motion.div
      initial={showAnimations ? { opacity: 0, y: 50 } : { opacity: 1, y: 0 }}
      whileInView={showAnimations ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: animationDelay * 0.1 }}
      onMouseEnter={() => setHoveredProduct(true)}
      onMouseLeave={() => setHoveredProduct(false)}
    >
      <motion.div
        whileHover={showAnimations ? { y: -10 } : { y: 0 }}
        className="group gold-glass rounded-2xl overflow-hidden transition-all duration-300 relative cursor-pointer"
      >
        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10 bg-primary text-navy px-3 py-1 rounded-full text-sm font-semibold">
            {badge}
          </div>
        )}

        {/* Sale Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        {showWishlistButton && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 z-10 bg-navy p-2 rounded-full text-primary hover:bg-primary hover:text-navy transition-colors border border-primary/30"
            onClick={(e) => {
              e.preventDefault()
              onWishlist?.(id)
            }}
          >
            <Heart size={20} />
          </motion.button>
        )}

        {/* Image */}
        <div className="aspect-square relative overflow-hidden">
          <motion.div
            animate={hoveredProduct && showAnimations ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative"
          >
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              unoptimized
            />
          </motion.div>

          {/* Quick Add to Cart (only on hover for BestSellers style) */}
          {showAnimations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={hoveredProduct ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onAddToCart?.(id)
                }}
                className="w-full gold-btn px-4 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(rating) ? 'fill-primary text-primary' : 'text-primary/30'}
                />
              ))}
            </div>
            <span className="text-sm text-primary/75">
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                PKR {price.toLocaleString()}
              </p>
              {originalPrice && (
                <p className="text-sm line-through text-primary/60">
                  PKR {originalPrice.toLocaleString()}
                </p>
              )}
            </div>
            {!showAnimations && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onAddToCart?.(id)
                }}
                className="rounded-lg border border-primary/30 bg-navy p-2 text-primary transition-colors hover:bg-primary hover:text-navy"
              >
                <ShoppingCart size={18} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <Link href={`/products/${slug}`}>
      {content}
    </Link>
  )
}

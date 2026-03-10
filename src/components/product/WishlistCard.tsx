'use client'

import { motion } from 'framer-motion'
import { Heart, Trash2, ShoppingCart, Link as LinkIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'

type WishlistItem = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  category?: string
  rating?: number
  addedDate?: string
}

type WishlistCardProps = {
  item: WishlistItem
  onRemove?: (id: string) => void
  onViewDetails?: (id: string) => void
  loading?: boolean
}

export default function WishlistCard({
  item,
  onRemove,
  onViewDetails,
  loading = false,
}: WishlistCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
    toast.success(`${item.name} added to cart!`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="gold-glass rounded-xl overflow-hidden transition-all"
    >
      <Link href={`/products/${item.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-navy-light">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            unoptimized
          />

          {/* Remove from Wishlist */}
          <motion.button
            initial={{ opacity: 1, scale: 1 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              onRemove?.(item.id)
              toast.success('Removed from wishlist')
            }}
            disabled={loading}
            className="absolute top-3 right-3 rounded-full bg-red-500/20 border border-red-500/50 p-2 text-red-400 hover:bg-red-500/40 transition-colors z-10"
          >
            <Heart size={20} className="fill-current" />
          </motion.button>

          {/* Added Date Badge */}
          {item.addedDate && (
            <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-1 rounded-full text-xs text-white">
              {new Date(item.addedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 space-y-3">
        <Link href={`/products/${item.slug}`}>
          <h3 className="font-semibold text-primary hover:text-primary/80 line-clamp-2 cursor-pointer transition-colors">
            {item.name}
          </h3>
        </Link>

        {item.category && (
          <p className="text-xs text-primary/60">{item.category}</p>
        )}

        {item.rating && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(item.rating!) ? 'text-primary' : 'text-primary/30'}>
                ★
              </span>
            ))}
            <span className="text-xs text-primary/60 ml-1">({item.rating})</span>
          </div>
        )}

        <p className="text-lg font-bold text-primary">PKR {item.price.toLocaleString()}</p>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="flex-1 gold-btn py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>

          <Link
            href={`/products/${item.slug}`}
            className="flex-1 border-2 border-primary text-primary py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm hover:bg-primary/10 transition-colors"
          >
            <LinkIcon size={16} />
            View
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

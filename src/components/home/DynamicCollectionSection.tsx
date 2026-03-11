'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Star, Clock, Tag } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import SkeletonLoader from '@/components/ui/SkeletonLoader'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  bannerImage?: string
  type: string
  showOnHome: boolean
  products?: {
    product: {
      id: string
      name: string
      slug: string
      price: number
      originalPrice?: number
      images: string[]
      rating: number
      reviewCount: number
      inStock: boolean
    }
  }[]
}

interface DynamicCollectionSectionProps {
  collectionSlug: string
  title?: string
  subtitle?: string
  maxProducts?: number
  showViewAll?: boolean
  className?: string
}

export default function DynamicCollectionSection({
  collectionSlug,
  title,
  subtitle,
  maxProducts = 8,
  showViewAll = true,
  className = ''
}: DynamicCollectionSectionProps) {
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/collections?slug=${collectionSlug}&includeProducts=true&limit=${maxProducts}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch collection')
        }

        const data = await response.json()
        
        if (data.success && data.collection) {
          setCollection(data.collection)
        } else {
          setError(data.error || 'Collection not found')
        }
      } catch (error) {
        console.error('Error fetching collection:', error)
        setError('Failed to load collection')
      } finally {
        setLoading(false)
      }
    }

    fetchCollection()
  }, [collectionSlug, maxProducts])

  if (loading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <SkeletonLoader className="h-12 w-64 mx-auto mb-4" />
            <SkeletonLoader className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(maxProducts)].map((_, i) => (
              <div key={i} className="bg-navy-light rounded-xl overflow-hidden">
                <SkeletonLoader className="aspect-square" />
                <div className="p-4">
                  <SkeletonLoader className="h-6 w-3/4 mb-2" />
                  <SkeletonLoader className="h-8 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !collection) {
    return null // Don't render section if collection doesn't exist
  }

  const products = collection.products?.map(pc => pc.product) || []

  if (products.length === 0) {
    return null // Don't render empty sections
  }

  const getCollectionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'seasonal':
        return '🌙'
      case 'promotional':
        return '🎉'
      case 'featured':
        return '⭐'
      default:
        return '📦'
    }
  }

  const getCollectionTheme = (slug: string) => {
    if (slug.includes('ramadan')) {
      return {
        bgGradient: 'from-emerald-900/20 to-emerald-700/20',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-400',
        icon: '🌙'
      }
    }
    if (slug.includes('eid')) {
      return {
        bgGradient: 'from-purple-900/20 to-purple-700/20',
        borderColor: 'border-purple-500/30',
        textColor: 'text-purple-400',
        icon: '✨'
      }
    }
    if (slug.includes('flash-sale') || slug.includes('sale')) {
      return {
        bgGradient: 'from-red-900/20 to-orange-700/20',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
        icon: '🔥'
      }
    }
    return {
      bgGradient: 'from-primary/20 to-accent/20',
      borderColor: 'border-primary/30',
      textColor: 'text-primary',
      icon: '⭐'
    }
  }

  const theme = getCollectionTheme(collection.slug)

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl">{theme.icon}</span>
            <h2 className={`text-4xl font-bold ${theme.textColor}`}>
              {title || collection.name}
            </h2>
          </div>
          
          {subtitle && (
            <p className="text-lg opacity-80 mb-4">{subtitle}</p>
          )}
          
          {collection.description && (
            <p className="text-base opacity-70 max-w-2xl mx-auto">
              {collection.description}
            </p>
          )}
        </motion.div>

        {/* Banner Image (if available) */}
        {collection.bannerImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className={`relative rounded-3xl overflow-hidden ${theme.bgGradient} ${theme.borderColor} border-2`}>
              <Image
                src={collection.bannerImage}
                alt={collection.name}
                width={1200}
                height={300}
                className="w-full h-64 md:h-80 object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                {collection.description && (
                  <p className="opacity-90 max-w-md">{collection.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={`/products/${product.slug}`}>
                <div className={`gold-glass rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300 ${theme.borderColor} border-2`}>
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.images[0] || ''}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 20vw"
                    />
                    
                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                    
                    {/* Special Offer Badge */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Special
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs opacity-60">({product.reviewCount})</span>
                      </div>
                      
                      {!product.inStock && (
                        <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-bold ${theme.textColor}`}>
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm line-through opacity-50">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        {showViewAll && products.length >= maxProducts && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link 
              href={`/collections/${collection.slug}`}
              className={`inline-flex items-center gap-2 ${theme.textColor} hover:opacity-80 transition-opacity font-semibold`}
            >
              View All {collection.name} Products
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

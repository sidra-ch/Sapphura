'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart, ShoppingCart, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  category: string
}

interface FeaturedProductsProps {
  title?: string
  subtitle?: string
  maxProducts?: number
  showViewAll?: boolean
  className?: string
}

export default function FeaturedProducts({
  title = 'Featured Products',
  subtitle = 'Handpicked pieces from our exclusive collection',
  maxProducts = 8,
  showViewAll = true,
  className = ''
}: FeaturedProductsProps) {
  const addItem = useCartStore((state) => state.addItem)
  const addWishlistItem = useWishlistStore((state) => state.addItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)

  // Hardcoded featured products
  const featuredProducts: Product[] = [
    {
      id: 'new-collection_soycvp',
      name: 'New Collection Premium',
      slug: 'new-collection_soycvp',
      price: 4999,
      originalPrice: 6999,
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004797/new-collection_soycvp.jpg'],
      rating: 4.9,
      reviewCount: 312,
      inStock: true,
      category: 'New Collection'
    },
    {
      id: 'wintercollection-5_a2uwvx',
      name: 'Winter Special Edition',
      slug: 'wintercollection-5_a2uwvx',
      price: 3499,
      originalPrice: 4499,
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004862/wintercollection-5_a2uwvx.jpg'],
      rating: 4.8,
      reviewCount: 267,
      inStock: true,
      category: 'Winter Collection'
    },
    {
      id: 'neckles-3_crgycd',
      name: 'Elegant Necklace',
      slug: 'neckles-3_crgycd',
      price: 2999,
      originalPrice: 3999,
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004795/neckles-3_crgycd.jpg'],
      rating: 4.8,
      reviewCount: 124,
      inStock: true,
      category: 'Necklaces'
    },
    {
      id: 'make-up_aeyh44',
      name: 'Premium Makeup Set',
      slug: 'make-up_aeyh44',
      price: 1999,
      originalPrice: 2499,
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004790/make-up_aeyh44.jpg'],
      rating: 4.9,
      reviewCount: 89,
      inStock: true,
      category: 'Makeup'
    },
    {
      id: 'earing-1_zd3fr9',
      name: 'Designer Earrings',
      slug: 'earing-1_zd3fr9',
      price: 1499,
      originalPrice: 1999,
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004783/earing-1_zd3fr9.jpg'],
      rating: 4.7,
      reviewCount: 156,
      inStock: true,
      category: 'Jewelry'
    },
    {
      id: 'suit-2_vrrzjh',
      name: 'Designer Suit',
      slug: 'suit-2_vrrzjh',
      price: 5999,
      originalPrice: 7999,
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004805/suit-2_vrrzjh.jpg'],
      rating: 4.8,
      reviewCount: 204,
      inStock: true,
      category: 'Party Wear'
    },
    {
      id: 'summer-3_yoelfq',
      name: 'Summer Dress',
      slug: 'summer-3_yoelfq',
      price: 2499,
      originalPrice: 3499,
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004844/summer-3_yoelfq.jpg'],
      rating: 4.6,
      reviewCount: 108,
      inStock: true,
      category: 'Summer Wear'
    },
    {
      id: 'suit-6_nqlzt6',
      name: 'Suit Collection',
      slug: 'suit-6_nqlzt6',
      price: 8999,
      originalPrice: 12999,
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004809/suit-6_nqlzt6.jpg'],
      rating: 4.9,
      reviewCount: 420,
      inStock: true,
      category: 'Wedding Collection'
    }
  ]

  const [products, setProducts] = useState<Product[]>(featuredProducts.slice(0, maxProducts))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    })
    toast.success(`${product.name} added to cart!`, {
      icon: '🛍️',
    })
  }

  const handleToggleWishlist = (product: Product) => {
    const currentlyInWishlist = isInWishlist(product.id)

    if (currentlyInWishlist) {
      // Remove from wishlist logic here
      toast.success('Removed from wishlist')
    } else {
      addWishlistItem({
        productId: product.id,
        productName: product.name,
        price: product.price,
        image: product.images[0] || '',
        slug: product.slug,
      })
      toast.success('Added to wishlist')
    }
  }

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

  if (error || products.length === 0) {
    return null // Don't render section if no products
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary mb-4">
            {title}
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="gold-glass rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300">
                <Link href={`/products/${product.slug}`}>
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.images[0] || ''}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 25vw, 20vw"
                      priority={index < 4} // Priority load first 4 images
                    />
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                    
                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleToggleWishlist(product)
                        }}
                        className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(product)
                        }}
                        className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-primary text-primary'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs opacity-60">({product.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-primary">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm line-through opacity-50 ml-2">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!product.inStock && (
                        <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        {showViewAll && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link 
              href="/collections/featured"
              className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity font-semibold"
            >
              View All Featured Products
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

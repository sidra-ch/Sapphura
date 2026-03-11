'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import SkeletonLoader from '@/components/ui/SkeletonLoader'

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
  createdAt: string
}

interface NewArrivalsProps {
  title?: string
  subtitle?: string
  maxProducts?: number
  showViewAll?: boolean
  className?: string
}

export default function NewArrivals({
  title = 'New Arrivals',
  subtitle = 'Fresh pieces just added to our collection',
  maxProducts = 8,
  showViewAll = true,
  className = ''
}: NewArrivalsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      console.log(`Added ${product.name} to cart`)
    }
  }

  const handleWishlistToggle = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    console.log(`Toggled wishlist for ${product.name}`)
  }

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        setLoading(true)
        setError(null)

        // New Arrivals - Focus on necklaces, suits, and new collections
        const newArrivalProducts: Product[] = [
          {
            id: 'na1',
            name: 'Elegant Necklace Premium',
            slug: 'elegant-necklace-premium',
            price: 4299,
            originalPrice: 5499,
            images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004795/neckles-3_crgycd.jpg'],
            rating: 4.9,
            reviewCount: 89,
            inStock: true,
            category: 'Necklaces',
            createdAt: new Date().toISOString()
          },
          {
            id: 'na2',
            name: 'Designer Suits Collection',
            slug: 'designer-suits-collection',
            price: 6999,
            originalPrice: 8999,
            images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004840/suits_cwhxhg.jpg'],
            rating: 4.8,
            reviewCount: 156,
            inStock: true,
            category: 'Suits',
            createdAt: new Date().toISOString()
          },
          {
            id: 'na3',
            name: 'New Collection Special',
            slug: 'new-collection-special',
            price: 5499,
            originalPrice: 6999,
            images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004797/new-collection_soycvp.jpg'],
            rating: 4.9,
            reviewCount: 234,
            inStock: true,
            category: 'New Collection',
            createdAt: new Date().toISOString()
          },
          {
            id: 'na4',
            name: 'Winter Collection Premium',
            slug: 'winter-collection-premium',
            price: 4599,
            originalPrice: 5999,
            images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004862/wintercollection-5_a2uwvx.jpg'],
            rating: 4.7,
            reviewCount: 178,
            inStock: true,
            category: 'Winter Collection',
            createdAt: new Date().toISOString()
          },
          {
            id: 'na5',
            name: 'Fashion Collection New',
            slug: 'fashion-collection-new',
            price: 3799,
            originalPrice: 4799,
            images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004777/clothes_collection-4_uerze3.jpg'],
            rating: 4.6,
            reviewCount: 145,
            inStock: true,
            category: 'Fashion',
            createdAt: new Date().toISOString()
          },
          {
            id: 'na6',
            name: 'Premium Makeup New',
            slug: 'premium-makeup-new',
            price: 2199,
            originalPrice: 2899,
            images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004790/make-up_aeyh44.jpg'],
            rating: 4.8,
            reviewCount: 198,
            inStock: true,
            category: 'Makeup',
            createdAt: new Date().toISOString()
          },
          {
            id: 'na7',
            name: 'Designer Bangles New',
            slug: 'designer-bangles-new',
            price: 3299,
            originalPrice: 4199,
            images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004770/bangals-2_slcypx.jpg'],
            rating: 4.7,
            reviewCount: 167,
            inStock: true,
            category: 'Bangles',
            createdAt: new Date().toISOString()
          },
          {
            id: 'na8',
            name: 'Classic Earrings New',
            slug: 'classic-earrings-new',
            price: 1799,
            originalPrice: 2399,
            images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004783/earing-3_kz0ik8.jpg'],
            rating: 4.8,
            reviewCount: 213,
            inStock: true,
            category: 'Earrings',
            createdAt: new Date().toISOString()
          }
        ]

        const limitedProducts = newArrivalProducts.slice(0, maxProducts)
        setProducts(limitedProducts)
        
      } catch (error) {
        console.error('Error loading new arrivals:', error)
        setError('Failed to load new arrivals')
      } finally {
        setLoading(false)
      }
    }

    loadNewArrivals()
  }, [maxProducts])

  if (loading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">{title}</h2>
            <p className="text-xl text-primary/80">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(maxProducts)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
            <p className="text-primary/70">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold text-primary">{title}</h2>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-xl text-primary/80 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard
                id={product.id}
                slug={product.slug}
                name={product.name}
                image={product.images[0]}
                price={product.price}
                rating={product.rating}
                originalPrice={product.originalPrice}
                onAddToCart={() => handleAddToCart(product.id)}
                onWishlist={() => handleWishlistToggle(product.id)}
                showAnimations={true}
                showWishlistButton={true}
                animationDelay={index}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        {showViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              href="/collections/new-arrivals"
              className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity font-semibold"
            >
              View All New Arrivals
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

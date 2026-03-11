'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import ProductCard from '@/components/product/ProductCard'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { CloudinaryImageAsset } from '@/lib/product-image-map'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  badge?: string
  color?: string
}

interface BestSellersProps {
  initialAssets?: CloudinaryImageAsset[]
}

const BestSellers = ({ initialAssets = [] }: BestSellersProps) => {
  const addItem = useCartStore((state) => state.addItem)
  const addWishlistItem = useWishlistStore((state) => state.addItem)
  const removeWishlistItem = useWishlistStore((state) => state.removeItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const [cloudinaryAssets, setCloudinaryAssets] = useState<CloudinaryImageAsset[]>(initialAssets)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(!initialAssets.length)

  useEffect(() => {
    // Hardcoded best sellers for reliable image loading
    const bestSellersProducts: Product[] = [
      {
        id: 'wintercollection-5_a2uwvx',
        name: 'Winter Collection',
        slug: 'wintercollection-5_a2uwvx',
        price: 3999,
        images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004862/wintercollection-5_a2uwvx.jpg'],
        rating: 4.8,
      },
      {
        id: 'summer-3_yoelfq',
        name: 'Summer Collection',
        slug: 'summer-3_yoelfq',
        price: 2999,
        images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004844/summer-3_yoelfq.jpg'],
        rating: 4.6,
      },
      {
        id: 'suit-2_vrrzjh',
        name: 'Designer Suit',
        slug: 'suit-2_vrrzjh',
        price: 4999,
        images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004805/suit-2_vrrzjh.jpg'],
        rating: 4.9,
      },
      {
        id: 'earing-1_zd3fr9',
        name: 'Elegant Earrings',
        slug: 'earing-1_zd3fr9',
        price: 1999,
        images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004783/earing-1_zd3fr9.jpg'],
        rating: 4.7,
      },
      {
        id: 'bangals-2_slcypx',
        name: 'Beautiful Bangles',
        slug: 'bangals-2_slcypx',
        price: 2499,
        images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004770/bangals-2_slcypx.jpg'],
        rating: 4.8,
      },
      {
        id: 'suit-6_nqlzt6',
        name: 'Premium Suit',
        slug: 'suit-6_nqlzt6',
        price: 5999,
        images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004809/suit-6_nqlzt6.jpg'],
        rating: 4.9,
      }
    ]

    setProducts(bestSellersProducts)
    setLoading(false)
  }, []) // Empty dependency array as we only want to run this once

  // Add badges and colors without changing the carefully selected images
  const displayProducts = products.map((product, index) => ({
    ...product,
    badge: index === 0 ? 'Bestseller' : index === 1 ? 'New' : index === 2 ? 'Hot' : index === 4 ? 'Sale' : undefined,
    color: ['from-rose-400 to-pink-600', 'from-amber-400 to-orange-600', 'from-purple-400 to-indigo-600', 'from-emerald-400 to-teal-600', 'from-blue-400 to-cyan-600', 'from-pink-400 to-rose-600'][index]
  }))

  const handleAddToCart = (productId: string) => {
    const product = displayProducts.find(p => p.id === productId)
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      })
      toast.success(`${product.name} added to cart!`)
    }
  }

  const handleWishlistToggle = (productId: string) => {
    const product = displayProducts.find((p) => p.id === productId)
    if (!product) return

    if (isInWishlist(productId)) {
      removeWishlistItem(productId)
      toast.success('Removed from wishlist')
      return
    }

    addWishlistItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.images[0] || '',
      slug: product.slug,
    })
    toast.success('Added to wishlist')
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-navy-dark to-navy">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-12 bg-navy-light rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-navy-light rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader type="product" count={6} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-navy-dark to-navy">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Best Sellers
          </h2>
          <p className="text-primary/80 text-lg max-w-2xl mx-auto">
            Discover our most loved pieces, handpicked by thousands of satisfied customers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              image={product.images[0]}
              price={product.price}
              rating={product.rating}
              badge={product.badge}
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlistToggle}
              showAnimations={true}
              showWishlistButton={true}
              animationDelay={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellers
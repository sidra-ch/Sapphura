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

const BestSellers = () => {
  const addItem = useCartStore((state) => state.addItem)
  const addWishlistItem = useWishlistStore((state) => state.addItem)
  const removeWishlistItem = useWishlistStore((state) => state.removeItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const [cloudinaryAssets, setCloudinaryAssets] = useState<CloudinaryImageAsset[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Cloudinary images first to ensure category diversity
        const cloudinaryResponse = await fetch('/api/cloudinary/media', { cache: 'no-store' })
        const cloudinaryJson = await cloudinaryResponse.json()
        
        if (cloudinaryJson.success && Array.isArray(cloudinaryJson.media?.allAssets)) {
          const imageAssets = cloudinaryJson.media.allAssets
            .filter((asset: { resourceType: string }) => asset.resourceType === 'image')
            .map((asset: { publicId: string; secureUrl: string }) => ({
              publicId: asset.publicId,
              secureUrl: asset.secureUrl,
            }))

          setCloudinaryAssets(imageAssets)
          console.log('🖼️ Best Sellers Cloudinary images:', imageAssets.length, 'images loaded')
          
          // Create products directly from Cloudinary with guaranteed categories
          const bestSellersProducts: Product[] = []
          
          // Exact order: Winter, Summer, Suit, Earring, Bangles, Suit
          const categoryMatchers = [
            { keyword: 'wintercollection', name: 'Winter Collection', category: 'Winter Collection' },
            { keyword: 'summer', name: 'Summer Collection', category: 'Summer Collection' },
            { keyword: 'suit', name: 'Designer Suit', category: 'Suits' },
            { keyword: 'earing', name: 'Elegant Earrings', category: 'Earrings' },
            { keyword: 'bangal', name: 'Beautiful Bangles', category: 'Bangles' },
            { keyword: 'suit', name: 'Premium Suit', category: 'Suits', skip: 1 }, // Different suit
          ]
          
          categoryMatchers.forEach((matcher, index) => {
            const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '')
            
            let foundAssets = imageAssets.filter((asset: { publicId: string }) => 
              normalize(asset.publicId).includes(normalize(matcher.keyword))
            )
            
            // For second suit, skip the first one
            if (matcher.skip && foundAssets.length > matcher.skip) {
              foundAssets = foundAssets.slice(matcher.skip)
            }
            
            const selectedAsset = foundAssets[0]
            
            if (selectedAsset) {
              // Create a product from this Cloudinary image
              const publicId = selectedAsset.publicId
              // Use the same slug format as cloudinary-catalog.ts
              const slug = encodeURIComponent(publicId)
              
              bestSellersProducts.push({
                id: publicId,
                name: matcher.name,
                slug: slug,
                price: matcher.category === 'Winter Collection' ? 3999 :
                       matcher.category === 'Summer Collection' ? 2999 :
                       matcher.category === 'Suits' ? 4999 :
                       matcher.category === 'Earrings' ? 1999 :
                       matcher.category === 'Bangles' ? 2499 : 3499,
                images: [selectedAsset.secureUrl],
                rating: 4.5 + (index * 0.1),
              })
            }
          })
          
          setProducts(bestSellersProducts)
          console.log('✅ Best Sellers created from Cloudinary:', bestSellersProducts.length, 'products')
          console.log('Categories:', bestSellersProducts.map(p => p.name))
        }
        
        setLoading(false)
      } catch (error) {
        console.error('❌ BestSellers data fetch error:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

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

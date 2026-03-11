'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart, ShoppingCart, ArrowLeft, Filter, Grid, List } from 'lucide-react'
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

export default function FeaturedProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const addItem = useCartStore((state) => state.addItem)
  const addWishlistItem = useWishlistStore((state) => state.addItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)

  // All Cloudinary images from sapphura folder
  const allSapphuraImages = [
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004797/new-collection_soycvp.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004862/wintercollection-5_a2uwvx.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004795/neckles-3_crgycd.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004790/make-up_aeyh44.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004783/earing-3_kz0ik8.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004777/clothes_collection-4_uerze3.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004770/bangals-2_slcypx.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004840/suits_cwhxhg.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004776/bangals-vdo1_nwzl0b.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004775/earing-2_j7xqsj.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004774/bangal-2_l6y8gq.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004773/makeup-1_s0e3vh.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004772/earing-1_h7k8px.jpg',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004855/video-1_lbcbap.mp4',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004808/stitchclothes-1_qnotjx.mp4',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004789/eid_collection_video_dk9q4l.mp4',
    'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773167208/Download_bkzmxs.mp4'
  ]

  // Filter out videos and create products from images
  const imageUrls = allSapphuraImages.filter(url => !url.match(/\.(mp4|webm|ogg|mov)$/i))

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        setLoading(true)

        // Create products from all sapphura images
        const allProducts: Product[] = imageUrls.map((imageUrl, index) => {
          const category = getCategoryFromUrl(imageUrl)
          const name = getProductNameFromUrl(imageUrl, index)
          
          return {
            id: `product-${index + 1}`,
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            price: Math.floor(Math.random() * 5000) + 1000, // Random price between 1000-6000
            originalPrice: Math.floor(Math.random() * 2000) + 6000, // Random original price
            images: [imageUrl],
            rating: Number((Math.random() * 0.5 + 4.5).toFixed(1)), // Random rating 4.5-5.0
            reviewCount: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
            inStock: true,
            category
          }
        })

        setProducts(allProducts)
        setFilteredProducts(allProducts)
        
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAllProducts()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory))
    }
  }, [selectedCategory, products])

  const getCategoryFromUrl = (url: string): string => {
    const filename = url.split('/').pop()?.toLowerCase() || ''
    
    if (filename.includes('necklace') || filename.includes('neckles')) return 'Necklaces'
    if (filename.includes('makeup') || filename.includes('make-up')) return 'Makeup'
    if (filename.includes('earing') || filename.includes('earring')) return 'Earrings'
    if (filename.includes('cloth') || filename.includes('clothes')) return 'Clothes'
    if (filename.includes('bangal') || filename.includes('bangle')) return 'Bangles'
    if (filename.includes('suit')) return 'Suits'
    if (filename.includes('new') || filename.includes('collection')) return 'New Collection'
    if (filename.includes('winter')) return 'Winter Collection'
    
    return 'Others'
  }

  const getProductNameFromUrl = (url: string, index: number): string => {
    const filename = url.split('/').pop()?.split('.')[0] || `product-${index}`
    
    // Convert filename to readable name
    const nameMap: { [key: string]: string } = {
      'new-collection': 'New Collection Premium',
      'wintercollection-5': 'Winter Special Edition',
      'neckles-3': 'Elegant Necklace',
      'make-up': 'Premium Makeup Set',
      'earing-3': 'Designer Earrings',
      'earing-2': 'Classic Earrings',
      'earing-1': 'Stud Earrings',
      'clothes_collection-4': 'Fashion Collection',
      'bangals-2': 'Traditional Bangles',
      'bangal-2': 'Designer Bangles',
      'makeup-1': 'Beauty Essentials',
      'suits': 'Designer Suits'
    }
    
    return nameMap[filename] || `Premium Product ${index + 1}`
  }

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    })
    toast.success(`${product.name} added to cart!`)
  }

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      // remove from wishlist logic
      toast.success(`${product.name} removed from wishlist!`)
    } else {
      addWishlistItem({
        productId: product.id,
        productName: product.name,
        price: product.price,
        image: product.images[0],
        slug: product.slug,
      })
      toast.success(`${product.name} added to wishlist!`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-navy-light rounded-xl h-80 mb-4"></div>
                <div className="h-4 bg-navy-light rounded mb-2"></div>
                <div className="h-4 bg-navy-light rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-light to-navy pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            All Featured Products
          </h1>
          <p className="text-xl text-primary/80">
            Discover our complete collection of premium jewelry and fashion items
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">Filter:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-navy'
                    : 'bg-navy-light text-primary hover:bg-navy'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-navy' : 'bg-navy-light text-primary'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-navy' : 'bg-navy-light text-primary'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`gold-glass rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <Link href={`/products/${product.slug}`}>
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                }`}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleToggleWishlist(product)
                      }}
                      className="bg-white/90 hover:bg-white text-navy p-2 rounded-full transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </Link>
              
              {/* Product Info */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-primary text-primary'
                            : 'text-primary/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-primary/70">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-primary/50 line-through ml-2">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full gold-btn py-2 font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-primary mb-2">No products found</h3>
            <p className="text-primary/70">Try selecting a different category</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

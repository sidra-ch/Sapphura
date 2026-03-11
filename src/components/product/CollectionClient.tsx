'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Filter, SlidersHorizontal, ChevronDown, Check } from 'lucide-react'

type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  images: string[]
  rating?: number
  inStock?: boolean
  createdAt?: string | Date
}

type CloudinaryImage = {
  publicId: string
  secureUrl: string
}

type Props = {
  products: Product[]
  cloudinaryImages: CloudinaryImage[]
  isAllProductsView: boolean
  pageTitle: string
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'top-rated'

export default function CollectionClient({ products, cloudinaryImages, isAllProductsView, pageTitle }: Props) {
  const [sort, setSort] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<number>(100000) // max price filter
  const [inStockOnly, setInStockOnly] = useState(false)

  // Filtering & Sorting Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // 1. Filter Check (In Stock)
    if (inStockOnly) {
      result = result.filter(p => p.inStock !== false)
    }

    // 2. Filter Check (Price Range)
    result = result.filter(p => p.price <= priceRange)

    // 3. Sorting
    result.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'top-rated':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
        default:
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
      }
    })

    return result
  }, [products, sort, priceRange, inStockOnly])

  const hasCloudinary = isAllProductsView && cloudinaryImages.length > 0
  const totalItems = hasCloudinary ? cloudinaryImages.length : filteredAndSortedProducts.length

  return (
    <div className="container mx-auto px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{pageTitle}</h1>
        <p className="text-primary/80 text-lg">
          {totalItems > 0
            ? `Showing ${totalItems} ${hasCloudinary ? 'images' : 'products'}`
            : 'No products found matching your criteria'}
        </p>
      </div>

      {/* Toolbar for Sorting and Filtering Toggle */}
      {!hasCloudinary && products.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-navy-light/50 p-4 rounded-xl border border-primary/10">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-primary/70">Sort by:</span>
            <div className="relative group">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none bg-navy border border-primary/20 rounded-lg px-4 py-2 pr-10 text-primary focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="top-rated">Top Rated</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        {!hasCloudinary && showFilters && products.length > 0 && (
          <motion.aside
            initial={{ opacity: 0, x: -20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: -20, width: 0 }}
            className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-navy-light/30 border border-primary/10 rounded-2xl p-6 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <SlidersHorizontal size={18} /> Filters
                </h3>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-semibold mb-4 text-primary">Max Price: PKR {priceRange.toLocaleString()}</h4>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-primary bg-navy-light h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-primary/60 mt-2">
                  <span>PKR 0</span>
                  <span>PKR 100K+</span>
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <h4 className="font-semibold mb-4 text-primary">Availability</h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${inStockOnly ? 'bg-primary border-primary' : 'border-primary/50 group-hover:border-primary'}`}>
                    {inStockOnly && <Check size={14} className="text-navy" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span className="text-primary/80">In Stock Only</span>
                </label>
              </div>

              <button
                onClick={() => {
                  setPriceRange(100000)
                  setInStockOnly(false)
                }}
                className="w-full py-2 border border-primary/30 rounded-lg text-primary hover:bg-primary/10 transition"
              >
                Clear Filters
              </button>
            </div>
          </motion.aside>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {hasCloudinary ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cloudinaryImages.map((image) => (
                <Link
                  key={image.publicId}
                  href={`/products/${encodeURIComponent(image.publicId)}`}
                  className="gold-glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="aspect-[4/3] bg-navy-light overflow-hidden relative">
                    <Image
                      src={image.secureUrl}
                      alt={image.publicId}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-primary/85 truncate" title={image.publicId}>
                      {image.publicId}
                    </p>
                    <p className="text-xs text-primary/65 mt-2">Click to view details</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="gold-glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 group"
                >
                  <div className="aspect-[4/3] bg-navy-light overflow-hidden relative">
                    <Image
                      src={product.images?.[0] || '/images/placeholder.png'}
                      alt={product.name}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    {product.inStock === false && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2 line-clamp-1">{product.name}</h2>
                    <p className="text-primary/70 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-lg">PKR {product.price.toLocaleString()}</span>
                      <span className="text-xs px-2 py-1 rounded-full border border-primary/40 text-primary/80">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="gold-glass rounded-2xl p-10 text-center max-w-xl mx-auto mt-10 w-full">
              <p className="text-primary/80 mb-6">
                Abhi is collection mein products available nahi hain ya aapki filters match nahi kar rahin.
              </p>
              <button
                onClick={() => {
                  setPriceRange(100000)
                  setInStockOnly(false)
                }}
                className="gold-btn px-6 py-3 rounded-lg font-semibold inline-block text-black"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

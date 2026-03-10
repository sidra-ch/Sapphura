'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  Eye,
  Package,
} from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice: number | null
  category: string
  images: string[]
  stock: number
  inStock: boolean
  rating: number
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      if (!data.success) {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }, [router])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      let fetchedProducts: Product[] = []
      let lastError = ''

      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const response = await fetch('/api/products', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          })

          const data = await response.json()

          if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to fetch products')
          }

          fetchedProducts = Array.isArray(data.products) ? data.products : []
          lastError = ''
          break
        } catch (requestError) {
          lastError = requestError instanceof Error ? requestError.message : 'Failed to fetch products'

          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, attempt * 600))
          }
        }
      }

      if (lastError) {
        setProducts([])
        setError('Failed to fetch products. Please try again.')
        return
      }

      setProducts(fetchedProducts)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Failed to fetch products. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
    fetchProducts()
  }, [checkAuth, fetchProducts])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
        alert('Product deleted successfully!')
      }
    } catch (error) {
      alert('Failed to delete product')
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-primary text-xl">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="bg-navy-light border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <Link
                href="/admin/dashboard"
                className="text-primary/70 hover:text-primary transition-colors"
              >
                <ArrowLeft size={22} />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary">Product Management</h1>
                <p className="text-sm sm:text-base text-primary/70">Manage your store products</p>
              </div>
            </div>
            <Link
              href="/admin/products/new"
              className="flex w-full items-center justify-center gap-2 gold-btn px-4 py-2 rounded-lg font-semibold text-black sm:w-auto"
            >
              <Plus size={20} />
              Add New Product
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
            {error}
          </div>
        ) : null}

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-navy-light border border-primary/20 rounded-lg text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 bg-navy-light border border-primary/20 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="gold-glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Package className="text-primary" size={24} />
              <div>
                <p className="text-primary/70 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-primary">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="gold-glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Package className="text-green-400" size={24} />
              <div>
                <p className="text-primary/70 text-sm">In Stock</p>
                <p className="text-2xl font-bold text-primary">
                  {products.filter((p) => p.inStock).length}
                </p>
              </div>
            </div>
          </div>
          <div className="gold-glass rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Package className="text-red-400" size={24} />
              <div>
                <p className="text-primary/70 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-primary">
                  {products.filter((p) => !p.inStock).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4 md:hidden">
          {filteredProducts.length === 0 ? (
            <div className="gold-glass rounded-xl px-6 py-12 text-center text-primary/70">
              No products found
            </div>
          ) : (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="gold-glass rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-navy-light">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-primary truncate">{product.name}</p>
                    <p className="text-xs text-primary/60 truncate">{product.slug}</p>
                    <p className="mt-1 text-sm text-primary/80">{product.category}</p>
                    <p className="text-sm font-semibold text-primary">PKR {product.price.toLocaleString()}</p>
                    <p className="text-xs text-primary/75">{product.stock} units</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      product.inStock
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/products/${product.slug}`}
                      className="p-2 text-primary/70 hover:text-primary hover:bg-navy-light rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="hidden md:block gold-glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-light border-b border-primary/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-primary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-primary/70">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-navy-light/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-navy-light">
                            {product.images[0] && (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-primary">{product.name}</div>
                            <div className="text-sm text-primary/60">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-primary/80">
                        {product.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-primary">
                            PKR {product.price.toLocaleString()}
                          </div>
                          {product.originalPrice && (
                            <div className="text-primary/50 line-through text-xs">
                              PKR {product.originalPrice.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-primary/80">
                        {product.stock} units
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            product.inStock
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${product.slug}`}
                            className="p-2 text-primary/70 hover:text-primary hover:bg-navy-light rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

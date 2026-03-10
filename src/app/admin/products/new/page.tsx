'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    images: '',
    sizes: 'Standard',
    features: '',
    stock: '0',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
          category: formData.category,
          images: formData.images.split(',').map((v) => v.trim()).filter(Boolean),
          sizes: formData.sizes.split(',').map((v) => v.trim()).filter(Boolean),
          features: formData.features.split(',').map((v) => v.trim()).filter(Boolean),
          stock: Number(formData.stock),
        }),
      })

      const data = await response.json()
      if (!data.success) {
        setError(data.error || 'Failed to create product')
        return
      }

      router.push('/admin/products')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy px-3 sm:px-4 py-8 sm:py-16 md:py-24">
      <div className="container mx-auto max-w-3xl">
        <div className="gold-glass rounded-2xl p-5 sm:p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Add New Product</h1>
            <Link href="/admin/products" className="text-primary/75 hover:text-primary transition-colors">
              Back
            </Link>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
              placeholder="Product name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <textarea
              className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary min-h-28"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
                placeholder="Price"
                type="number"
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <input
                className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
                placeholder="Original price (optional)"
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <input
                className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
                placeholder="Stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
            <input
              className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
              placeholder="Image URLs (comma separated)"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            />
            <input
              className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
              placeholder="Sizes (comma separated, e.g. S,M,L)"
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
            />
            <input
              className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
              placeholder="Features (comma separated)"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            />

            <button
              type="submit"
              disabled={loading}
              className="gold-btn w-full rounded-lg px-6 py-3 font-semibold text-black disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

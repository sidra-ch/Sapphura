'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number | null
  category: string
  images: string[]
  sizes: string[]
  features: string[]
  stock: number
  inStock: boolean
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    images: '',
    sizes: '',
    features: '',
    stock: '0',
    inStock: true,
  })

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        if (!data.success) {
          setError(data.error || 'Product not found')
          return
        }

        const product: Product = data.product
        setFormData({
          name: product.name,
          description: product.description,
          price: String(product.price),
          originalPrice: product.originalPrice ? String(product.originalPrice) : '',
          category: product.category,
          images: product.images.join(', '),
          sizes: product.sizes.join(', '),
          features: product.features.join(', '),
          stock: String(product.stock),
          inStock: product.inStock,
        })
      } catch {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      load()
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        category: formData.category,
        images: formData.images.split(',').map((v) => v.trim()).filter(Boolean),
        sizes: formData.sizes.split(',').map((v) => v.trim()).filter(Boolean),
        features: formData.features.split(',').map((v) => v.trim()).filter(Boolean),
        stock: Number(formData.stock),
        inStock: formData.inStock,
      }

      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!data.success) {
        setError(data.error || 'Failed to update product')
        return
      }

      router.push('/admin/products')
    } catch {
      setError('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-navy flex items-center justify-center text-primary">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-navy px-4 py-24">
      <div className="container mx-auto max-w-3xl">
        <div className="gold-glass rounded-2xl p-8 md:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Edit Product</h1>
            <Link href="/admin/products" className="text-primary/75 hover:text-primary transition-colors">
              Back
            </Link>
          </div>

          {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <textarea className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary min-h-28" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary" type="number" min="1" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              <input className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary" type="number" min="0" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
              <input className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary" type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
            </div>
            <input className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary" value={formData.images} onChange={(e) => setFormData({ ...formData, images: e.target.value })} />
            <input className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} />
            <input className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
            <label className="flex items-center gap-2 text-primary/85">
              <input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} />
              In stock
            </label>

            <button type="submit" disabled={saving} className="gold-btn w-full rounded-lg px-6 py-3 font-semibold text-black disabled:opacity-60">
              {saving ? 'Saving...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

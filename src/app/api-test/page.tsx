'use client'

import { useState } from 'react'

export default function APITestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async (endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
    setLoading(true)
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      
      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-navy">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">API Test Dashboard</h1>

        <div className="space-y-4 mb-8">
          {/* Products API */}
          <div className="gold-glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">Products API</h2>
            <div className="flex gap-4">
              <button
                onClick={() => testAPI('/api/products')}
                className="gold-btn px-6 py-2 rounded"
                disabled={loading}
              >
                GET All Products
              </button>
              <button
                onClick={() => testAPI('/api/products?limit=3')}
                className="gold-btn px-6 py-2 rounded"
                disabled={loading}
              >
                GET 3 Products
              </button>
              <button
                onClick={() => testAPI('/api/products/bridal-necklace-set')}
                className="gold-btn px-6 py-2 rounded"
                disabled={loading}
              >
                GET Single Product
              </button>
            </div>
          </div>

          {/* Categories API */}
          <div className="gold-glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">Categories API</h2>
            <button
              onClick={() => testAPI('/api/categories')}
              className="gold-btn px-6 py-2 rounded"
              disabled={loading}
            >
              GET All Categories
            </button>
          </div>

          {/* Orders API */}
          <div className="gold-glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">Orders API</h2>
            <button
              onClick={() =>
                testAPI('/api/orders', 'POST', {
                  customerName: 'Test User',
                  customerEmail: 'test@example.com',
                  customerPhone: '+92 300 1234567',
                  shippingAddress: {
                    address: '123 Test Street',
                    city: 'Karachi',
                    state: 'Sindh',
                    zipCode: '75500',
                  },
                  items: [
                    {
                      productId: 'bridal-necklace-set-001',
                      quantity: 1,
                      price: 12999,
                    },
                  ],
                  subtotal: 12999,
                  shippingCost: 0,
                  total: 12999,
                  paymentMethod: 'COD',
                  notes: 'Test order',
                })
              }
              className="gold-btn px-6 py-2 rounded"
              disabled={loading}
            >
              POST Create Test Order
            </button>
          </div>

          {/* Reviews API */}
          <div className="gold-glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-primary">Reviews API</h2>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  testAPI('/api/reviews', 'POST', {
                    productId: 'bridal-necklace-set-001',
                    customerName: 'Happy Customer',
                    customerEmail: 'happy@example.com',
                    rating: 5,
                    comment: 'Amazing quality!',
                  })
                }
                className="gold-btn px-6 py-2 rounded"
                disabled={loading}
              >
                POST Create Review
              </button>
              <button
                onClick={() => testAPI('/api/reviews?productId=bridal-necklace-set-001')}
                className="gold-btn px-6 py-2 rounded"
                disabled={loading}
              >
                GET Product Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="gold-glass p-6 rounded-lg">
            <p className="text-center text-primary">Loading...</p>
          </div>
        )}

        {result && !loading && (
          <div className="gold-glass p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-primary">Result:</h3>
            <pre className="bg-navy-dark p-4 rounded overflow-auto max-h-96 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

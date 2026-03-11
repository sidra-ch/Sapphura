'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'

type ShippingRule = {
  id: string
  region: string
  cost: number
  freeShippingThreshold: number | null
  isActive: boolean
}

export default function ShippingAdmin() {
  const [rules, setRules] = useState<ShippingRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/admin/shipping-rules')
      const data = await res.json()
      if (data.rules) setRules(data.rules)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipping rule?')) return
    try {
      await fetch(`/api/admin/shipping-rules/${id}`, { method: 'DELETE' })
      setRules(rules.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shipping Rules</h1>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
          <PlusCircle className="w-5 h-5" />
          Add Rule
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-6 border border-gray-100">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Region/Country</th>
                <th>Base Cost</th>
                <th>Free Shipping Threshold</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No shipping rules found.
                  </td>
                </tr>
              ) : (
                rules.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 font-medium">{r.region}</td>
                    <td>${r.cost.toFixed(2)}</td>
                    <td>{r.freeShippingThreshold ? `$${r.freeShippingThreshold.toFixed(2)}` : 'None'}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full ${r.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {r.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button className="p-2 text-gray-500 hover:text-black">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

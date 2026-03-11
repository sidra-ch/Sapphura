'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'

type Campaign = {
  id: string
  name: string
  description?: string
  discountPercentage: number
  active: boolean
  startDate: string
  endDate: string
}

export default function CampaignsAdmin() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/campaigns')
      const data = await res.json()
      if (data.campaigns) setCampaigns(data.campaigns)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return
    try {
      await fetch(`/api/admin/campaigns/${id}`, { method: 'DELETE' })
      setCampaigns(campaigns.filter((c) => c.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
          <PlusCircle className="w-5 h-5" />
          Create Campaign
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-6 border border-gray-100">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Name</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Valid Thru</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 font-medium">{c.name}</td>
                    <td>{c.discountPercentage}%</td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded-full ${c.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <button className="p-2 text-gray-500 hover:text-black">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:text-red-700">
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

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type Asset = {
  publicId: string
  secureUrl: string
  resourceType: 'image' | 'video'
}

type MediaResponse = {
  success: boolean
  media: {
    logo: { secureUrl: string } | null
    suits: Asset[]
    categories: {
      newCollection: Asset[]
      bangles: Asset[]
      anklets: Asset[]
      earrings: Asset[]
      makeup: Asset[]
    }
    videos: Asset[]
    allAssets: Asset[]
  }
}

export default function CloudinaryDebugPage() {
  const [data, setData] = useState<MediaResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cloudinary/media', { cache: 'no-store' })
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-white">Loading Cloudinary data...</div>

  if (!data?.success) return <div className="p-8 text-red-500">Failed to load Cloudinary data</div>

  const { media } = data

  return (
    <div className="min-h-screen bg-navy p-8 text-white">
      <h1 className="text-4xl font-bold mb-8 text-primary">🖼️ Cloudinary Debug Panel</h1>
      
      {/* Logo */}
      <section className="mb-8 p-6 bg-navy-light rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Logo ({media.logo ? '✅ Found' : '❌ Not Found'})</h2>
        {media.logo && (
          <div className="flex gap-4 items-start">
            <div className="w-32 h-32 relative bg-white rounded">
              <Image src={media.logo.secureUrl} alt="Logo" fill className="object-contain" unoptimized />
            </div>
            <pre className="text-xs bg-navy p-2 rounded flex-1 overflow-x-auto">
              {media.logo.secureUrl}
            </pre>
          </div>
        )}
      </section>

      {/* Suits */}
      <section className="mb-8 p-6 bg-navy-light rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Suits ({media.suits.length} images)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.suits.map((suit, idx) => (
            <div key={idx} className="space-y-2">
              <div className="aspect-square relative bg-white rounded overflow-hidden">
                <Image src={suit.secureUrl} alt={suit.publicId} fill className="object-cover" unoptimized />
              </div>
              <p className="text-xs truncate" title={suit.publicId}>{suit.publicId}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Collection */}
      <section className="mb-8 p-6 bg-navy-light rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">New Collection ({media.categories.newCollection.length} images)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.categories.newCollection.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="aspect-square relative bg-white rounded overflow-hidden">
                <Image src={item.secureUrl} alt={item.publicId} fill className="object-cover" unoptimized />
              </div>
              <p className="text-xs truncate" title={item.publicId}>{item.publicId}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bangles */}
      <section className="mb-8 p-6 bg-navy-light rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Bangles ({media.categories.bangles.length} images)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.categories.bangles.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="aspect-square relative bg-white rounded overflow-hidden">
                <Image src={item.secureUrl} alt={item.publicId} fill className="object-cover" unoptimized />
              </div>
              <p className="text-xs truncate" title={item.publicId}>{item.publicId}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Earrings */}
      <section className="mb-8 p-6 bg-navy-light rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Earrings ({media.categories.earrings.length} images)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.categories.earrings.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="aspect-square relative bg-white rounded overflow-hidden">
                <Image src={item.secureUrl} alt={item.publicId} fill className="object-cover" unoptimized />
              </div>
              <p className="text-xs truncate" title={item.publicId}>{item.publicId}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Makeup */}
      <section className="mb-8 p-6 bg-navy-light rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Makeup ({media.categories.makeup.length} images)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.categories.makeup.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="aspect-square relative bg-white rounded overflow-hidden">
                <Image src={item.secureUrl} alt={item.publicId} fill className="object-cover" unoptimized />
              </div>
              <p className="text-xs truncate" title={item.publicId}>{item.publicId}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All Assets Summary */}
      <section className="mb-8 p-6 bg-navy-light rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">All Assets ({media.allAssets.length} total)</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {media.allAssets.slice(0, 50).map((asset, idx) => (
            <div key={idx} className="text-sm bg-navy p-2 rounded flex justify-between">
              <span className="font-mono text-primary">{asset.publicId}</span>
              <span className="text-gray-400">{asset.resourceType}</span>
            </div>
          ))}
          {media.allAssets.length > 50 && (
            <p className="text-gray-400 text-sm">...and {media.allAssets.length - 50} more</p>
          )}
        </div>
      </section>

      {/* Videos */}
      <section className="mb-8 p-6 bg-navy-light rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Videos ({media.videos.length} videos)</h2>
        <div className="space-y-2">
          {media.videos.map((video, idx) => (
            <div key={idx} className="text-sm bg-navy p-2 rounded">
              <span className="font-mono text-primary">{video.publicId}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

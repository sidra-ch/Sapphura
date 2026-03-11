'use client'

import { useState } from 'react'
import Image from 'next/image'
import SimpleImage from '@/components/ui/SimpleImage'
import FallbackImage from '@/components/ui/FallbackImage'

export default function ImageTestPage() {
  const testImageUrl = 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004783/earing-3_kz0ik8.jpg'
  
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Image Loading Test Page</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Test URL:</h2>
        <code className="block p-2 bg-white rounded text-sm break-all">
          {testImageUrl}
        </code>
        <p className="mt-2">
          <a 
            href={testImageUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Open in new tab
          </a>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Test 1: Regular img tag */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Regular img tag</h3>
          <div className="w-full h-64 bg-gray-100 rounded">
            <img
              src={testImageUrl}
              alt="Test image"
              className="w-full h-full object-cover rounded"
              onError={(e) => console.error('Regular img failed')}
              onLoad={() => console.log('Regular img loaded')}
            />
          </div>
        </div>

        {/* Test 2: Next.js Image */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Next.js Image</h3>
          <div className="relative w-full h-64 bg-gray-100 rounded">
            <Image
              src={testImageUrl}
              alt="Next.js test"
              fill
              className="object-cover rounded"
              onError={(e) => console.error('Next.js Image failed')}
              onLoad={() => console.log('Next.js Image loaded')}
            />
          </div>
        </div>

        {/* Test 3: SimpleImage component */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">SimpleImage component</h3>
          <div className="w-full h-64 bg-gray-100 rounded">
            <SimpleImage
              src={testImageUrl}
              alt="SimpleImage test"
              width={256}
              height={256}
              className="w-full h-full rounded"
            />
          </div>
        </div>

        {/* Test 4: FallbackImage component */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">FallbackImage component</h3>
          <div className="relative w-full h-64 bg-gray-100 rounded">
            <FallbackImage
              src={testImageUrl}
              alt="FallbackImage test"
              fill
              className="object-cover rounded"
              onError={() => console.error('FallbackImage failed')}
              onLoad={() => console.log('FallbackImage loaded')}
            />
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-yellow-100 rounded">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Check browser console for load/error messages</li>
          <li>Try opening the image URL directly in browser</li>
          <li>Check Next.js configuration in next.config.js</li>
          <li>Verify Cloudinary domain is whitelisted</li>
        </ul>
      </div>
    </div>
  )
}

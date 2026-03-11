'use client'

import Image from 'next/image'
import SimpleImage from '@/components/ui/SimpleImage'

interface CloudinaryTestProps {
  imageUrl: string
  productName: string
}

export default function CloudinaryTest({ imageUrl, productName }: CloudinaryTestProps) {
  console.log('Testing Cloudinary URL:', imageUrl)
  
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Cloudinary Image Test for {productName}</h3>
      
      {/* Debug Info */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        <p><strong>URL:</strong> {imageUrl}</p>
        <p><strong>Domain:</strong> {imageUrl.split('/')[2]}</p>
        <p><strong>Includes Cloudinary:</strong> {imageUrl.includes('cloudinary.com') ? 'Yes' : 'No'}</p>
        <p><strong>Includes Your Domain:</strong> {imageUrl.includes('dwmxdyvd2') ? 'Yes' : 'No'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Test with Next.js Image */}
        <div>
          <h4 className="font-semibold mb-2">Next.js Image Component:</h4>
          <div className="relative w-64 h-64 border rounded">
            <Image
              src={imageUrl}
              alt={`Next.js test image for ${productName}`}
              fill
              className="object-cover"
              onError={(e) => {
                console.error('❌ Next.js Image failed to load:', imageUrl)
                const target = e.target as HTMLImageElement
                if (target.parentElement) {
                  target.parentElement.innerHTML = `
                    <div class="flex items-center justify-center w-full h-full bg-red-100 text-red-600">
                      <div class="text-center p-4">
                        <div class="text-lg font-bold">❌ Next.js Failed</div>
                        <div class="text-xs mt-2">${imageUrl.substring(0, 50)}...</div>
                      </div>
                    </div>
                  `
                }
              }}
              onLoad={() => {
                console.log('✅ Next.js Image loaded successfully:', imageUrl)
              }}
            />
          </div>
        </div>
        
        {/* Test with Simple img tag */}
        <div>
          <h4 className="font-semibold mb-2">Simple img Tag:</h4>
          <div className="border rounded">
            <SimpleImage
              src={imageUrl}
              alt={`Simple test image for ${productName}`}
              width={256}
              height={256}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Direct URL Test */}
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Direct URL Test:</h4>
        <a 
          href={imageUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Open image in new tab
        </a>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import ShopifyProductGallery from '@/components/product/ShopifyProductGallery'
import { ProductMedia } from '@/types/product'

// Demo product data with mixed media
const demoProductMedia: ProductMedia[] = [
  {
    type: 'image',
    url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004783/earing-3_kz0ik8.jpg',
    alt: 'Elegant Diamond Earrings - Front View'
  },
  {
    type: 'image',
    url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/earrings-side.jpg',
    alt: 'Elegant Diamond Earrings - Side View'
  },
  {
    type: 'image',
    url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/earrings-detail.jpg',
    alt: 'Elegant Diamond Earrings - Detail View'
  },
  {
    type: 'image',
    url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/earrings-model.jpg',
    alt: 'Elegant Diamond Earrings - Model View'
  },
  {
    type: 'video',
    url: 'https://res.cloudinary.com/dwmxdyvd2/video/upload/v1/products/earrings-demo.mp4',
    thumbnail: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/earrings-demo.jpg'
  }
]

// Demo with only images
const imagesOnlyDemo: ProductMedia[] = [
  {
    type: 'image',
    url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/necklace-1.jpg',
    alt: 'Diamond Necklace - Front View'
  },
  {
    type: 'image',
    url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/necklace-2.jpg',
    alt: 'Diamond Necklace - Side View'
  },
  {
    type: 'image',
    url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/necklace-3.jpg',
    alt: 'Diamond Necklace - Detail View'
  }
]

export default function ShopifyGalleryDemo() {
  const [thumbnailPosition, setThumbnailPosition] = useState<'bottom' | 'left' | 'right'>('bottom')
  const [enableZoom, setEnableZoom] = useState(true)
  const [enableVideoAutoplay, setEnableVideoAutoplay] = useState(false)

  return (
    <div className="min-h-screen bg-navy-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            Shopify-Style Product Gallery Demo
          </h1>
          <p className="text-lg opacity-80">
            Professional media gallery with images, videos, zoom, and mobile swipe support
          </p>
        </div>

        {/* Controls */}
        <div className="bg-navy-light rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Gallery Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail Position</label>
              <select 
                value={thumbnailPosition}
                onChange={(e) => setThumbnailPosition(e.target.value as any)}
                className="w-full p-2 rounded bg-navy border border-primary/30 text-white"
              >
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Features</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enableZoom}
                    onChange={(e) => setEnableZoom(e.target.checked)}
                    className="mr-2"
                  />
                  Enable Zoom
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enableVideoAutoplay}
                    onChange={(e) => setEnableVideoAutoplay(e.target.checked)}
                    className="mr-2"
                  />
                  Video Autoplay
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instructions</label>
              <ul className="text-sm space-y-1 opacity-80">
                <li>• Click thumbnails to switch media</li>
                <li>• Click image to zoom</li>
                <li>• Use arrow keys to navigate</li>
                <li>• Swipe on mobile devices</li>
                <li>• Click video to play/pause</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Demo Gallery */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Mixed Media Gallery</h2>
            <p className="opacity-80 mb-6">Images + Video with all features enabled</p>
            <ShopifyProductGallery
              media={demoProductMedia}
              productName="Elegant Diamond Earrings"
              enableZoom={enableZoom}
              enableVideoAutoplay={enableVideoAutoplay}
              thumbnailPosition={thumbnailPosition}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Images Only Gallery</h2>
            <p className="opacity-80 mb-6">Pure image gallery without video</p>
            <ShopifyProductGallery
              media={imagesOnlyDemo}
              productName="Diamond Necklace"
              enableZoom={enableZoom}
              enableVideoAutoplay={false}
              thumbnailPosition={thumbnailPosition}
            />
          </div>
        </div>

        {/* Features Showcase */}
        <div className="bg-navy-light rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Features Showcase</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🖼️</div>
              <h3 className="font-semibold mb-2">Smart Image Loading</h3>
              <p className="text-sm opacity-80">Cloudinary optimization with f_auto,q_auto</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="font-semibold mb-2">Video Support</h3>
              <p className="text-sm opacity-80">Native video player with controls</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold mb-2">Image Zoom</h3>
              <p className="text-sm opacity-80">Click to zoom with smooth transitions</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold mb-2">Mobile Swipe</h3>
              <p className="text-sm opacity-80">Touch gestures for mobile navigation</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Performance</h3>
              <p className="text-sm opacity-80">Lazy loading and caching</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold mb-2">Shopify Style</h3>
              <p className="text-sm opacity-80">Professional, clean design</p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 text-center opacity-60">
          <p className="text-sm">
            Built with Next.js, Framer Motion, and Cloudinary optimization
          </p>
          <p className="text-xs mt-2">
            Responsive design • Keyboard navigation • Accessibility features • Performance optimized
          </p>
        </div>
      </div>
    </div>
  )
}

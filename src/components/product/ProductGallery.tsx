'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Play, Pause, Volume2, VolumeX, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductMedia } from '@/types/product'
import { 
  isCloudinaryUrl, 
  getOptimizedCloudinaryUrl, 
  getVideoThumbnailUrl,
  getResponsiveImageSizes,
  getThumbnailImageSizes 
} from '@/lib/media-utils'
import FallbackImage from '@/components/ui/FallbackImage'

interface ProductGalleryProps {
  images: string[]
  video?: string
  productName: string
  className?: string
}

export default function ProductGallery({ 
  images, 
  video, 
  productName, 
  className = '' 
}: ProductGalleryProps) {
  // Convert to media array - use original URLs without optimization for now
  const mediaItems: ProductMedia[] = [
    ...images.map(url => ({ 
      type: 'image' as const, 
      url: url // Use original URL without any processing
    })),
    ...(video ? [{ 
      type: 'video' as const, 
      url: video,
      thumbnail: getVideoThumbnailUrl(video)
    }] : [])
  ]

  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mainViewerRef = useRef<HTMLDivElement>(null)

  const selectedMedia = mediaItems[selectedMediaIndex]
  const isVideo = selectedMedia?.type === 'video'

  // Auto-pause video when switching away from it
  useEffect(() => {
    if (!isVideo && videoRef.current) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }, [isVideo])

  const handleMediaSelect = (index: number) => {
    setSelectedMediaIndex(index)
    if (videoRef.current) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }

  const handleVideoPlayPause = () => {
    if (!videoRef.current) return
    
    if (isVideoPlaying) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    } else {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }

  const handleMuteToggle = () => {
    if (!videoRef.current) return
    
    if (isMuted) {
      videoRef.current.muted = false
      setIsMuted(false)
    } else {
      videoRef.current.muted = true
      setIsMuted(true)
    }
  }

  const handleFullscreen = () => {
    if (!mainViewerRef.current) return

    if (!isFullscreen) {
      if (mainViewerRef.current.requestFullscreen) {
        mainViewerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const nextMedia = () => {
    const nextIndex = (selectedMediaIndex + 1) % mediaItems.length
    handleMediaSelect(nextIndex)
  }

  const prevMedia = () => {
    const prevIndex = (selectedMediaIndex - 1 + mediaItems.length) % mediaItems.length
    handleMediaSelect(prevIndex)
  }

  const generateVideoThumbnail = (videoUrl: string) => {
    // For Cloudinary videos, we can generate a thumbnail
    if (videoUrl.includes('cloudinary')) {
      // Convert video URL to thumbnail URL
      return videoUrl.replace(/\.\w+$/, '.jpg')
    }
    return ''
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Media Viewer */}
      <div 
        ref={mainViewerRef}
        className="relative aspect-square gold-glass rounded-2xl overflow-hidden group"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMediaIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-full relative"
          >
            {isVideo ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={selectedMedia.url}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  playsInline
                  onClick={handleVideoPlayPause}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Play/Pause Button */}
                  <button
                    onClick={handleVideoPlayPause}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-navy rounded-full p-4 transition-all hover:scale-110"
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </button>

                  {/* Top Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={handleMuteToggle}
                      className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={handleFullscreen}
                      className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Video Indicator */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Video
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white text-xs p-2 rounded z-50">
                    URL: {selectedMedia.url.substring(0, 50)}...
                  </div>
                )}
                
                <FallbackImage
                  src={selectedMedia.url}
                  alt={`${productName} - Image ${selectedMediaIndex + 1}`}
                  fill
                  className="object-cover"
                  priority={selectedMediaIndex === 0}
                  sizes={getResponsiveImageSizes()}
                  onError={() => {
                    console.error('Image failed to load:', selectedMedia.url)
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', selectedMedia.url)
                  }}
                />
                
                {/* Image Indicator */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Image {selectedMediaIndex + 1}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-navy/80 hover:bg-navy text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-navy/80 hover:bg-navy text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              aria-label="Next media"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {mediaItems.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {mediaItems.map((media, index) => (
            <button
              key={index}
              onClick={() => handleMediaSelect(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                selectedMediaIndex === index 
                  ? 'border-primary shadow-lg shadow-primary/30' 
                  : 'border-primary/30 opacity-70 hover:opacity-100'
              }`}
            >
              {media.type === 'video' ? (
                <div className="relative w-full h-full">
                  {/* Video Thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary/60" />
                  </div>
                  
                  {/* Video Label */}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
                    Video
                  </div>
                  
                  {/* Active Indicator */}
                  {selectedMediaIndex === index && isVideoPlaying && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Playing
                    </div>
                  )}
                </div>
              ) : (
                <Image
                  src={media.url}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes={getThumbnailImageSizes()}
                />
              )}
              
              {/* Selection Indicator */}
              {selectedMediaIndex === index && (
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn,
  X,
  Loader2
} from 'lucide-react'
import { ProductMedia } from '@/types/product'
import { 
  isCloudinaryUrl, 
  getOptimizedCloudinaryUrl, 
  getVideoThumbnailUrl,
  getResponsiveImageSizes,
  getThumbnailImageSizes 
} from '@/lib/media-utils'

interface ShopifyProductGalleryProps {
  media?: ProductMedia[]
  productName: string
  className?: string
  enableZoom?: boolean
  enableVideoAutoplay?: boolean
  thumbnailPosition?: 'bottom' | 'left' | 'right'
  // New prop for direct media URLs
  mediaUrls?: string[]
}

export default function ShopifyProductGallery({ 
  media = [], 
  productName, 
  className = '',
  enableZoom = true,
  enableVideoAutoplay = false,
  thumbnailPosition = 'bottom',
  mediaUrls = [] // New prop for direct media URLs
}: ShopifyProductGalleryProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mainViewerRef = useRef<HTMLDivElement>(null)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  // Process media URLs - handle both old media prop and new mediaUrls prop
  const processedMedia = media.length > 0 ? media : (
    mediaUrls
      .filter(url => url && url.trim() !== '')
      .map((url, index) => {
        const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i)
        return {
          type: isVideo ? 'video' : 'image',
          url,
          thumbnail: isVideo ? undefined : url,
          alt: `${productName} - ${index + 1}`
        }
      })
  )

  // Debug: Log processed media
  console.log('Processed Media:', processedMedia)
  console.log('Media URLs:', mediaUrls)
  console.log('Media Prop:', media)

  const selectedMedia = processedMedia[selectedMediaIndex]
  const isVideo = selectedMedia?.type === 'video'

  // Fallback placeholder image - use Cloudinary placeholder
  const placeholderImage = 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004783/earing-3_kz0ik8.jpg'

  // Auto-pause video when switching away from it
  useEffect(() => {
    if (!isVideo && videoRef.current) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    }
    setIsLoading(true)
    setImageError(false)
  }, [isVideo, selectedMediaIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed || isFullscreen) return
      
      if (e.key === 'ArrowLeft') {
        handlePreviousMedia()
      } else if (e.key === 'ArrowRight') {
        handleNextMedia()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed, isFullscreen, processedMedia.length])

  const handleMediaSelect = useCallback((index: number) => {
    if (index >= 0 && index < processedMedia.length) {
      setSelectedMediaIndex(index)
    }
  }, [processedMedia.length])

  const handleVideoPlayPause = useCallback(() => {
    if (!videoRef.current) return
    
    if (isVideoPlaying) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    } else {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }, [isVideoPlaying])

  const handleMuteToggle = useCallback(() => {
    if (!videoRef.current) return
    
    if (isMuted) {
      videoRef.current.muted = false
      setIsMuted(false)
    } else {
      videoRef.current.muted = true
      setIsMuted(true)
    }
  }, [isMuted])

  const handleFullscreen = useCallback(() => {
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
  }, [isFullscreen])

  const handleZoom = useCallback(() => {
    if (!enableZoom) return
    setIsZoomed(!isZoomed)
  }, [enableZoom, isZoomed])

  const handleNextMedia = useCallback(() => {
    const nextIndex = (selectedMediaIndex + 1) % processedMedia.length
    handleMediaSelect(nextIndex)
  }, [selectedMediaIndex, processedMedia.length, handleMediaSelect])

  const handlePreviousMedia = useCallback(() => {
    const prevIndex = (selectedMediaIndex - 1 + processedMedia.length) % processedMedia.length
    handleMediaSelect(prevIndex)
  }, [selectedMediaIndex, processedMedia.length, handleMediaSelect])

  const getOptimizedUrl = useCallback((url: string, isMainImage: boolean = false) => {
    if (isCloudinaryUrl(url)) {
      return getOptimizedCloudinaryUrl(url, {
        width: isMainImage ? 1200 : 300,
        height: isMainImage ? 1200 : 300,
        quality: isMainImage ? 90 : 80,
        crop: 'fill',
        format: 'auto'
      })
    }
    return url
  }, [])

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
    setImageError(false)
  }, [])

  const handleImageError = useCallback(() => {
    setIsLoading(false)
    setImageError(true)
    console.error('Image failed to load:', selectedMedia?.url)
  }, [selectedMedia?.url])

  // Touch/Swipe support for mobile
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNextMedia()
    } else if (isRightSwipe) {
      handlePreviousMedia()
    }
  }, [touchStart, touchEnd, handleNextMedia, handlePreviousMedia])

  if (processedMedia.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-navy-light text-primary ${className}`}>
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-4">
            <Image
              src={placeholderImage}
              alt="No media available"
              fill
              className="object-contain"
              sizes="96px"
            />
          </div>
          <div className="text-4xl mb-2">📷</div>
          <p className="text-lg font-semibold mb-2">No Media Available</p>
          <p className="text-sm opacity-70">This product has no images or videos available.</p>
        </div>
      </div>
    )
  }

  const ThumbnailGallery = () => (
    <div 
      ref={thumbnailContainerRef}
      className={`
        flex gap-2 overflow-x-auto scrollbar-hide
        ${thumbnailPosition === 'bottom' ? 'flex-row mt-4' : 'flex-col'}
        ${thumbnailPosition === 'left' ? 'mr-4' : 'ml-4'}
      `}
    >
      {processedMedia.map((mediaItem, index) => (
        <button
          key={index}
          onClick={() => handleMediaSelect(index)}
          className={`
            relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200
            hover:scale-105 hover:border-primary/80
            ${selectedMediaIndex === index 
              ? 'border-primary shadow-lg shadow-primary/30 scale-105' 
              : 'border-primary/30 opacity-70 hover:opacity-100'
            }
            ${thumbnailPosition === 'left' || thumbnailPosition === 'right' ? 'w-20 h-20' : 'w-24 h-24'}
          `}
        >
          {mediaItem.type === 'video' ? (
            <div className="relative w-full h-full">
              {/* Video Thumbnail */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                <Play className="w-6 h-6 text-primary/60" />
              </div>
              
              {/* Video Label */}
              <div className="absolute bottom-1 left-1 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
                Video
              </div>
              
              {/* Active Indicator */}
              {selectedMediaIndex === index && isVideoPlaying && (
                <div className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Playing
                </div>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={mediaItem.url}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
                loading="lazy"
                unoptimized
              />
              
              {/* Selection Indicator */}
              {selectedMediaIndex === index && (
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
              )}
            </div>
          )}
        </button>
      ))}
    </div>
  )

  return (
    <div className={`relative ${className}`}>
      {/* Main Media Viewer */}
      <div 
        ref={mainViewerRef}
        className={`
          relative aspect-square bg-gradient-to-br from-navy-light to-navy rounded-2xl overflow-hidden
          ${isZoomed ? 'fixed inset-0 z-50 bg-black/95' : ''}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
                  autoPlay={enableVideoAutoplay}
                  loop
                  onClick={handleVideoPlayPause}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  onLoadedData={() => setIsLoading(false)}
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  {/* Play/Pause Button */}
                  <button
                    onClick={handleVideoPlayPause}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-navy rounded-full p-6 transition-all hover:scale-110"
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-12 h-12" />
                    ) : (
                      <Play className="w-12 h-12 ml-1" />
                    )}
                  </button>

                  {/* Top Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={handleMuteToggle}
                      className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={handleFullscreen}
                      className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Video Indicator */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Video
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Loading State */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-light">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}

                {/* Error State */}
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-light text-primary">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p className="text-sm">Image not available</p>
                    </div>
                  </div>
                )}

                {/* Main Image */}
                <Image
                  src={selectedMedia.url}
                  alt={`${productName} - Image ${selectedMediaIndex + 1}`}
                  fill
                  className={`
                    object-cover cursor-zoom-in transition-transform duration-300
                    ${isZoomed ? 'cursor-zoom-out' : 'hover:scale-105'}
                  `}
                  priority={selectedMediaIndex === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onClick={handleZoom}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  unoptimized
                />

                {/* Zoom Controls */}
                {enableZoom && !imageError && !isLoading && (
                  <button
                    onClick={handleZoom}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all"
                  >
                    {isZoomed ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <ZoomIn className="w-5 h-5" />
                    )}
                  </button>
                )}

                {/* Image Counter */}
                {processedMedia.length > 1 && (
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-full text-sm font-medium">
                    {selectedMediaIndex + 1} / {processedMedia.length}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {processedMedia.length > 1 && !isZoomed && (
          <>
            <button
              onClick={handlePreviousMedia}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-navy/80 hover:bg-navy text-white p-3 rounded-full opacity-0 hover:opacity-100 transition-all hover:scale-110"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextMedia}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-navy/80 hover:bg-navy text-white p-3 rounded-full opacity-0 hover:opacity-100 transition-all hover:scale-110"
              aria-label="Next media"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {processedMedia.length > 1 && (
        thumbnailPosition === 'bottom' ? (
          <ThumbnailGallery />
        ) : (
          <div className="flex">
            {thumbnailPosition === 'left' && <ThumbnailGallery />}
            <div className="flex-1" />
            {thumbnailPosition === 'right' && <ThumbnailGallery />}
          </div>
        )
      )}
    </div>
  )
}

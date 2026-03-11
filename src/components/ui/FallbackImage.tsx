'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'

interface FallbackImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  width?: number
  height?: number
  onError?: () => void
  onLoad?: () => void
}

export default function FallbackImage({ 
  src, 
  alt, 
  fill = false, 
  className = '', 
  sizes = '', 
  priority = false,
  width,
  height,
  onError,
  onLoad
}: FallbackImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [useSimpleImg, setUseSimpleImg] = useState(false)

  const handleError = () => {
    console.error('Next.js Image failed to load:', src)
    
    // Try simple img tag as fallback
    if (!useSimpleImg) {
      setUseSimpleImg(true)
      return
    }
    
    setImageError(true)
    setIsLoading(false)
    onError?.()
  }

  const handleSimpleImgError = () => {
    console.error('Simple img also failed to load:', src)
    setImageError(true)
    setIsLoading(false)
    onError?.()
  }

  const handleLoad = () => {
    console.log('Image loaded successfully:', src)
    setImageError(false)
    setIsLoading(false)
    onLoad?.()
  }

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-navy-light text-primary ${className}`}>
        <div className="text-center p-4">
          <ImageOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div className="text-xs opacity-60">Image unavailable</div>
        </div>
      </div>
    )
  }

  if (isLoading && !fill) {
    return (
      <div className={`bg-navy-light animate-pulse ${className}`} />
    )
  }

  // Use simple img tag if Next.js Image failed
  if (useSimpleImg) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        onError={handleSimpleImgError}
        onLoad={handleLoad}
        style={{ 
          objectFit: 'cover',
          ...(fill && { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' })
        }}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      width={width}
      height={height}
      onError={handleError}
      onLoad={handleLoad}
    />
  )
}

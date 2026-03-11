'use client'

import { useState } from 'react'

interface SimpleImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function SimpleImage({ 
  src, 
  alt, 
  className = '', 
  width = 400, 
  height = 400 
}: SimpleImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleError = () => {
    console.error('❌ SimpleImage failed to load:', src)
    setError(true)
    setLoading(false)
  }

  const handleLoad = () => {
    console.log('✅ SimpleImage loaded successfully:', src)
    setError(false)
    setLoading(false)
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-100 text-red-600 ${className}`} style={{ width, height }}>
        <div className="text-center p-4">
          <div className="text-lg font-bold">❌ Failed</div>
          <div className="text-xs mt-2">{src.substring(0, 50)}...</div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`} style={{ width, height }} />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      onLoad={handleLoad}
      style={{ objectFit: 'cover' }}
    />
  )
}

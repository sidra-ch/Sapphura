/**
 * Performance optimization utilities for Shopify product gallery
 */

import { ProductMedia } from '@/types/product'

/**
 * Preload critical images for better performance
 */
export function preloadCriticalImages(media: ProductMedia[], maxPreload: number = 3) {
  const imageMedia = media.filter(item => item.type === 'image').slice(0, maxPreload)
  
  imageMedia.forEach((mediaItem, index) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = getOptimizedUrl(mediaItem.url, index === 0)
    document.head.appendChild(link)
  })
}

/**
 * Lazy load non-critical images
 */
export function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        }
      })
    })

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img)
    })
  }
}

/**
 * Get optimized Cloudinary URL with performance settings
 */
export function getOptimizedUrl(url: string, isMainImage: boolean = false): string {
  if (!url.includes('cloudinary')) {
    return url
  }

  const params = new URLSearchParams()
  
  if (isMainImage) {
    params.set('w', '1200')
    params.set('h', '1200')
    params.set('q', '90')
    params.set('crop', 'fill')
    params.set('f', 'auto')
  } else {
    params.set('w', '300')
    params.set('h', '300')
    params.set('q', '80')
    params.set('crop', 'fill')
    params.set('f', 'auto')
  }

  const [baseUrl, ...pathParts] = url.split('/upload/')
  if (pathParts.length > 0) {
    return `${baseUrl}/upload/${params.toString()}/${pathParts.join('/upload/')}`
  }

  return url
}

/**
 * Cache media URLs to avoid repeated processing
 */
const mediaUrlCache = new Map<string, string>()

export function getCachedOptimizedUrl(url: string, isMainImage: boolean = false): string {
  const cacheKey = `${url}-${isMainImage}`
  
  if (mediaUrlCache.has(cacheKey)) {
    return mediaUrlCache.get(cacheKey)!
  }

  const optimizedUrl = getOptimizedUrl(url, isMainImage)
  mediaUrlCache.set(cacheKey, optimizedUrl)
  
  return optimizedUrl
}

/**
 * Progressive image loading with blur effect
 */
export function setupProgressiveImageLoading() {
  const images = document.querySelectorAll('.progressive-image')
  
  images.forEach(img => {
    const smallUrl = img.getAttribute('data-small') || ''
    const largeUrl = img.getAttribute('data-large') || ''
    
    // Load small image first
    const smallImg = new Image()
    smallImg.src = smallUrl
    smallImg.onload = () => {
      img.classList.add('loaded')
    }
    
    // Load large image after small image
    const largeImg = new Image()
    largeImg.src = largeUrl
    largeImg.onload = () => {
      img.classList.add('fully-loaded')
    }
  })
}

/**
 * Optimize video loading
 */
export function optimizeVideoLoading(videoElement: HTMLVideoElement, posterUrl: string) {
  // Set poster image
  videoElement.poster = posterUrl
  
  // Preload video metadata
  videoElement.preload = 'metadata'
  
  // Load video on hover or click
  const loadVideo = () => {
    videoElement.preload = 'auto'
    videoElement.load()
  }
  
  videoElement.addEventListener('mouseenter', loadVideo, { once: true })
  videoElement.addEventListener('click', loadVideo, { once: true })
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Memory cleanup for large media galleries
 */
export function cleanupMediaCache() {
  // Clear URL cache if it gets too large
  if (mediaUrlCache.size > 100) {
    mediaUrlCache.clear()
  }
  
  // Clean up unused image observers
  const images = document.querySelectorAll('img[data-observed="true"]')
  images.forEach(img => {
    if (!img.isConnected) {
      img.removeAttribute('data-observed')
    }
  })
}

/**
 * Setup performance monitoring
 */
export function setupPerformanceMonitoring() {
  if (process.env.NODE_ENV === 'development') {
    // Monitor image loading performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.name.includes('cloudinary') || entry.name.includes('.jpg') || entry.name.includes('.png')) {
          console.log(`🖼️ Image loaded in ${entry.duration}ms: ${entry.name}`)
        }
      })
    })
    
    observer.observe({ entryTypes: ['resource'] })
  }
}

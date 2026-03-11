/**
 * Media utility functions for product gallery
 * Handles Cloudinary URL optimization and video thumbnail generation
 */

export interface MediaUrl {
  url: string
  type: 'image' | 'video'
  thumbnail?: string
}

/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || 
         url.includes('res.cloudinary.com') ||
         url.includes('dwmxdyvd2.cloudinary.com')
}

/**
 * Get optimized Cloudinary image URL
 */
export function getOptimizedCloudinaryUrl(
  url: string, 
  options: {
    width?: number
    height?: number
    quality?: number
    crop?: string
    format?: string
  } = {}
): string {
  if (!isCloudinaryUrl(url)) {
    return url // Return as-is for non-Cloudinary URLs
  }

  const {
    width,
    height,
    quality = 80,
    crop = 'fill',
    format = 'auto'
  } = options

  // Build transformation parameters
  const transformations = []
  
  if (width || height) {
    transformations.push(`${crop}_${width || 'auto'}_${height || 'auto'}`)
  }
  
  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)

  // Insert transformations into Cloudinary URL
  const urlParts = url.split('/')
  const uploadIndex = urlParts.indexOf('upload')
  
  if (uploadIndex !== -1) {
    urlParts.splice(uploadIndex + 1, 0, transformations.join(','))
    return urlParts.join('/')
  }

  return url
}

/**
 * Generate video thumbnail URL from Cloudinary video URL
 */
export function getVideoThumbnailUrl(videoUrl: string): string {
  if (!isCloudinaryUrl(videoUrl)) {
    return '' // Can't generate thumbnail for non-Cloudinary videos
  }

  // Replace video extension with image extension
  const lastDotIndex = videoUrl.lastIndexOf('.')
  if (lastDotIndex !== -1) {
    return videoUrl.substring(0, lastDotIndex) + '.jpg'
  }

  return videoUrl + '.jpg'
}

/**
 * Process media array for product gallery
 */
export function processProductMedia(
  images: string[], 
  video?: string
): MediaUrl[] {
  const media: MediaUrl[] = []

  // Process images
  images.forEach(imageUrl => {
    media.push({
      url: getOptimizedCloudinaryUrl(imageUrl, {
        width: 800,
        height: 800,
        quality: 85,
        crop: 'fill'
      }),
      type: 'image'
    })
  })

  // Process video
  if (video) {
    media.push({
      url: video,
      type: 'video',
      thumbnail: getVideoThumbnailUrl(video)
    })
  }

  return media
}

/**
 * Generate responsive image sizes for Next.js Image component
 */
export function getResponsiveImageSizes(): string {
  return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 40vw, 33vw"
}

/**
 * Generate thumbnail image sizes for Next.js Image component
 */
export function getThumbnailImageSizes(): string {
  return "(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 15vw"
}

/**
 * Validate media URL format
 */
export function isValidMediaUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get media type from URL
 */
export function getMediaTypeFromUrl(url: string): 'image' | 'video' | 'unknown' {
  const extension = url.split('.').pop()?.toLowerCase()
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif']
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi']
  
  if (extension && imageExtensions.includes(extension)) {
    return 'image'
  }
  
  if (extension && videoExtensions.includes(extension)) {
    return 'video'
  }
  
  // Check URL path for video indicators
  if (url.includes('/video/') || url.includes('video')) {
    return 'video'
  }
  
  return 'unknown'
}

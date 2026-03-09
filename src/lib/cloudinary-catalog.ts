import type { CloudinaryAsset } from '@/types/cloudinaryMedia'

export type CatalogProduct = {
  id: string
  slug: string
  publicId: string
  name: string
  description: string
  price: number
  originalPrice: number
  category: string
  images: string[]
  sizes: string[]
  colors: Array<{ name: string; hex: string }>
  stock: number
  inStock: boolean
  rating: number
  reviewCount: number
  features: string[]
}

export const formatCloudinaryName = (publicId: string) =>
  publicId
    .replace(/_[a-z0-9]{6}$/i, '')
    .replace(/[-_\/]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

export const inferCategory = (publicId: string) => {
  const value = publicId.toLowerCase()
  if (value.includes('bangal') || value.includes('bangle')) return 'Bangles'
  if (value.includes('earing') || value.includes('earring')) return 'Earrings'
  if (value.includes('neckles') || value.includes('necklace')) return 'Necklace'
  if (value.includes('bracelet')) return 'Bracelet'
  if (value.includes('winter')) return 'Winter Collection'
  if (value.includes('summer')) return 'Summer Collection'
  if (value.includes('newcollection') || value.includes('new-collection')) return 'New Collection'
  if (value.includes('suit') || value.includes('cloth') || value.includes('clothes')) return 'Suits'
  if (value.includes('accessories')) return 'Accessories'
  if (value.includes('make-up') || value.includes('makeup')) return 'Makeup'
  return 'Collection'
}

export const categoryPrice = (category: string) => {
  switch (category) {
    case 'Bangles':
      return 2499
    case 'Earrings':
      return 1799
    case 'Necklace':
      return 4599
    case 'Bracelet':
      return 1999
    case 'Winter Collection':
      return 4399
    case 'Summer Collection':
      return 3499
    case 'New Collection':
      return 3799
    case 'Suits':
      return 3999
    default:
      return 2999
  }
}

export const toCatalogProduct = (asset: CloudinaryAsset): CatalogProduct => {
  const category = inferCategory(asset.publicId)
  const price = categoryPrice(category)
  return {
    id: `cloud-${asset.publicId}`,
    slug: encodeURIComponent(asset.publicId),
    publicId: asset.publicId,
    name: formatCloudinaryName(asset.publicId),
    description: `Cloudinary collection product: ${formatCloudinaryName(asset.publicId)}.`,
    price,
    originalPrice: price + 800,
    category,
    images: [asset.secureUrl],
    sizes: category === 'Bangles' ? ['2.4', '2.6', '2.8'] : ['Standard'],
    colors: [{ name: 'Default', hex: '#D4AF37' }],
    stock: 20,
    inStock: true,
    rating: 4.7,
    reviewCount: 0,
    features: ['Cloudinary Synced', 'Premium Quality'],
  }
}

export const toCatalogProducts = (assets: CloudinaryAsset[]) => assets.map(toCatalogProduct)

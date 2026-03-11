import Link from 'next/link'
import Image from 'next/image'
import { getDynamicMediaLibrary } from '@/lib/cloudinary'
import prisma from '@/lib/prisma'
import { toCatalogProducts } from '@/lib/cloudinary-catalog'
import CollectionClient from '@/components/product/CollectionClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type CollectionPageProps = {
  params: {
    slug: string
  }
}

const slugToTitle = (slug: string) =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export default async function CollectionDetailsPage({ params }: CollectionPageProps) {
  const { slug } = params
  const pageTitle = slugToTitle(slug)
  const normalizedSlug = slug.toLowerCase()
  const isAllProductsView = normalizedSlug === 'all-products' || normalizedSlug === 'all'
  
  let cloudinaryImages: Array<{ publicId: string; secureUrl: string }> = []
  let cloudinaryProducts: any[] = []

  try {
    const media = await getDynamicMediaLibrary()
    const imageAssets = media.allAssets.filter((asset) => asset.resourceType === 'image')
    cloudinaryImages = imageAssets.map((asset) => ({ publicId: asset.publicId, secureUrl: asset.secureUrl }))
    cloudinaryProducts = toCatalogProducts(imageAssets)
  } catch {
    cloudinaryImages = []
    cloudinaryProducts = []
  }

  // Fetch products from database first, fallback only to Cloudinary catalog (no hardcoded local products)
  let allProducts: any[] = []
  try {
    allProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        category: true,
        images: true,
        rating: true,
        inStock: true,
        createdAt: true,
      }
    })
  } catch {
    allProducts = []
  }

  if (allProducts.length === 0) {
    allProducts = cloudinaryProducts
  }

  const filterBySlug = (value: string) => {
    const normalized = value.toLowerCase()

    if (normalized === 'all') return allProducts

    if (normalized === 'best-selling-products') {
      return [...allProducts]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6)
    }

    if (normalized === 'new-arrivals') {
      return allProducts.slice(0, 6)
    }

    const categoryKeywords: Record<string, string[]> = {
      'bridal-jewellery-sets': ['bridal'],
      'bangles-for-women': ['bangle', 'bracelet', 'bangal'],
      earrings: ['earring', 'jhumka', 'earing'],
      'necklace-sets': ['necklace', 'neckles'],
      'finger-rings': ['ring'],
      anklets: ['anklet', 'payal'],
      bracelet: ['bracelet'],
      accessories: ['accessories', 'bracelet', 'earring', 'ring', 'necklace', 'bridal'],
      bags: ['bag'],
    }

    const keywords = categoryKeywords[normalized] ?? [normalized.replace(/-/g, ' ')]
    
    return allProducts.filter((product) => {
      const haystack = `${product.category} ${product.name} ${product.description}`.toLowerCase()
      return keywords.some((keyword) => haystack.includes(keyword))
    })
  }

  const collectionProducts = filterBySlug(slug)

  return (
    <div className="pt-32 pb-20 min-h-screen bg-navy">
      <CollectionClient
        products={collectionProducts}
        cloudinaryImages={cloudinaryImages}
        isAllProductsView={isAllProductsView}
        pageTitle={pageTitle}
      />
    </div>
  )
}

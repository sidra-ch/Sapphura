import Link from 'next/link'
import Image from 'next/image'
import { getDynamicMediaLibrary } from '@/lib/cloudinary'
import prisma from '@/lib/prisma'
import { toCatalogProducts } from '@/lib/cloudinary-catalog'

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
      orderBy: { createdAt: 'desc' }
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
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{pageTitle}</h1>
          <p className="text-primary/80 text-lg">
            {isAllProductsView && cloudinaryImages.length > 0
              ? `Showing ${cloudinaryImages.length} Cloudinary images`
              : collectionProducts.length > 0
                ? `Showing ${collectionProducts.length} products`
                : 'No products available in this collection right now'}
          </p>
        </div>

        {isAllProductsView && cloudinaryImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cloudinaryImages.map((image) => (
              <Link
                key={image.publicId}
                href={`/products/${encodeURIComponent(image.publicId)}`}
                className="gold-glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="aspect-[4/3] bg-navy-light overflow-hidden relative">
                  <Image
                    src={image.secureUrl}
                    alt={image.publicId}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-primary/85 truncate" title={image.publicId}>
                    {image.publicId}
                  </p>
                  <p className="text-xs text-primary/65 mt-2">Click to view details</p>
                </div>
              </Link>
            ))}
          </div>
        ) : collectionProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="gold-glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="aspect-[4/3] bg-navy-light overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-primary/70 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">PKR {product.price.toLocaleString()}</span>
                    <span className="text-xs px-2 py-1 rounded-full border border-primary/40 text-primary/80">
                      {product.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="gold-glass rounded-2xl p-10 text-center max-w-xl mx-auto">
            <p className="text-primary/80 mb-6">
              Abhi is collection mein products available nahi hain. Aap dusri collections explore kar sakte hain.
            </p>
            <Link href="/collections" className="gold-btn px-6 py-3 rounded-lg font-semibold inline-block text-black">
              Back to All Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

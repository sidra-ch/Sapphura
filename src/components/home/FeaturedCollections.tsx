'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { CloudinaryAsset } from '@/types/cloudinaryMedia'

type MediaState = {
  allAssets: CloudinaryAsset[]
}

const normalize = (value: string) => value.toLowerCase().replace(/[\s_\-/]+/g, '')

const pickByKeywords = (assets: CloudinaryAsset[], keywords: string[]) => {
  const normalizedKeywords = keywords.map(normalize)
  return assets.find((asset) => {
    const id = normalize(asset.publicId)
    return normalizedKeywords.some((keyword) => id.includes(keyword))
  })
}

const FeaturedCollections = () => {
  const [media, setMedia] = useState<MediaState | null>(null)

  useEffect(() => {
    const loadCategoryMedia = async () => {
      try {
        const response = await fetch('/api/cloudinary/media', { cache: 'no-store' })
        const json = await response.json()
        if (json.success && json.media?.allAssets) {
          setMedia({ allAssets: json.media.allAssets })
        }
      } catch {
        // Fallback gradient cards stay visible if API fails.
      }
    }

    loadCategoryMedia()
  }, [])

  const categoryImageMap = useMemo(() => {
    const assets = (media?.allAssets ?? []).filter((asset) => asset.resourceType === 'image')
    const fallbackImages = assets.map((asset) => asset.secureUrl)

    const imageMap = {
      'Summer Collection': pickByKeywords(assets, ['summercollection', 'summer'])?.secureUrl,
      'Winter Collection': pickByKeywords(assets, ['wintercollection', 'winter'])?.secureUrl,
      Earrings: pickByKeywords(assets, ['earings', 'earing', 'earring', 'earrings', 'jhumka'])?.secureUrl,
      Bangles: pickByKeywords(assets, ['bandlas', 'bandla', 'bangles', 'bangle', 'bangals', 'bangal'])?.secureUrl,
      Makeup: pickByKeywords(assets, ['makeup', 'cosmetic', 'lipstick', 'beauty'])?.secureUrl,
      'New Collection': pickByKeywords(assets, ['newcollection', 'new'])?.secureUrl,
      __fallback: fallbackImages,
    }

    // Debug logging
    console.log('🖼️ Cloudinary Featured Collections Images:', imageMap)
    console.log('📦 Total assets available:', assets.length)

    return imageMap
  }, [media])

  const collections = [
    {
      name: 'Summer Collection',
      href: '/collections/all-products',
      description: 'Bright, festive, and breezy summer picks',
      color: 'from-orange-400 to-yellow-500'
    },
    {
      name: 'Winter Collection',
      href: '/collections/all-products',
      description: 'Rich winter tones with elegant shine',
      color: 'from-cyan-500 to-blue-700'
    },
    {
      name: 'Earrings',
      href: '/collections/earrings',
      description: 'Stunning pieces for every style',
      color: 'from-purple-400 to-indigo-600'
    },
    {
      name: 'Bangles',
      href: '/collections/bangles-for-women',
      description: 'Elegant designs for every wrist',
      color: 'from-amber-400 to-orange-600'
    },
    {
      name: 'Makeup',
      href: '/collections/all-products',
      description: 'Beauty essentials to complete your look',
      color: 'from-fuchsia-500 to-rose-600'
    },
    {
      name: 'New Collection',
      href: '/collections/new-arrivals',
      description: 'Freshly dropped premium arrivals',
      color: 'from-rose-400 to-pink-600'
    },
  ]

  return (
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured Collections
          </h2>
          <p className="text-primary/80 text-lg max-w-2xl mx-auto">
            Explore our handpicked collections designed to make you shine on every occasion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={collection.href}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative gold-glass rounded-2xl overflow-hidden transition-all duration-300"
                >
                  {/* Dynamic Cloudinary Image or Gradient Fallback */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {(categoryImageMap[collection.name as keyof typeof categoryImageMap] || categoryImageMap.__fallback?.[index]) ? (
                      <>
                        <Image
                          src={(categoryImageMap[collection.name as keyof typeof categoryImageMap] || categoryImageMap.__fallback?.[index]) as string}
                          alt={collection.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
                      </>
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${collection.color}`} />
                    )}
                    
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/25 to-transparent z-20"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />

                    {/* Icon/Text Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <h3 className="text-white text-3xl font-bold drop-shadow-lg">
                        {collection.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-primary/80 mb-4">{collection.description}</p>
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                      <span>Shop Now</span>
                      <ArrowRight size={18} className="ml-2" />
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/collections">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gold-btn px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              View All Collections
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedCollections

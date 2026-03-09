'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

type HeroMedia = {
  logo: { secureUrl: string } | null
  suits: { secureUrl: string }[]
  videos: { secureUrl: string }[]
  allAssets?: { publicId: string; secureUrl: string; resourceType: 'image' | 'video' }[]
}

const Hero = () => {
  const [heroMedia, setHeroMedia] = useState<HeroMedia | null>(null)
  const [selectedSuitImage, setSelectedSuitImage] = useState<string | null>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const loadHeroMedia = async () => {
      try {
        const response = await fetch('/api/cloudinary/media', { cache: 'no-store' })
        const json = await response.json()
        if (json.success && json.media) {
          const suits = Array.isArray(json.media.suits) ? json.media.suits : []
          const videos = Array.isArray(json.media.videos) ? json.media.videos : []

          setHeroMedia({
            logo: json.media.logo,
            suits,
            videos,
            allAssets: json.media.allAssets,
          })

          if (videos.length > 0) {
            const randomVideoIndex = Math.floor(Math.random() * videos.length)
            setCurrentVideoIndex(randomVideoIndex)
          }

          if (suits.length > 0) {
            const randomIndex = Math.floor(Math.random() * suits.length)
            setSelectedSuitImage(suits[randomIndex].secureUrl)
          } else {
            setSelectedSuitImage(null)
          }
        }
      } catch (error) {
        console.error('❌ Hero Cloudinary fetch error:', error)
      }
    }

    loadHeroMedia()
  }, [])

  const suitImage = selectedSuitImage
  const heroVideos = useMemo(() => {
    const directVideos = (heroMedia?.videos ?? []).map((video) => video.secureUrl)
    const fallbackVideos = (heroMedia?.allAssets ?? [])
      .filter((asset) => {
        if (asset.resourceType !== 'video') return false
        const publicId = asset.publicId?.toLowerCase() || ''
        // Only show jewelry, clothing, and accessories related videos
        return (
          publicId.includes('jewelry') ||
          publicId.includes('jewellery') ||
          publicId.includes('bangle') ||
          publicId.includes('earring') ||
          publicId.includes('necklace') ||
          publicId.includes('ring') ||
          publicId.includes('suit') ||
          publicId.includes('dress') ||
          publicId.includes('cloth') ||
          publicId.includes('accessory') ||
          publicId.includes('accessories') ||
          publicId.includes('sappura') ||
          publicId.includes('product') ||
          publicId.includes('collection')
        )
      })
      .map((asset) => asset.secureUrl)

    return Array.from(new Set([...directVideos, ...fallbackVideos]))
  }, [heroMedia])

  const currentVideo = heroVideos[currentVideoIndex]

  const handleVideoEnded = () => {
    if (heroVideos.length <= 1) return
    setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length)
  }

  const handleVideoError = () => {
    if (heroVideos.length <= 1) return
    setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length)
  }

  useEffect(() => {
    if (heroVideos.length === 0) return
    if (currentVideoIndex >= heroVideos.length) {
      setCurrentVideoIndex(0)
    }
  }, [heroVideos, currentVideoIndex])

  useEffect(() => {
    if (!currentVideo || !videoRef.current) return

    const videoElement = videoRef.current
    videoElement.load()
    const playPromise = videoElement.play()

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay can be blocked on some browsers; keep fallback image visible.
      })
    }
  }, [currentVideo])

  const fallbackLogo = heroMedia?.allAssets?.find((asset) =>
    asset.resourceType === 'image' && asset.publicId.toLowerCase().includes('logo')
  )?.secureUrl
  const logoUrl = heroMedia?.logo?.secureUrl ?? fallbackLogo

  return (
    <section className="relative bg-gradient-to-br from-navy via-navy-light to-navy-dark pt-32 pb-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 mb-4"
            >
              {logoUrl && (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/50 bg-navy-light relative">
                  <Image
                    src={logoUrl}
                    alt="Sappura logo"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <Sparkles className="text-primary" size={24} />
              <span className="text-primary font-semibold">Pakistan&apos;s #1 Jewellery Brand</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-primary"
            >
              Elegant Jewellery
              <span className="text-primary-light block">For Every Occasion</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-primary/80 mb-8 max-w-xl"
            >
              Discover our exquisite collection of artificial jewellery. From bridal sets to everyday elegance, 
              find the perfect piece to complement your style.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/collections">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="gold-btn px-8 py-4 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <span className='text-black'>Shop Now</span>
                  <ArrowRight size={20} />
                </motion.button>
              </Link>

              <Link href="/collections/bridal-jewellery-sets">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-navy-light text-primary border-2 border-primary/70 px-8 py-4 rounded-lg font-semibold hover:bg-primary hover:text-navy transition-colors"
                >
                  Bridal Collection
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-primary/20"
            >
              <div>
                <h3 className="text-3xl font-bold text-primary">1000+</h3>
                <p className="text-primary/75">Products</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary">50K+</h3>
                <p className="text-primary/75">Happy Customers</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary">4.9★</h3>
                <p className="text-primary/75">Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 shadow-2xl border border-primary/20">
                <div className="gold-glass rounded-2xl p-4">
                  <div className="aspect-square bg-gradient-to-br from-navy-dark to-navy rounded-xl flex items-center justify-center relative overflow-hidden">
                    {currentVideo ? (
                      <video
                        key={currentVideo}
                        ref={videoRef}
                        src={currentVideo}
                        autoPlay
                        muted
                        playsInline
                        preload="metadata"
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                        className="w-full h-full object-cover"
                      />
                    ) : suitImage ? (
                      <Image
                        src={suitImage}
                        alt="Featured suit"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <Sparkles className="text-primary" size={120} />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-6 -left-6 gold-glass p-4 rounded-2xl"
            >
              <div className="text-center">
                <p className="text-sm text-primary/75">Cash on</p>
                <p className="font-bold text-accent">Delivery</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

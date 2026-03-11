'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface CollectionCard {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  link: string
  bgColor?: string
}

const FeaturedCollections = () => {
  const collections: CollectionCard[] = [
    {
      id: 'new-collection',
      title: 'New Collection',
      subtitle: 'New Collection',
      description: 'Freshly dropped premium arrivals',
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004797/new-collection_soycvp.jpg',
      link: '/collections/new',
      bgColor: 'from-purple-500/20 to-indigo-500/20'
    },
    {
      id: 'winter-collection',
      title: 'Winter Collection',
      subtitle: 'Winter Collection',
      description: 'Rich winter tones with elegant shine',
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004862/wintercollection-5_a2uwvx.jpg',
      link: '/collections/winter',
      bgColor: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'necklaces',
      title: 'Necklaces',
      subtitle: 'Necklaces',
      description: 'Elegant necklaces for every style',
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004795/neckles-3_crgycd.jpg',
      link: '/collections/necklaces',
      bgColor: 'from-blue-500/20 to-indigo-500/20'
    },
    {
      id: 'makeup',
      title: 'Makeup',
      subtitle: 'Makeup',
      description: 'Beauty essentials to complete your look',
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004790/make-up_aeyh44.jpg',
      link: '/collections/makeup',
      bgColor: 'from-pink-500/20 to-rose-500/20'
    },
    {
      id: 'earrings',
      title: 'Earrings',
      subtitle: 'Earrings',
      description: 'Stunning pieces for every style',
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004783/earing-3_kz0ik8.jpg',
      link: '/collections/earrings',
      bgColor: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'clothes',
      title: 'Clothes',
      subtitle: 'Clothes',
      description: 'Fashionable clothes for every occasion',
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004777/clothes_collection-4_uerze3.jpg',
      link: '/collections/clothes',
      bgColor: 'from-orange-500/20 to-yellow-500/20'
    },
    {
      id: 'bangles',
      title: 'Bangles',
      subtitle: 'Bangles',
      description: 'Elegant designs for every wrist',
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004770/bangals-2_slcypx.jpg',
      link: '/collections/bangles',
      bgColor: 'from-rose-500/20 to-red-500/20'
    },
    {
      id: 'suits',
      title: 'Suits',
      subtitle: 'Suits',
      description: 'Beautiful suits for special moments',
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004840/suits_cwhxhg.jpg',
      link: '/collections/suits',
      bgColor: 'from-emerald-500/20 to-teal-500/20'
    }
  ]

  // Debug: Log collections to verify titles
  console.log('Collections:', collections.map(c => ({ id: c.id, title: c.title })))

  return (
    <section className="py-16 bg-gradient-to-br from-navy-light to-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Featured Collections
          </h2>
          <p className="text-xl text-primary/80 max-w-2xl mx-auto">
            Explore our handpicked collections designed to make you shine on every occasion
          </p>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={`${collection.id}-${collection.title}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={collection.link} className="block">
                <div className={`relative bg-gradient-to-br ${collection.bgColor} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-primary/20`}>
                  {/* Collection Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={`${collection.title} - ${collection.description}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Collection Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-primary/70 mb-4">
                      {collection.description}
                    </p>
                    
                    {/* Shop Now Button */}
                    <div className="flex items-center justify-between">
                      <span className="gold-btn px-6 py-2 text-sm font-bold inline-flex items-center gap-2 group">
                        Shop Now
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Collections Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link 
            href="/collections"
            className="inline-flex items-center gap-3 gold-btn px-8 py-4 text-lg font-bold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
          >
            View All Collections
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedCollections

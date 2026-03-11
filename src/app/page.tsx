import HeroClient from '@/components/home/Hero'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BestSellers from '@/components/home/BestSellers'
import NewArrivals from '@/components/home/NewArrivals'
import Reviews from '@/components/home/Reviews'
import NewsletterSection from '@/components/home/NewsletterSection'

import { getDynamicMediaLibrary } from '@/lib/cloudinary'

export default async function Home() {
  let initialMedia = null
  let initialAssets: any[] = []
  
  try {
    initialMedia = await getDynamicMediaLibrary()
    if (initialMedia && Array.isArray(initialMedia.allAssets)) {
      initialAssets = initialMedia.allAssets
    }
  } catch (err) {
    console.error('Failed to pre-fetch media library on Home:', err)
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroClient initialMedia={initialMedia} />

      {/* Featured Products */}
      <FeaturedProducts 
        maxProducts={8}
        showViewAll={true}
      />

      {/* Best Sellers */}
      <BestSellers 
        initialAssets={initialAssets}
      />

      {/* New Arrivals */}
      <NewArrivals 
        maxProducts={8}
        showViewAll={true}
      />

      {/* Customer Reviews */}
      <Reviews />

      {/* Newsletter Signup */}
      <NewsletterSection />
    </div>
  )
}

import Hero from '@/components/home/Hero'
import FeaturedCollections from '@/components/home/FeaturedCollections'
import BestSellers from '@/components/home/BestSellers'
import Features from '@/components/home/Features'
import Reviews from '@/components/home/Reviews'

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <Features />
      <Reviews />
    </div>
  )
}

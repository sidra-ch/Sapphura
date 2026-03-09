import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CollectionsPage() {
  const collections = [
    { name: 'All Products', href: '/collections/all-products', count: '1000+' },
    { name: 'Bridal Jewellery Sets', href: '/collections/bridal-jewellery-sets', count: '150+' },
    { name: 'Bangles for Women', href: '/collections/bangles-for-women', count: '200+' },
    { name: 'Earrings', href: '/collections/earrings', count: '300+' },
    { name: 'Necklace Sets', href: '/collections/necklace-sets', count: '180+' },
    { name: 'Finger Rings', href: '/collections/finger-rings', count: '120+' },
    { name: 'Anklets', href: '/collections/anklets', count: '80+' },
    { name: 'Bracelet', href: '/collections/bracelet', count: '100+' },
    { name: 'Accessories', href: '/collections/accessories', count: '90+' },
    { name: 'Best Selling Products', href: '/collections/best-selling-products', count: '50+' },
    { name: 'New Arrivals', href: '/collections/new-arrivals', count: '75+' },
    { name: 'Bags', href: '/collections/bags', count: '40+' },
  ]

  return (
    <div className="pt-32 pb-20 min-h-screen bg-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">All Collections</h1>
          <p className="text-primary/80 text-lg max-w-2xl mx-auto">
            Browse through our extensive collection of artificial jewellery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <div
              key={collection.name}
            >
              <Link href={collection.href}>
                <div
                  className="gold-glass rounded-xl p-6 transition-all group hover:-translate-y-1 hover:scale-[1.02]"
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-primary/75">{collection.count} products</p>
                    </div>
                    <ArrowRight className="text-primary group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

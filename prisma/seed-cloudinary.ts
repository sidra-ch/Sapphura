import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const { Pool } = pg

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/Sappuradb'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

// Create Prisma Client with adapter
const prisma = new PrismaClient({ adapter })

// Fetch Cloudinary images
async function getCloudinaryImages() {
  try {
    let allImages: string[] = []
    let nextCursor = ''

    do {
      const result = await cloudinary.api.resources({
        max_results: 500,
        resource_type: 'image',
        next_cursor: nextCursor,
      })

      const imageUrls = result.resources.map((r: any) => r.secure_url)
      allImages = allImages.concat(imageUrls)
      nextCursor = result.next_cursor
    } while (nextCursor)

    console.log(`✅ Fetched ${allImages.length} images from Cloudinary`)
    return allImages
  } catch (error) {
    console.error('❌ Error fetching Cloudinary images:', error)
    return []
  }
}

// Group images by collection type
function categorizeImages(images: string[]) {
  const categories = {
    suits: images.filter(img => img.toLowerCase().includes('suit')),
    winterCollection: images.filter(img => img.toLowerCase().includes('winter')),
    summerCollection: images.filter(img => img.toLowerCase().includes('summer')),
    newCollection: images.filter(img => img.toLowerCase().includes('newcollection')),
    necklaces: images.filter(img => img.toLowerCase().includes('neckle')),
    bangles: images.filter(img => img.toLowerCase().includes('banga')),
    earrings: images.filter(img => img.toLowerCase().includes('earing')),
    bracelets: images.filter(img => img.toLowerCase().includes('bracelet')),
    clothes: images.filter(img => img.toLowerCase().includes('cloth')),
    accessories: images.filter(img => img.toLowerCase().includes('accessories')),
    makeup: images.filter(img => img.toLowerCase().includes('make-up')),
    logo: images.filter(img => img.toLowerCase().includes('logo')),
    other: images.filter(img => 
      !img.toLowerCase().includes('suit') &&
      !img.toLowerCase().includes('winter') &&
      !img.toLowerCase().includes('summer') &&
      !img.toLowerCase().includes('newcollection') &&
      !img.toLowerCase().includes('neckle') &&
      !img.toLowerCase().includes('banga') &&
      !img.toLowerCase().includes('earing') &&
      !img.toLowerCase().includes('bracelet') &&
      !img.toLowerCase().includes('cloth') &&
      !img.toLowerCase().includes('accessories') &&
      !img.toLowerCase().includes('make-up') &&
      !img.toLowerCase().includes('logo')
    )
  }
  
  return categories
}

async function main() {
  console.log('🌱 Starting Sappura database seed with Cloudinary images...\n')

  // Fetch Cloudinary images
  const cloudinaryImages = await getCloudinaryImages()
  
  if (cloudinaryImages.length === 0) {
    console.log('⚠️  No Cloudinary images found. Please upload images first.')
    return
  }

  const categorizedImages = categorizeImages(cloudinaryImages)

  console.log('\n📊 Image Categories:')
  console.log(`  Suits: ${categorizedImages.suits.length}`)
  console.log(`  Winter Collection: ${categorizedImages.winterCollection.length}`)
  console.log(`  Summer Collection: ${categorizedImages.summerCollection.length}`)
  console.log(`  New Collection: ${categorizedImages.newCollection.length}`)
  console.log(`  Necklaces: ${categorizedImages.necklaces.length}`)
  console.log(`  Bangles: ${categorizedImages.bangles.length}`)
  console.log(`  Earrings: ${categorizedImages.earrings.length}`)
  console.log(`  Bracelets: ${categorizedImages.bracelets.length}`)
  console.log(`  Clothes: ${categorizedImages.clothes.length}`)
  console.log(`  Accessories: ${categorizedImages.accessories.length}`)
  console.log(`  Other: ${categorizedImages.other.length}\n`)

  // Create Categories
  const categories = [
    { name: 'Necklaces', slug: 'necklaces', description: 'Beautiful necklace sets for all occasions' },
    { name: 'Earrings', slug: 'earrings', description: 'Elegant earrings collection' },
    { name: 'Bridal Sets', slug: 'bridal-sets', description: 'Complete bridal jewelry sets' },
    { name: 'Bangles', slug: 'bangles', description: 'Traditional and modern bangles' },
    { name: 'Clothing', slug: 'clothing', description: 'Traditional Pakistani clothing' },
    { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories and more' },
    { name: 'Rings', slug: 'rings', description: 'Elegant finger rings' },
    { name: 'Winter Collection', slug: 'winter-collection', description: 'Winter season jewelry collection' },
    { name: 'Summer Collection', slug: 'summer-collection', description: 'Summer season jewelry collection' },
    { name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest collection' },
  ]

  console.log('📂 Creating categories...')
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log(`✅ Created ${categories.length} categories\n`)

  // Create Products from Cloudinary images
  console.log('💍 Creating products from Cloudinary images...\n')

  let productCount = 0

  // Winter Collection Products
  for (let i = 0; i < categorizedImages.winterCollection.length; i++) {
    const imageUrl = categorizedImages.winterCollection[i]
    await prisma.product.create({
      data: {
        name: `Winter Collection Item ${i + 1}`,
        slug: `winter-collection-${i + 1}`,
        description: 'Beautiful winter season jewelry piece with elegant design perfect for the season.',
        price: 2999 + (i * 500),
        originalPrice: 3999 + (i * 500),
        category: 'Winter Collection',
        images: [imageUrl],
        sizes: ['Standard'],
        colors: { gold: '#FFD700', silver: '#C0C0C0' },
        stock: 20,
        inStock: true,
        rating: 4.5 + (Math.random() * 0.5),
        features: ['Premium Quality', 'Winter Collection', 'Elegant Design'],
      }
    })
    productCount++
  }

  // Summer Collection Products
  for (let i = 0; i < categorizedImages.summerCollection.length; i++) {
    const imageUrl = categorizedImages.summerCollection[i]
    await prisma.product.create({
      data: {
        name: `Summer Collection Item ${i + 1}`,
        slug: `summer-collection-${i + 1}`,
        description: 'Elegant summer season jewelry piece with light and fresh design.',
        price: 2499 + (i * 400),
        originalPrice: 3499 + (i * 400),
        category: 'Summer Collection',
        images: [imageUrl],
        sizes: ['Standard'],
        colors: { gold: '#FFD700', rose: '#B76E79' },
        stock: 25,
        inStock: true,
        rating: 4.6 + (Math.random() * 0.4),
        features: ['Summer Collection', 'Lightweight', 'Fresh Design'],
      }
    })
    productCount++
  }

  // Suits Products
  for (let i = 0; i < Math.min(categorizedImages.suits.length, 15); i++) {
    const imageUrl = categorizedImages.suits[i]
    await prisma.product.create({
      data: {
        name: `Designer Suit ${i + 1}`,
        slug: `suit-${i + 1}`,
        description: 'Stunning embroidered suit with intricate work. Perfect for formal occasions and weddings.',
        price: 3999 + (i * 600),
        originalPrice: 5499 + (i * 600),
        category: 'Clothing',
        images: [imageUrl],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: { maroon: '#800000', emerald: '#50C878', blue: '#0F52BA' },
        stock: 15,
        inStock: true,
        rating: 4.7 + (Math.random() * 0.3),
        features: ['Premium Embroidery', 'Traditional Design', 'Party Wear'],
      }
    })
    productCount++
  }

  // Necklaces
  for (let i = 0; i < categorizedImages.necklaces.length; i++) {
    const imageUrl = categorizedImages.necklaces[i]
    await prisma.product.create({
      data: {
        name: `Necklace Set ${i + 1}`,
        slug: `necklace-set-${i + 1}`,
        description: 'Beautiful necklace set with elegant design perfect for special occasions.',
        price: 4499 + (i * 700),
        originalPrice: 6499 + (i * 700),
        category: 'Necklaces',
        images: [imageUrl],
        sizes: ['Standard'],
        colors: { gold: '#FFD700' },
        stock: 12,
        inStock: true,
        rating: 4.8 + (Math.random() * 0.2),
        features: ['Gold Plated', 'Party Wear', 'Premium Design'],
      }
    })
    productCount++
  }

  // Bangles
  for (let i = 0; i < categorizedImages.bangles.length; i++) {
    const imageUrl = categorizedImages.bangles[i]
    await prisma.product.create({
      data: {
        name: `Bangles Set ${i + 1}`,
        slug: `bangles-set-${i + 1}`,
        description: 'Elegant bangles set with beautiful traditional design.',
        price: 1999 + (i * 300),
        originalPrice: 2999 + (i * 300),
        category: 'Bangles',
        images: [imageUrl],
        sizes: ['2.4', '2.6', '2.8'],
        colors: { gold: '#FFD700', silver: '#C0C0C0' },
        stock: 30,
        inStock: true,
        rating: 4.6 + (Math.random() * 0.4),
        features: ['Set of Multiple Bangles', 'Traditional Design', 'Party Wear'],
      }
    })
    productCount++
  }

  // Earrings
  for (let i = 0; i < categorizedImages.earrings.length; i++) {
    const imageUrl = categorizedImages.earrings[i]
    await prisma.product.create({
      data: {
        name: `Designer Earrings ${i + 1}`,
        slug: `earrings-${i + 1}`,
        description: 'Beautiful designer earrings with elegant craftsmanship.',
        price: 1499 + (i * 200),
        originalPrice: 2499 + (i * 200),
        category: 'Earrings',
        images: [imageUrl],
        sizes: ['Standard'],
        colors: { gold: '#FFD700' },
        stock: 25,
        inStock: true,
        rating: 4.7 + (Math.random() * 0.3),
        features: ['Lightweight', 'Elegant Design', 'Comfortable'],
      }
    })
    productCount++
  }

  // Bracelets
  for (let i = 0; i < categorizedImages.bracelets.length; i++) {
    const imageUrl = categorizedImages.bracelets[i]
    await prisma.product.create({
      data: {
        name: `Bracelet ${i + 1}`,
        slug: `bracelet-${i + 1}`,
        description: 'Stylish bracelet with modern design.',
        price: 1799 + (i * 250),
        category: 'Accessories',
        images: [imageUrl],
        sizes: ['Standard'],
        colors: { gold: '#FFD700', silver: '#C0C0C0' },
        stock: 20,
        inStock: true,
        rating: 4.5 + (Math.random() * 0.5),
        features: ['Adjustable', 'Modern Design', 'Daily Wear'],
      }
    })
    productCount++
  }

  console.log(`\n✅ Database seeded successfully!`)
  console.log(`📦 Created ${categories.length} categories`)
  console.log(`💎 Created ${productCount} products with Cloudinary images`)
  console.log(`\n🎉 Your Sappura store is ready!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

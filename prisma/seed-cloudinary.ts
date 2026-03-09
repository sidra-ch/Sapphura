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

type CloudinaryImage = {
  publicId: string
  secureUrl: string
}

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/Sappuradb'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

// Create Prisma Client with adapter
const prisma = new PrismaClient({ adapter })

// Fetch Cloudinary images
async function getCloudinaryImages() {
  try {
    let allImages: CloudinaryImage[] = []
    let nextCursor = ''

    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        resource_type: 'image',
        next_cursor: nextCursor,
      })

      const imageUrls = result.resources.map((r: any) => ({
        publicId: r.public_id,
        secureUrl: r.secure_url,
      }))
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
function categorizeImages(images: CloudinaryImage[]) {
  const categories = {
    suits: images.filter(img => img.publicId.toLowerCase().includes('suit')),
    winterCollection: images.filter(img => img.publicId.toLowerCase().includes('winter')),
    summerCollection: images.filter(img => img.publicId.toLowerCase().includes('summer')),
    newCollection: images.filter(img => img.publicId.toLowerCase().includes('newcollection') || img.publicId.toLowerCase().includes('new-collection')),
    necklaces: images.filter(img => img.publicId.toLowerCase().includes('neckle')),
    bangles: images.filter(img => img.publicId.toLowerCase().includes('banga')),
    earrings: images.filter(img => img.publicId.toLowerCase().includes('earing') || img.publicId.toLowerCase().includes('earring')),
    bracelets: images.filter(img => img.publicId.toLowerCase().includes('bracelet')),
    clothes: images.filter(img => img.publicId.toLowerCase().includes('cloth')),
    accessories: images.filter(img => img.publicId.toLowerCase().includes('accessories')),
    makeup: images.filter(img => img.publicId.toLowerCase().includes('make-up') || img.publicId.toLowerCase().includes('makeup')),
    logo: images.filter(img => img.publicId.toLowerCase().includes('logo')),
    other: images.filter(img => 
      !img.publicId.toLowerCase().includes('suit') &&
      !img.publicId.toLowerCase().includes('winter') &&
      !img.publicId.toLowerCase().includes('summer') &&
      !img.publicId.toLowerCase().includes('newcollection') &&
      !img.publicId.toLowerCase().includes('new-collection') &&
      !img.publicId.toLowerCase().includes('neckle') &&
      !img.publicId.toLowerCase().includes('banga') &&
      !img.publicId.toLowerCase().includes('earing') &&
      !img.publicId.toLowerCase().includes('earring') &&
      !img.publicId.toLowerCase().includes('bracelet') &&
      !img.publicId.toLowerCase().includes('cloth') &&
      !img.publicId.toLowerCase().includes('accessories') &&
      !img.publicId.toLowerCase().includes('make-up') &&
      !img.publicId.toLowerCase().includes('makeup') &&
      !img.publicId.toLowerCase().includes('logo')
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

  const validProductImages = cloudinaryImages.filter((image) => !image.publicId.toLowerCase().includes('logo'))
  const categorizedImages = categorizeImages(validProductImages)

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
    { name: 'Makeup', slug: 'makeup', description: 'Beauty and makeup collection' },
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

  const titleFromPublicId = (publicId: string) =>
    publicId
      .replace(/_[a-z0-9]{6}$/i, '')
      .replace(/[-_\/]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())

  const slugFromPublicId = (publicId: string) =>
    publicId
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const createCategoryProducts = async (
    images: CloudinaryImage[],
    categoryName: string,
    basePrice: number,
    originalDelta: number,
    sizes: string[],
    colorMap: Record<string, string>,
    featureSet: string[]
  ) => {
    for (const image of images) {
      const name = titleFromPublicId(image.publicId)
      const slug = slugFromPublicId(image.publicId)

      await prisma.product.upsert({
        where: { slug },
        update: {
          name,
          description: `${name} from Sappura Cloudinary collection with premium quality and elegant finishing.`,
          price: basePrice,
          originalPrice: basePrice + originalDelta,
          category: categoryName,
          images: [image.secureUrl],
          sizes,
          colors: colorMap,
          stock: 20,
          inStock: true,
          rating: 4.8,
          features: featureSet,
        },
        create: {
          name,
          slug,
          description: `${name} from Sappura Cloudinary collection with premium quality and elegant finishing.`,
          price: basePrice,
          originalPrice: basePrice + originalDelta,
          category: categoryName,
          images: [image.secureUrl],
          sizes,
          colors: colorMap,
          stock: 20,
          inStock: true,
          rating: 4.8,
          features: featureSet,
        }
      })
      productCount++
    }
  }

  // Create Products from Cloudinary images
  console.log('💍 Creating products from Cloudinary images...\n')

  let productCount = 0

  await createCategoryProducts(
    categorizedImages.winterCollection,
    'Winter Collection',
    4299,
    1200,
    ['Standard'],
    { gold: '#FFD700', silver: '#C0C0C0' },
    ['Winter Collection', 'Premium Finish', 'Seasonal Favorite']
  )

  await createCategoryProducts(
    categorizedImages.summerCollection,
    'Summer Collection',
    3499,
    1000,
    ['Standard'],
    { gold: '#FFD700', rose: '#B76E79' },
    ['Summer Collection', 'Lightweight', 'Elegant Design']
  )

  await createCategoryProducts(
    categorizedImages.newCollection,
    'New Arrivals',
    3899,
    900,
    ['Standard'],
    { gold: '#FFD700', champagne: '#F7E7CE' },
    ['New Arrival', 'Trending', 'Premium Quality']
  )

  await createCategoryProducts(
    categorizedImages.suits,
    'Clothing',
    4599,
    1300,
    ['S', 'M', 'L', 'XL'],
    { maroon: '#800000', emerald: '#50C878', blue: '#0F52BA' },
    ['Designer Suit', 'Premium Fabric', 'Formal Wear']
  )

  await createCategoryProducts(
    categorizedImages.necklaces,
    'Necklaces',
    4899,
    1400,
    ['Standard'],
    { gold: '#FFD700' },
    ['Necklace Set', 'Party Wear', 'Elegant Craftsmanship']
  )

  await createCategoryProducts(
    categorizedImages.bangles,
    'Bangles',
    2599,
    900,
    ['2.4', '2.6', '2.8'],
    { gold: '#FFD700', silver: '#C0C0C0' },
    ['Traditional Design', 'Festival Wear', 'Comfort Fit']
  )

  await createCategoryProducts(
    categorizedImages.earrings,
    'Earrings',
    1899,
    700,
    ['Standard'],
    { gold: '#FFD700' },
    ['Lightweight', 'Elegant Look', 'Daily & Party Wear']
  )

  await createCategoryProducts(
    categorizedImages.bracelets,
    'Accessories',
    2099,
    700,
    ['Standard'],
    { gold: '#FFD700', silver: '#C0C0C0' },
    ['Adjustable', 'Modern Design', 'Gift Friendly']
  )

  await createCategoryProducts(
    categorizedImages.clothes,
    'Clothing',
    4399,
    1100,
    ['S', 'M', 'L', 'XL'],
    { maroon: '#800000', emerald: '#50C878', blue: '#0F52BA' },
    ['Traditional Wear', 'Premium Collection', 'Festive Style']
  )

  await createCategoryProducts(
    categorizedImages.accessories,
    'Accessories',
    2499,
    800,
    ['Standard'],
    { gold: '#FFD700', black: '#1f2937' },
    ['Accessorized Look', 'Premium Quality', 'Trendy']
  )

  await createCategoryProducts(
    categorizedImages.makeup,
    'Makeup',
    1799,
    500,
    ['Standard'],
    { rose: '#B76E79', nude: '#E3BC9A' },
    ['Beauty Collection', 'Daily Use', 'Premium Formula']
  )

  await createCategoryProducts(
    categorizedImages.other,
    'New Arrivals',
    3299,
    900,
    ['Standard'],
    { gold: '#FFD700', silver: '#C0C0C0' },
    ['Sappura Collection', 'Latest Drop', 'Premium Quality']
  )

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

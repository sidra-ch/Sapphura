import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

async function directSeed() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/Sappuradb'
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    console.log('🌱 Starting direct database seed...\n')

    // Create categories
    const categories = [
      { name: 'Necklaces', slug: 'necklaces', description: 'Beautiful necklace sets' },
      { name: 'Earrings', slug: 'earrings', description: 'Elegant earrings collection' },
      { name: 'Bridal Sets', slug: 'bridal-sets', description: 'Complete bridal jewelry sets' },
      { name: 'Bangles', slug: 'bangles', description: 'Traditional and modern bangles' },
    ]

    console.log('📂 Creating categories...')
    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    }
    console.log('✅ Categories created\n')

    // Create products
    const products = [
      {
        name: 'Bridal Necklace Set',
        slug: 'bridal-necklace-set',
        description: 'A stunning 18k gold-plated necklace for weddings',
        price: 4999,
        originalPrice: 6999,
        category: 'Necklaces',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
        sizes: ['Small', 'Medium', 'Large'],
        colors: JSON.stringify([{ name: 'Gold', hex: '#FFD700' }]),
        stock: 50,
        inStock: true,
        rating: 4.8,
      },
      {
        name: 'Designer Earrings',
        slug: 'pearl-drop-earrings',
        description: 'Classic pearl drop earrings with gold-plated hooks',
        price: 2499,
        originalPrice: 3499,
        category: 'Earrings',
        images: ['https://images.unsplash.com/photo-1596944924591-4375e59fae5a?w=800'],
        sizes: [],
        colors: JSON.stringify([{ name: 'White Pearl', hex: '#F5F5F5' }]),
        stock: 75,
        inStock: true,
        rating: 4.9,
      },
      {
        name: 'Kundan Bridal Set',
        slug: 'kundan-bridal-set',
        description: 'Complete bridal jewelry set with traditional Kundan work',
        price: 15999,
        originalPrice: 22999,
        category: 'Bridal Sets',
        images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800'],
        sizes: ['Standard'],
        colors: JSON.stringify([{ name: 'Red & Gold', hex: '#DC143C' }]),
        stock: 25,
        inStock: true,
        rating: 5.0,
      },
      {
        name: 'Luxury Bangles Set',
        slug: 'luxury-bangles-set',
        description: 'Delicate sterling silver bangles with customizable charms',
        price: 1999,
        originalPrice: null,
        category: 'Bangles',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
        sizes: ['6 inch', '7 inch', '8 inch'],
        colors: JSON.stringify([{ name: 'Silver', hex: '#C0C0C0' }]),
        stock: 100,
        inStock: true,
        rating: 4.6,
      },
      {
        name: 'Gold Plated Ring',
        slug: 'gold-plated-ring',
        description: 'Elegant gold-plated ring for any occasion',
        price: 1299,
        originalPrice: 1999,
        category: 'Rings',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
        sizes: ['5', '6', '7', '8', '9'],
        colors: JSON.stringify([{ name: 'Gold', hex: '#FFD700' }]),
        stock: 60,
        inStock: true,
        rating: 4.5,
      },
      {
        name: 'Antique Anklet',
        slug: 'antique-anklet',
        description: 'Traditional Pakistani antique finish anklet',
        price: 899,
        originalPrice: 1299,
        category: 'Anklets',
        images: ['https://images.unsplash.com/photo-1535556116002-6281ff3e9f99?w=800'],
        sizes: ['One Size'],
        colors: JSON.stringify([{ name: 'Antique Gold', hex: '#C9B037' }]),
        stock: 80,
        inStock: true,
        rating: 4.7,
      },
      {
        name: 'Diamond Pendant',
        slug: 'diamond-pendant',
        description: 'Beautiful diamond pendant necklace',
        price: 5999,
        originalPrice: 7999,
        category: 'Necklaces',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
        sizes: ['Standard'],
        colors: JSON.stringify([{ name: 'White Gold', hex: '#F5F5DC' }]),
        stock: 30,
        inStock: true,
        rating: 4.9,
      },
      {
        name: 'Crystal Studs',
        slug: 'crystal-studs',
        description: 'Sparkling crystal stud earrings',
        price: 1599,
        originalPrice: 2299,
        category: 'Earrings',
        images: ['https://images.unsplash.com/photo-1596944924591-4375e59fae5a?w=800'],
        sizes: [],
        colors: JSON.stringify([{ name: 'Crystal Clear', hex: '#E8F4F8' }]),
        stock: 90,
        inStock: true,
        rating: 4.8,
      },
    ]

    console.log('💍 Creating products...')
    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          ...product,
          colors: product.colors ? JSON.parse(product.colors) : null,
        },
      })
    }
    console.log('✅ Products created\n')

    // Verify
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()

    console.log('✅ DATABASE SEEDING COMPLETE!')
    console.log(`📦 Total products: ${productCount}`)
    console.log(`📂 Total categories: ${categoryCount}`)
    console.log('\n🎉 All products ready to display!')

  } catch (error: any) {
    console.error('❌ Error seeding database:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
    await pool.end()
    process.exit(0)
  }
}

directSeed()

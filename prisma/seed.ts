import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

// Create PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/Sappuradb'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

// Create Prisma Client with adapter
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Categories
  const categories = [
    { name: 'Necklaces', slug: 'necklaces', description: 'Beautiful necklace sets for all occasions' },
    { name: 'Earrings', slug: 'earrings', description: 'Elegant earrings collection' },
    { name: 'Bridal Sets', slug: 'bridal-sets', description: 'Complete bridal jewelry sets' },
    { name: 'Bangles', slug: 'bangles', description: 'Traditional and modern bangles' },
    { name: 'Clothing', slug: 'clothing', description: 'Traditional Pakistani clothing' },
    { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories and more' },
    { name: 'Rings', slug: 'rings', description: 'Elegant finger rings' },
  ]

  console.log('📂 Creating categories...')
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  // Create Sample Products (matching products.ts data)
  const products = [
    {
      id: 'bridal-necklace-set-001',
      name: 'Bridal Necklace Set',
      slug: 'bridal-necklace-set',
      description: 'A stunning 18k gold-plated necklace featuring intricate traditional Pakistani design. Perfect for weddings and formal occasions. Handcrafted with attention to detail, this piece combines modern elegance with traditional craftsmanship.',
      price: 4999,
      originalPrice: 6999,
      category: 'Necklaces',
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      ],
      sizes: ['Small', 'Medium', 'Large'],
      colors: JSON.parse(JSON.stringify([
        { name: 'Gold', hex: '#FFD700' },
        { name: 'Rose Gold', hex: '#B76E79' },
      ])),
      stock: 50,
      inStock: true,
      rating: 4.8,
    },
    {
      id: 'pearl-drop-earrings-002',
      name: 'Designer Earrings',
      slug: 'pearl-drop-earrings',
      description: 'Classic pearl drop earrings with gold-plated hooks. These timeless earrings feature genuine freshwater pearls that add elegance to any outfit. Lightweight and comfortable for all-day wear.',
      price: 2499,
      originalPrice: 3499,
      category: 'Earrings',
      images: [
        'https://images.unsplash.com/photo-1596944924591-4375e59fae5a?w=800',
        'https://images.unsplash.com/photo-1535556116002-6281ff3e9f99?w=800',
        'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800',
      ],
      sizes: [],
      colors: JSON.parse(JSON.stringify([
        { name: 'White Pearl', hex: '#F5F5F5' },
        { name: 'Black Pearl', hex: '#2C2C2C' },
      ])),
      stock: 75,
      inStock: true,
      rating: 4.9,
    },
    {
      id: 'kundan-bridal-set-003',
      name: 'Kundan Bridal Set',
      slug: 'kundan-bridal-set',
      description: 'Complete bridal jewelry set featuring exquisite Kundan work. This luxurious set includes necklace, earrings, maang tikka, and matching bangles. Perfect for your special day with traditional Pakistani craftsmanship.',
      price: 15999,
      originalPrice: 22999,
      category: 'Bridal Sets',
      images: [
        'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800',
        'https://images.unsplash.com/photo-1611622537396-0b2b7968455a?w=800',
        'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      ],
      sizes: ['Standard'],
      colors: JSON.parse(JSON.stringify([
        { name: 'Red & Gold', hex: '#DC143C' },
        { name: 'Green & Gold', hex: '#228B22' },
      ])),
      stock: 25,
      inStock: true,
      rating: 5.0,
    },
    {
      id: 'luxury-bangles-set-004',
      name: 'Luxury Bangles Set',
      slug: 'luxury-bangles-set',
      description: 'Delicate sterling silver bangles with customizable charms. Add your favorite charms to create a personalized piece. Features secure clasp and adjustable design.',
      price: 1999,
      originalPrice: null,
      category: 'Bangles',
      images: [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      ],
      sizes: ['6 inch', '7 inch', '8 inch'],
      colors: JSON.parse(JSON.stringify([
        { name: 'Silver', hex: '#C0C0C0' },
      ])),
      stock: 100,
      inStock: true,
      rating: 4.6,
    },
    {
      id: 'embroidered-suit-005',
      name: 'Embroidered Suit',
      slug: 'embroidered-suit',
      description: 'Stunning embroidered suit with intricate work. Perfect for formal occasions and weddings. Features beautiful traditional Pakistani design with modern styling. A statement piece for your wardrobe.',
      price: 3499,
      originalPrice: 4999,
      category: 'Clothing',
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800',
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: JSON.parse(JSON.stringify([
        { name: 'Maroon', hex: '#800000' },
        { name: 'Emerald Green', hex: '#50C878' },
        { name: 'Royal Blue', hex: '#0F52BA' },
      ])),
      stock: 40,
      inStock: true,
      rating: 4.7,
    },
    {
      id: 'accessories-collection-006',
      name: 'Accessories Collection',
      slug: 'accessories-collection',
      description: 'Traditional Pakistani accessories with antique finish. Features intricate meenakari work and pearl embellishments. Perfect for cultural events and festive occasions.',
      price: 2999,
      originalPrice: null,
      category: 'Accessories',
      images: [
        'https://images.unsplash.com/photo-1535556116002-6281ff3e9f99?w=800',
        'https://images.unsplash.com/photo-1596944924591-4375e59fae5a?w=800',
      ],
      sizes: [],
      colors: JSON.parse(JSON.stringify([
        { name: 'Antique Gold', hex: '#C9B037' },
        { name: 'Oxidized Silver', hex: '#71797E' },
      ])),
      stock: 60,
      inStock: true,
      rating: 4.8,
    },
    {
      id: 'luxury-lawn-suit-007',
      name: 'Luxury Lawn Suit',
      slug: 'luxury-lawn-suit',
      description: 'Premium quality lawn suit with beautiful prints and embroidery. Perfect for summer occasions. Soft, breathable fabric with elegant design.',
      price: 3999,
      originalPrice: 5499,
      category: 'Clothing',
      images: [
        'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=800',
        'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: JSON.parse(JSON.stringify([
        { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Sky Blue', hex: '#87CEEB' },
        { name: 'Mint Green', hex: '#98FF98' },
      ])),
      stock: 55,
      inStock: true,
      rating: 4.9,
    },
    {
      id: 'gold-plated-bangles-008',
      name: 'Gold Plated Bangles',
      slug: 'gold-plated-bangles',
      description: 'Set of 6 beautiful gold-plated bangles with intricate design. Perfect for parties and special occasions. Adds elegance to any outfit.',
      price: 2799,
      originalPrice: 3999,
      category: 'Bangles',
      images: [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      ],
      sizes: ['2.4', '2.6', '2.8'],
      colors: JSON.parse(JSON.stringify([
        { name: 'Gold', hex: '#FFD700' },
        { name: 'Rose Gold', hex: '#B76E79' },
      ])),
      stock: 80,
      inStock: true,
      rating: 4.7,
    },
  ]

  console.log('💍 Creating products...')
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📦 Created ${categories.length} categories`)
  console.log(`💎 Created ${products.length} products`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

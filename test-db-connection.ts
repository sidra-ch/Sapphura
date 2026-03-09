import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

async function testConnection() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/Sappuradb'
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })
  
  try {
    console.log('🔍 Testing database connection...\n')
    console.log('📊 DATABASE_URL:', connectionString.replace(/:[^:]*@/, ':****@'))
    
    // Try to connect
    await prisma.$connect()
    console.log('\n✅ Database connection successful!')
    console.log('✅ Connected to: Sappuradb')
    
    // Get table info
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()
    
    console.log(`\n📦 Products in database: ${productCount}`)
    console.log(`📂 Categories in database: ${categoryCount}`)
    
    if (productCount === 0) {
      console.log('\n⚠️  WARNING: No products found in database!')
      console.log('💡 Solution: Run this command to add products:')
      console.log('   npm run db:seed')
    } else {
      console.log('\n✅ Database has data!')
      
      // Show first 3 products
      const products = await prisma.product.findMany({ take: 3 })
      console.log('\n🎁 Sample products:')
      products.forEach(p => {
        console.log(`   • ${p.name} - Rs. ${p.price} (${p.category})`)
      })
    }
    
  } catch (error: any) {
    console.error('\n❌ Database connection FAILED!')
    console.error('Error:', error.message || error)
    console.log('\n💡 Solutions:')
    console.log('1. Check if PostgreSQL is running')
    console.log('2. Verify database "Sappuradb" exists in PostgreSQL')
    console.log('3. Check .env DATABASE_URL is correct')
    console.log('4. Check PostgreSQL username/password')
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

testConnection()

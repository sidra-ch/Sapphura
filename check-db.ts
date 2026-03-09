import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

async function checkAndSeedDB() {
  try {
    console.log('🔍 Checking database...\n')
    
    const products = await prisma.product.findMany()
    console.log('📦 Total products in database:', products.length)
    
    if (products.length === 0) {
      console.log('\n⚠️ No products found! Running seed...\n')
      execSync('npm run db:seed', { stdio: 'inherit' })
    } else {
      console.log('\n✅ Products found:')
      products.forEach(p => {
        console.log(`  - ${p.name} (${p.category}) - Rs. ${p.price}`)
      })
    }
    
    const categories = await prisma.category.findMany()
    console.log('\n📂 Total categories:', categories.length)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndSeedDB()

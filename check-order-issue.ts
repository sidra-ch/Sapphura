import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

async function checkOrder() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123456@localhost:5432/Sappuradb'
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })
  
  try {
    const products = await prisma.product.findMany({ take: 3 })
    const orders = await prisma.order.findMany({ take: 3 })
    
    console.log('\n📦 Products:')
    products.forEach(p => console.log(`  - ${p.name} (ID: ${p.id})`))
    
    console.log('\n📋 Orders:')
    orders.length > 0 
      ? orders.forEach(o => console.log(`  - ${o.orderNumber} (${o.customerName})`))
      : console.log('  No orders yet')
    
    console.log('\n✅ Database structure is OK')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

checkOrder()

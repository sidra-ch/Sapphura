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

async function cleanupForeignImages() {
  console.log('🧹 Starting cleanup of foreign project images...')

  // Projects to filter out
  const excludePatterns = [
    'humsafar',
    'afghan',
    'baba'
  ]

  // Fetch all products
  const products = await prisma.product.findMany()
  console.log(`📦 Found ${products.length} products in database`)

  let totalImagesRemoved = 0
  let productsUpdated = 0

  for (const product of products) {
    const originalImages = product.images as string[]
    
    // Filter out images containing any of the exclude patterns
    const filteredImages = originalImages.filter(image => {
      const imageLower = image.toLowerCase()
      return !excludePatterns.some(pattern => imageLower.includes(pattern))
    })

    // Count removed images
    const removedCount = originalImages.length - filteredImages.length

    if (removedCount > 0) {
      console.log(`🗑️  Product "${product.name}": Removed ${removedCount} foreign image(s)`)
      totalImagesRemoved += removedCount

      // Update product with cleaned images
      if (filteredImages.length > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: filteredImages }
        })
        productsUpdated++
        console.log(`✅ Updated: ${product.name} (${filteredImages.length} images remaining)`)
      } else {
        // If no images left, you can either delete or keep the product without images
        console.log(`⚠️  WARNING: Product "${product.name}" has NO images remaining after cleanup!`)
        // Optionally delete product if it has no images:
        // await prisma.product.delete({ where: { id: product.id } })
      }
    }
  }

  console.log('\n✨ Cleanup Summary:')
  console.log(`📊 Products processed: ${products.length}`)
  console.log(`📝 Products updated: ${productsUpdated}`)
  console.log(`🗑️  Total images removed: ${totalImagesRemoved}`)
  console.log('✅ Cleanup completed successfully!')
}

cleanupForeignImages()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

/**
 * Data seeding script for Shopify-style media gallery
 * This script demonstrates how to update existing products with the new media format
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample media data for products
const sampleMediaData = [
  {
    productName: 'Elegant Diamond Necklace',
    media: [
      {
        type: 'image',
        url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/necklace-1',
        alt: 'Elegant Diamond Necklace - Front View'
      },
      {
        type: 'image', 
        url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/necklace-2',
        alt: 'Elegant Diamond Necklace - Side View'
      },
      {
        type: 'image',
        url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/necklace-3',
        alt: 'Elegant Diamond Necklace - Detail View'
      },
      {
        type: 'video',
        url: 'https://res.cloudinary.com/dwmxdyvd2/video/upload/v1/products/necklace-demo',
        thumbnail: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/necklace-demo.jpg'
      }
    ]
  },
  {
    productName: 'Royal Gold Earrings',
    media: [
      {
        type: 'image',
        url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/earrings-1',
        alt: 'Royal Gold Earrings - Front View'
      },
      {
        type: 'image',
        url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/earrings-2',
        alt: 'Royal Gold Earrings - Side View'
      }
    ]
  },
  {
    productName: 'Pearl Bracelet',
    media: [
      {
        type: 'image',
        url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/bracelet-1',
        alt: 'Pearl Bracelet - Main View'
      },
      {
        type: 'image',
        url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/bracelet-2',
        alt: 'Pearl Bracelet - Detail View'
      },
      {
        type: 'video',
        url: 'https://res.cloudinary.com/dwmxdyvd2/video/upload/v1/products/bracelet-demo',
        thumbnail: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1/products/bracelet-demo.jpg'
      }
    ]
  }
]

async function seedMediaData() {
  try {
    console.log('🎬 Starting media data seeding...')

    for (const productData of sampleMediaData) {
      // Find the product by name
      const product = await prisma.product.findFirst({
        where: { name: productData.productName }
      })

      if (product) {
        // Update the product with new media data
        await prisma.product.update({
          where: { id: product.id },
          data: {
            media: productData.media
          }
        })

        console.log(`✅ Updated media for: ${productData.productName}`)
      } else {
        console.log(`⚠️ Product not found: ${productData.productName}`)
      }
    }

    console.log('🎉 Media data seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding media data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Function to convert existing products to new media format
async function convertExistingProducts() {
  try {
    console.log('🔄 Converting existing products to new media format...')

    // Find products to convert (we'll filter in JS if needed)
    const products = await prisma.product.findMany()
    const productsToUpdate = products.filter(p => !p.media || (Array.isArray(p.media) && p.media.length === 0))

    for (const product of productsToUpdate) {
      const media = []

      // Convert images to media format
      if (product.images && product.images.length > 0) {
        product.images.forEach((imageUrl, index) => {
          media.push({
            type: 'image',
            url: imageUrl,
            alt: `${product.name} - Image ${index + 1}`
          })
        })
      }

      // Add video if exists
      if (product.video) {
        media.push({
          type: 'video',
          url: product.video,
          thumbnail: product.video.replace(/\.\w+$/, '.jpg')
        })
      }

      // Update product with new media format
      await prisma.product.update({
        where: { id: product.id },
        data: {
          media: media
        }
      })

      console.log(`✅ Converted: ${product.name}`)
    }

    console.log('🎉 Product conversion completed!')
  } catch (error) {
    console.error('❌ Error converting products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Export functions for use in scripts
export { seedMediaData, convertExistingProducts }

// Run if called directly
if (require.main === module) {
  const command = process.argv[2]
  
  if (command === 'seed') {
    seedMediaData()
  } else if (command === 'convert') {
    convertExistingProducts()
  } else {
    console.log('Usage: node seed-media.js [seed|convert]')
  }
}

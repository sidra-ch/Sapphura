import prisma from '@/lib/prisma';

const FOREIGN_PROJECT_PATTERNS = [
  'humsafar',
  'afghan',
  'baba',
  // Add more patterns if needed
];

async function cleanupForeignImages() {
  try {
    console.log('🔍 Scanning for foreign project images...\n');

    // Get all products
    const allProducts = await prisma.product.findMany();

    if (allProducts.length === 0) {
      console.log('✅ No products found in database');
      return;
    }

    let productsToCleanup: typeof allProducts = [];
    let imagesRemoved = 0;

    // Find products with foreign images
    for (const product of allProducts) {
      const originalImageCount = product.images.length;
      
      // Filter out foreign images
      const cleanImages = product.images.filter(image => {
        const imageUrl = image.toLowerCase();
        return !FOREIGN_PROJECT_PATTERNS.some(pattern => 
          imageUrl.includes(pattern)
        );
      });

      const removedCount = originalImageCount - cleanImages.length;

      if (removedCount > 0) {
        console.log(
          `⚠️  Product: "${product.name}" (ID: ${product.id})`
        );
        console.log(`   Removed ${removedCount} foreign image(s)`);
        console.log(`   URLs removed:`);
        
        product.images.forEach((image, index) => {
          const imageUrl = image.toLowerCase();
          if (FOREIGN_PROJECT_PATTERNS.some(pattern => imageUrl.includes(pattern))) {
            console.log(`   - ${image}`);
          }
        });
        console.log();

        imagesRemoved += removedCount;
        productsToCleanup.push({
          ...product,
          images: cleanImages,
        });
      }
    }

    if (productsToCleanup.length === 0) {
      console.log('✅ No foreign images found! Your products are clean.');
      return;
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Products to update: ${productsToCleanup.length}`);
    console.log(`   Total images to remove: ${imagesRemoved}`);
    console.log('\n🗑️  Removing foreign images...\n');

    // Update products to remove foreign images
    for (const product of productsToCleanup) {
      if (product.images.length === 0) {
        console.log(`⚠️  Deleting entire product "${product.name}" (no images left)`);
        await prisma.product.delete({ where: { id: product.id } });
      } else {
        console.log(`✅ Updated "${product.name}" - ${product.images.length} images remaining`);
        await prisma.product.update({
          where: { id: product.id },
          data: { images: product.images },
        });
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   - Products updated: ${productsToCleanup.filter(p => p.images.length > 0).length}`);
    console.log(`   - Products deleted: ${productsToCleanup.filter(p => p.images.length === 0).length}`);
    console.log(`   - Foreign images removed: ${imagesRemoved}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupForeignImages();

import 'dotenv/config';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Delete only specific foreign project patterns
const FOREIGN_PROJECT_PATTERNS = [
  'humsafar',           // Humsafar project
  'afghani',            // Afghani project  
  'afghan_baba',        // Afghan Baba project
  'zeesy',              // Zeesy project
  'hotel_',             // Hotel/tourism project
  'tourimg',            // Tour images
  'hotelimg',           // Hotel images
  'foreignflight',      // Flight booking project
  'busimg',             // Bus images
  'intercity_taxi',     // Taxi project
  'accommodation',      // Accommodation project
];

// Function to check if asset should be DELETED (is foreign)
function isForeignAsset(publicId: string): boolean {
  const lowerPublicId = publicId.toLowerCase();
  return FOREIGN_PROJECT_PATTERNS.some(pattern => lowerPublicId.includes(pattern));
}

async function cleanupCloudinaryAssets() {
  try {
    console.log('🔍 Scanning Cloudinary for foreign project assets...\n');

    // Get all resources
    let allAssets: any[] = [];
    let nextCursor = '';

    do {
      const result = await cloudinary.api.resources({
        max_results: 500,
        next_cursor: nextCursor,
      });

      allAssets = allAssets.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor && allAssets.length < 10000);

    console.log(`📊 Total assets in Cloudinary: ${allAssets.length}\n`);

    // Filter for FOREIGN project assets to DELETE
    const assetsToDelete = allAssets.filter((asset) => {
      return isForeignAsset(asset.public_id);
    });

    if (assetsToDelete.length === 0) {
      console.log('✅ No foreign project assets found! Your Cloudinary is clean.');
      console.log(`📊 All ${allAssets.length} assets are valid Sappura images.`);
      return;
    }

    const keepCount = allAssets.length - assetsToDelete.length;
    console.log(`✅ Assets to KEEP (Valid Sappura): ${keepCount}`);
    console.log(`⚠️  Assets to DELETE (Foreign projects): ${assetsToDelete.length}\n`);

    console.log(`First 20 assets that will be deleted:\n`);
    assetsToDelete.slice(0, 20).forEach((asset, index) => {
      console.log(`${index + 1}. ${asset.public_id}`);
    });

    if (assetsToDelete.length > 20) {
      console.log(`\n... and ${assetsToDelete.length - 20} more`);
    }

    console.log(`\n⚠️  WARNING: This will delete ${assetsToDelete.length} assets!`);
    console.log(`Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n`);

    // Wait 5 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log(`🗑️  Deleting ${assetsToDelete.length} foreign assets...\n`);

    let deletedCount = 0;
    let failedCount = 0;

    for (const asset of assetsToDelete) {
      try {
        await cloudinary.api.delete_resources([asset.public_id]);
        console.log(`✅ Deleted: ${asset.public_id}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Failed to delete: ${asset.public_id}`);
        failedCount++;
      }
    }

    console.log(`\n✨ Cleanup Summary:`);
    console.log(`   ✅ Successfully deleted: ${deletedCount}`);
    console.log(`   ❌ Failed to delete: ${failedCount}`);
    console.log(`   📊 Total removed: ${deletedCount} assets`);
    console.log(`\n✅ Cloudinary cleanup complete!`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupCloudinaryAssets();

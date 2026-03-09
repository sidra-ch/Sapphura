import 'dotenv/config';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listAllAssets() {
  try {
    console.log('🔍 Fetching all Cloudinary assets...\n');

    let allAssets: any[] = [];
    let nextCursor = '';

    do {
      const result = await cloudinary.api.resources({
        max_results: 500,
        next_cursor: nextCursor,
      });

      allAssets = allAssets.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    console.log(`📊 Total assets: ${allAssets.length}\n`);

    // Group by folder/pattern
    const sappuraAssets: any[] = [];
    const otherAssets: any[] = [];

    allAssets.forEach((asset) => {
      const publicId = asset.public_id.toLowerCase();
      
      if (publicId.includes('sappura') || publicId.includes('suit') || 
          publicId.includes('jewelry') || publicId.includes('jewellery') ||
          publicId.includes('bangles') || publicId.includes('necklace') ||
          publicId.includes('earring') || publicId.includes('ring')) {
        sappuraAssets.push(asset);
      } else {
        otherAssets.push(asset);
      }
    });

    console.log(`✅ Sappura assets: ${sappuraAssets.length}`);
    console.log(`⚠️  Other/Unknown assets: ${otherAssets.length}\n`);

    if (otherAssets.length > 0) {
      console.log('📋 First 50 Other/Unknown Assets:\n');
      otherAssets.slice(0, 50).forEach((asset, index) => {
        console.log(`${index + 1}. ${asset.public_id}`);
      });
      
      if (otherAssets.length > 50) {
        console.log(`\n... and ${otherAssets.length - 50} more`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listAllAssets();

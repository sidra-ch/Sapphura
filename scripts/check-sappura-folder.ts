import 'dotenv/config';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listSappuraFolder() {
  try {
    console.log('🔍 Checking Sappura folder in Cloudinary...\n');

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

    // Filter for Sappura folder images
    const sappuraFolderImages = allAssets.filter((asset) => {
      const publicId = asset.public_id.toLowerCase();
      return publicId.includes('sappura/') || publicId.startsWith('sappura/');
    });

    console.log(`📊 Total Cloudinary assets: ${allAssets.length}`);
    console.log(`✅ Sappura folder images: ${sappuraFolderImages.length}\n`);

    if (sappuraFolderImages.length > 0) {
      console.log('📁 Sappura folder images:\n');
      sappuraFolderImages.forEach((asset, index) => {
        console.log(`${index + 1}. ${asset.public_id}`);
      });
    } else {
      console.log('⚠️  No images found in "Sappura/" folder!');
      console.log('\nShowing first 20 assets to help identify correct folder name:\n');
      allAssets.slice(0, 20).forEach((asset, index) => {
        console.log(`${index + 1}. ${asset.public_id}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listSappuraFolder();

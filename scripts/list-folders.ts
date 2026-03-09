import 'dotenv/config';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listAllFolders() {
  try {
    console.log('🔍 Fetching all folders and assets...\n');

    // Get folders
    const folders = await cloudinary.api.root_folders();
    console.log('📁 Root folders found:');
    folders.folders.forEach((folder: any) => {
      console.log(`  - ${folder.name} (path: ${folder.path})`);
    });

    // Get all assets with their full paths
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

    console.log(`\n📊 Total assets: ${allAssets.length}\n`);

    // Group by folder/prefix
    const folderGroups: { [key: string]: number } = {};
    const rootAssets: string[] = [];

    allAssets.forEach((asset) => {
      const publicId = asset.public_id;
      if (publicId.includes('/')) {
        const folder = publicId.split('/')[0];
        folderGroups[folder] = (folderGroups[folder] || 0) + 1;
      } else {
        rootAssets.push(publicId);
      }
    });

    console.log('📂 Assets grouped by folder:\n');
    Object.entries(folderGroups)
      .sort((a, b) => b[1] - a[1])
      .forEach(([folder, count]) => {
        console.log(`  ${folder}/ : ${count} images`);
      });

    console.log(`\n  (root - no folder) : ${rootAssets.length} images`);

    if (rootAssets.length > 0) {
      console.log('\n📋 First 30 root-level assets (no folder):\n');
      rootAssets.slice(0, 30).forEach((publicId, index) => {
        console.log(`  ${index + 1}. ${publicId}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listAllFolders();

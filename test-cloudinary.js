// Quick test to check Cloudinary connection and assets
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dwmxdyvd2',
  api_key: '596569699175142',
  api_secret: 'mD30EUXyh6sqwszB-RhjhvQlpWY',
});

async function testCloudinary() {
  console.log('🔍 Testing Cloudinary connection...\n');
  
  try {
    // Test 1: Fetch all images (no filter)
    console.log('📸 Fetching ALL images...');
    const allImages = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      max_results: 10,
    });
    
    console.log(`✅ Found ${allImages.resources.length} images (showing first 10)`);
    console.log('📁 Folder structure:');
    allImages.resources.forEach((img, index) => {
      console.log(`  ${index + 1}. ${img.public_id}`);
    });
    
    console.log('\n📹 Fetching ALL videos...');
    const allVideos = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      max_results: 10,
    });
    
    console.log(`✅ Found ${allVideos.resources.length} videos (showing first 10)`);
    allVideos.resources.forEach((vid, index) => {
      console.log(`  ${index + 1}. ${vid.public_id}`);
    });
    
    // Test 2: Try sappura folder
    console.log('\n🔍 Checking for "sappura" folder...');
    try {
      const sappuraImages = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
        prefix: 'sappura',
        max_results: 10,
      });
      console.log(`✅ Found ${sappuraImages.resources.length} images in "sappura" folder`);
    } catch (err) {
      console.log('❌ No "sappura" folder found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCloudinary();

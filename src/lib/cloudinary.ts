import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryAsset, CloudinaryMediaPayload } from '@/types/cloudinaryMedia';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

function toAsset(resource: any, resourceType: 'image' | 'video'): CloudinaryAsset {
  return {
    publicId: resource.public_id,
    url: resource.url,
    secureUrl: resource.secure_url,
    format: resource.format,
    width: resource.width,
    height: resource.height,
    resourceType,
    createdAt: resource.created_at,
  };
}

function getBaseName(publicId: string): string {
  const lastSegment = publicId.split('/').pop() ?? publicId;
  return lastSegment.toLowerCase();
}

function getSearchableName(publicId: string): string {
  return publicId.toLowerCase().replace(/[\s_\-\/]+/g, '');
}

function hasAny(text: string, tokens: string[]): boolean {
  return tokens.some((token) => text.includes(token));
}

function suitNumber(publicId: string): number {
  const name = getBaseName(publicId);
  const match = name.match(/suit[-_\s]?(\d+)/i);
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

async function listResources(resourceType: 'image' | 'video', prefix?: string) {
  const resources: any[] = [];
  let nextCursor: string | undefined;

  do {
    const params: any = {
      type: 'upload',
      max_results: 500,
      resource_type: resourceType,
      next_cursor: nextCursor,
    };
    
    // Only add prefix if provided
    if (prefix) {
      params.prefix = prefix;
    }
    
    const result = await cloudinary.api.resources(params);
    resources.push(...(result.resources ?? []));
    nextCursor = result.next_cursor;
  } while (nextCursor);

  console.log(`📁 Fetched ${resources.length} ${resourceType} resources${prefix ? ` from '${prefix}'` : ' (all folders)'}`);
  
  // Debug: Log first few public IDs to see folder structure
  if (resources.length > 0) {
    console.log('📸 Sample public IDs:', resources.slice(0, 5).map(r => r.public_id));
  }

  return resources;
}

export async function getDynamicMediaLibrary(): Promise<CloudinaryMediaPayload> {
  const sourcePrefixes = ['sappura'];

  // Fetch all resources since they are at root level
  console.log('🔍 Fetching all Cloudinary resources...');
  const imageResources = await listResources('image');
  const videoResources = await listResources('video');

  const allAssets = [
    ...imageResources.map((resource) => toAsset(resource, 'image')),
    ...videoResources.map((resource) => toAsset(resource, 'video')),
  ]
  // Filter to exclude unwanted projects (humsafar, etc.) but keep Sappura files
  .filter((asset) => {
    const publicId = asset.publicId.toLowerCase();
    
    // Exclude these patterns (case-insensitive)
    const excludePatterns = [
      'humsafar',     // Humsafar project
      'afghani',      // Afghani project
      'baba',         // Baba project
      'zeesy',        // Zeesy project
      'test',         // Test files
      'sample',       // Sample files
      'demo',         // Demo files
      'cld-sample',   // Cloudinary samples
      'samples/',     // Samples folder
      'temp',         // Temporary files
      'draft',        // Draft files
    ];
    
    const shouldExclude = excludePatterns.some(pattern => publicId.includes(pattern));
    
    if (shouldExclude) {
      console.log('🚫 Filtered out:', asset.publicId);
      return false;
    }
    
    // Accept all other files (Sappura jewelry, clothing, accessories, etc.)
    return true;
  })
  .sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bDate - aDate;
  });

  console.log(`✅ Total Sappura assets: ${allAssets.length}`);

  const images = allAssets.filter((asset) => asset.resourceType === 'image');
  const videos = allAssets.filter((asset) => asset.resourceType === 'video');

  const logo =
    images.find((asset) => hasAny(getSearchableName(asset.publicId), ['logo1', 'logo'])) ?? null;

  const suits = images
    .filter((asset) => hasAny(getSearchableName(asset.publicId), ['suit']))
    .sort((a, b) => suitNumber(a.publicId) - suitNumber(b.publicId));

  const newCollection = images.filter((asset) => {
    const name = getSearchableName(asset.publicId);
    return hasAny(name, ['newcollection', 'newarrival', 'newdrop', 'latestcollection']);
  });

  const bangles = images.filter((asset) => {
    const name = getSearchableName(asset.publicId);
    return hasAny(name, ['bangle', 'bangles', 'bandla', 'bandlas', 'bracelet', 'bracelets', 'kangan', 'churi', 'choori']);
  });

  const anklets = images.filter((asset) => {
    const name = getSearchableName(asset.publicId);
    return hasAny(name, ['anklet', 'anklets', 'ankle', 'ankles', 'payal', 'paayal']);
  });

  const earrings = images.filter((asset) => {
    const name = getSearchableName(asset.publicId);
    return hasAny(name, ['earring', 'earrings', 'earing', 'jhumka', 'jhumki', 'tops']);
  });

  const makeup = images.filter((asset) => {
    const name = getSearchableName(asset.publicId);
    return hasAny(name, ['makeup', 'cosmetic', 'lipstick', 'mascara', 'beauty']);
  });

  return {
    logo,
    suits,
    categories: {
      newCollection,
      bangles,
      anklets,
      earrings,
      makeup,
    },
    videos,
    allAssets,
    sourcePrefixes,
  };
}

/**
 * Upload image to Cloudinary
 * @param file - File path or buffer
 * @param folder - Cloudinary folder name
 * @returns Upload result with URL
 */
export async function uploadImage(file: string, folder: string = 'sappura/products') {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 * @returns Deletion result
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * Get optimized image URL from Cloudinary
 * @param publicId - Cloudinary public ID
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  }
) {
  const { width, height, crop = 'fill', quality = 'auto' } = options || {};

  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop },
      { quality },
      { fetch_format: 'auto' },
    ],
  });
}

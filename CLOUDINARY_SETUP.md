# Cloudinary Integration - Sappura E-Commerce

## 📸 Overview

Cloudinary is now fully integrated into your Sappura project for managing product images with automatic optimization, transformation, and CDN delivery.

## ✅ Installation Complete

The following packages have been installed:
- `cloudinary` - Official Cloudinary SDK
- `next-cloudinary` - Next.js integration for Cloudinary

## 🔧 Configuration

### Environment Variables (.env.local)

Your Cloudinary credentials are configured:

```env
# Server-side only (secure)
CLOUDINARY_CLOUD_NAME=Sappura
CLOUDINARY_API_KEY=596569699175142
CLOUDINARY_API_SECRET=mD30EUXyh6sqwszB-RhjhvQlpWY
CLOUDINARY_URL=cloudinary://596569699175142:mD30EUXyh6sqwszB-RhjhvQlpWY@Sappura

# Client-side accessible
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=Sappura
NEXT_PUBLIC_CLOUDINARY_API_KEY=596569699175142
```

## 📁 Project Structure

```
src/
├── lib/
│   └── cloudinary.ts            # Cloudinary configuration & utilities
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts         # Upload API endpoint
│   └── test-cloudinary/
│       └── page.tsx             # Test page for uploads
└── components/
    └── admin/
        └── ImageUpload.tsx      # Reusable upload component
```

## 🚀 Usage

### 1. Test the Integration

Visit the test page to upload images and verify everything works:

```
http://localhost:3000/test-cloudinary
```

### 2. Using the ImageUpload Component

```tsx
import ImageUpload from '@/components/admin/ImageUpload';

function ProductForm() {
  const handleUploadComplete = (images) => {
    console.log('Uploaded images:', images);
    // Save image URLs to your product data
  };

  return (
    <ImageUpload
      onUploadComplete={handleUploadComplete}
      maxFiles={5}
      folder="sappura/products"
    />
  );
}
```

### 3. Displaying Images with Next-Cloudinary

```tsx
import { CldImage } from 'next-cloudinary';

function ProductCard({ product }) {
  return (
    <CldImage
      src={product.imagePublicId}
      alt={product.name}
      width={500}
      height={500}
      crop="fill"
      gravity="auto"
    />
  );
}
```

### 4. Server-Side Upload (API Routes)

```typescript
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');
  
  const result = await uploadImage(
    fileBuffer,
    'sappura/products'
  );
  
  if (result.success) {
    // Save result.url to database
  }
}
```

## 🎨 Features

### Automatic Image Optimization
- **Auto Format**: Automatically serves WebP/AVIF for modern browsers
- **Auto Quality**: Intelligent quality optimization
- **Lazy Loading**: Built-in lazy loading support
- **Responsive Images**: Automatic srcset generation

### Image Transformations
Images are automatically optimized with:
- Maximum dimensions: 1000×1000px
- Quality: Auto (best quality/size ratio)
- Format: Auto (best format for browser)

### Upload Features
- ✅ Drag & drop support
- ✅ Multiple file upload
- ✅ Progress indicators
- ✅ Delete functionality
- ✅ Preview thumbnails
- ✅ File validation
- ✅ Max file limits

## 📋 API Endpoints

### POST /api/upload
Upload images to Cloudinary

**Request:**
```typescript
FormData {
  file: File,
  folder?: string
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/sappura/image/upload/...",
  "publicId": "sappura/products/abc123",
  "width": 1000,
  "height": 1000
}
```

### DELETE /api/upload
Delete image from Cloudinary

**Request:**
```json
{
  "publicId": "sappura/products/abc123"
}
```

**Response:**
```json
{
  "success": true
}
```

## 🛠️ Utility Functions

### uploadImage(file, folder)
Upload image to Cloudinary with automatic optimization

### deleteImage(publicId)
Delete image from Cloudinary

### getOptimizedImageUrl(publicId, options)
Get optimized image URL with transformations

## 📂 Folder Structure in Cloudinary

Recommended folder organization:
```
sappura/
├── products/          # Product images
├── categories/        # Category banners
├── collections/       # Collection images
├── banners/          # Homepage banners
├── reviews/          # Customer review images
└── test/             # Test uploads
```

## 🔒 Security

- ✅ API Secret is server-side only (not exposed to client)
- ✅ Upload API validates file types
- ✅ Files are uploaded to specific folders
- ✅ Public access controlled via Cloudinary settings

## 💡 Best Practices

1. **Use unique public IDs**: Include product ID or timestamp
2. **Optimize before upload**: Cloudinary handles it, but pre-optimization saves bandwidth
3. **Use folders**: Organize images by type/category
4. **Delete unused images**: Keep storage clean
5. **Use transformations**: Let Cloudinary optimize on-the-fly

## 🎯 Next Steps

1. ✅ Test upload at `/test-cloudinary`
2. 🔲 Integrate into product management
3. 🔲 Update product data structure to store Cloudinary URLs
4. 🔲 Replace static image placeholders with real uploads
5. 🔲 Build admin panel for product management

## 📊 Cloudinary Dashboard

Access your Cloudinary account:
- **Dashboard**: https://cloudinary.com/console
- **Media Library**: View all uploaded images
- **Analytics**: Track usage and bandwidth
- **Settings**: Configure upload presets and transformations

## 🆘 Troubleshooting

### Upload fails
- Check `.env.local` has correct credentials
- Verify file size is under 10MB
- Check file format is supported (JPG, PNG, WEBP)

### Images not displaying
- Verify public ID is correct
- Check Cloudinary dashboard for the image
- Ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set

### Slow uploads
- Large files take longer
- Check your internet connection
- Consider resizing images client-side first

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next-Cloudinary Docs](https://next.cloudinary.dev/)
- [Image Optimization Guide](https://cloudinary.com/documentation/image_optimization)

---

**Status**: ✅ Fully Configured and Ready to Use

Your Cloudinary integration is complete! Visit `/test-cloudinary` to start uploading images.

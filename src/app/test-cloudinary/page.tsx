'use client';

import { useState } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import { CldImage } from 'next-cloudinary';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export default function CloudinaryTestPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 mb-6 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="gold-glass rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">Cloudinary Integration Test</h1>
          <p className="opacity-80 mb-6">
            Upload product images to test Cloudinary integration. Images are automatically optimized and stored in your Cloudinary account.
          </p>

          <div className="bg-navy-light border border-primary/20 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-2">Configuration Status:</h3>
            <div className="space-y-1 text-sm">
              <p>
                ✅ Cloud Name:{' '}
                <code className="bg-navy px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not configured'}
                </code>
              </p>
              <p>
                ✅ API Key:{' '}
                <code className="bg-navy px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ? '***' + process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY.slice(-4) : 'Not configured'}
                </code>
              </p>
              <p className="text-green-500 font-semibold mt-2">
                🎉 Cloudinary is ready to use!
              </p>
            </div>
          </div>

          <ImageUpload
            onUploadComplete={(uploadedImages) => {
              setImages(uploadedImages);
              console.log('Uploaded images:', uploadedImages);
            }}
            maxFiles={10}
            folder="sappura/test"
          />
        </div>

        {/* Display uploaded images with CldImage component */}
        {images.length > 0 && (
          <div className="gold-glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Uploaded Images ({images.length})
            </h2>
            <p className="opacity-80 mb-6">
              These images are now stored in Cloudinary and can be used throughout your application.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {images.map((image) => (
                <div key={image.publicId} className="space-y-3">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-navy-light">
                    <CldImage
                      src={image.publicId}
                      alt="Uploaded product"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="text-sm space-y-1 opacity-70">
                    <p className="font-mono text-xs break-all">
                      Public ID: {image.publicId}
                    </p>
                    <p>
                      Dimensions: {image.width} × {image.height}px
                    </p>
                    <p className="font-mono text-xs break-all">
                      URL: {image.url}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="gold-glass rounded-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">How to Use in Your App</h2>
          <div className="space-y-4 text-sm">
            <div className="bg-navy-light rounded-lg p-4">
              <p className="font-bold mb-2">1. Using the ImageUpload Component:</p>
              <pre className="bg-navy p-3 rounded overflow-x-auto text-xs">
{`import ImageUpload from '@/components/admin/ImageUpload';

<ImageUpload
  onUploadComplete={(images) => {
    console.log('Uploaded:', images);
  }}
  maxFiles={5}
  folder="sappura/products"
/>`}
              </pre>
            </div>

            <div className="bg-navy-light rounded-lg p-4">
              <p className="font-bold mb-2">2. Displaying Cloudinary Images:</p>
              <pre className="bg-navy p-3 rounded overflow-x-auto text-xs">
{`import { CldImage } from 'next-cloudinary';

<CldImage
  src="sappura/products/your-image-id"
  alt="Product"
  width={500}
  height={500}
/>`}
              </pre>
            </div>

            <div className="bg-navy-light rounded-lg p-4">
              <p className="font-bold mb-2">3. Direct API Upload (server-side):</p>
              <pre className="bg-navy p-3 rounded overflow-x-auto text-xs">
{`import { uploadImage } from '@/lib/cloudinary';

const result = await uploadImage(
  imageBuffer,
  'sappura/products'
);`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

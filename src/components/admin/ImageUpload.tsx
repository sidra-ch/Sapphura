'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Check, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

interface ImageUploadProps {
  onUploadComplete?: (images: UploadedImage[]) => void;
  maxFiles?: number;
  folder?: string;
}

export default function ImageUpload({ 
  onUploadComplete, 
  maxFiles = 5,
  folder = 'sappura/products'
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - uploadedImages.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Upload failed');
        }

        return {
          url: data.url,
          publicId: data.publicId,
          width: data.width,
          height: data.height,
        };
      });

      const results = await Promise.all(uploadPromises);
      const newImages = [...uploadedImages, ...results];
      
      setUploadedImages(newImages);
      onUploadComplete?.(newImages);
      
      toast.success(`${results.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (publicId: string) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Delete failed');
      }

      const newImages = uploadedImages.filter((img) => img.publicId !== publicId);
      setUploadedImages(newImages);
      onUploadComplete?.(newImages);
      
      toast.success('Image removed successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-primary bg-primary/10 scale-105'
            : 'border-primary/30 hover:border-primary hover:bg-primary/5'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="font-semibold">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-primary" />
            <div>
              <p className="font-semibold mb-1">Click to upload or drag and drop</p>
              <p className="text-sm opacity-70">
                PNG, JPG, WEBP up to 10MB ({uploadedImages.length}/{maxFiles} uploaded)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {uploadedImages.map((image) => (
            <div
              key={image.publicId}
              className="relative aspect-square gold-glass rounded-lg overflow-hidden group"
            >
              <Image
                src={image.url}
                alt="Uploaded"
                fill
                className="object-cover"
              />
              
              {/* Success Badge */}
              <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(image.publicId)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs truncate">{image.width} × {image.height}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {uploadedImages.length === 0 && !uploading && (
        <div className="text-center py-8 opacity-50">
          <ImageIcon className="w-16 h-16 mx-auto mb-3" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}

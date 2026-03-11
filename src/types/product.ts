export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  
  // Legacy fields - kept for backward compatibility
  images: string[];
  video?: string;
  
  // New media array structure
  media?: ProductMedia[];
  
  // Direct media URLs from database
  mediaUrls?: string[];
  
  sizes?: string[];
  colors?: {
    name: string;
    hex: string;
  }[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  features?: string[];
}

export interface ProductMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string; // For video thumbnails
  alt?: string; // Optional alt text for images
}

export interface Review {
  id: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

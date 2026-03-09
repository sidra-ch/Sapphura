export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
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

export interface Review {
  id: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

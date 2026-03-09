import { Product, Review } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    slug: 'bridal-necklace-set',
    name: 'Bridal Necklace Set',
    description: 'A stunning 18k gold-plated necklace featuring intricate traditional Pakistani design. Perfect for weddings and formal occasions. Handcrafted with attention to detail, this piece combines modern elegance with traditional craftsmanship.',
    price: 4999,
    originalPrice: 6999,
    category: 'Necklaces',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    ],
    sizes: ['Small', 'Medium', 'Large'],
    colors: [
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Rose Gold', hex: '#B76E79' },
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 127,
    features: [
      '18k Gold Plated',
      'Handcrafted Design',
      'Adjustable Chain Length',
      'Anti-Tarnish Coating',
      'Comes with Beautiful Gift Box',
    ],
  },
  {
    id: '2',
    slug: 'pearl-drop-earrings',
    name: 'Designer Earrings',
    description: 'Classic pearl drop earrings with gold-plated hooks. These timeless earrings feature genuine freshwater pearls that add elegance to any outfit. Lightweight and comfortable for all-day wear.',
    price: 2499,
    originalPrice: 3499,
    category: 'Earrings',
    images: [
      'https://images.unsplash.com/photo-1596944924591-4375e59fae5a?w=800',
      'https://images.unsplash.com/photo-1535556116002-6281ff3e9f99?w=800',
      'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=800',
    ],
    colors: [
      { name: 'White Pearl', hex: '#F5F5F5' },
      { name: 'Black Pearl', hex: '#2C2C2C' },
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 98,
    features: [
      'Genuine Freshwater Pearls',
      'Gold Plated Hooks',
      'Hypoallergenic',
      'Lightweight Design',
      'Gift Wrapped',
    ],
  },
  {
    id: '3',
    slug: 'kundan-bridal-set',
    name: 'Kundan Bridal Set',
    description: 'Complete bridal jewelry set featuring exquisite Kundan work. This luxurious set includes necklace, earrings, maang tikka, and matching bangles. Perfect for your special day with traditional Pakistani craftsmanship.',
    price: 15999,
    originalPrice: 22999,
    category: 'Bridal Sets',
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800',
      'https://images.unsplash.com/photo-1611622537396-0b2b7968455a?w=800',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    ],
    sizes: ['Standard'],
    colors: [
      { name: 'Red & Gold', hex: '#DC143C' },
      { name: 'Green & Gold', hex: '#228B22' },
    ],
    inStock: true,
    rating: 5.0,
    reviewCount: 45,
    features: [
      'Complete Bridal Set',
      'Authentic Kundan Work',
      'Includes Necklace, Earrings, Tikka & Bangles',
      'Premium Quality Stones',
      'Luxury Packaging',
    ],
  },
  {
    id: '4',
    slug: 'luxury-bangles-set',
    name: 'Luxury Bangles Set',
    description: 'Delicate sterling silver bangles with customizable charms. Add your favorite charms to create a personalized piece. Features secure clasp and adjustable design.',
    price: 1999,
    category: 'Bangles',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    ],
    sizes: ['6 inch', '7 inch', '8 inch'],
    colors: [
      { name: 'Silver', hex: '#C0C0C0' },
    ],
    inStock: true,
    rating: 4.6,
    reviewCount: 82,
    features: [
      'Sterling Silver 925',
      'Adjustable Length',
      'Customizable Charms',
      'Secure Clasp',
      'Gift Ready',
    ],
  },
  {
    id: '5',
    slug: 'embroidered-suit',
    name: 'Embroidered Suit',
    description: 'Stunning embroidered suit with intricate work. Perfect for formal occasions and weddings. Features beautiful traditional Pakistani design with modern styling. A statement piece for your wardrobe.',
    price: 3499,
    originalPrice: 4999,
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Maroon', hex: '#800000' },
      { name: 'Emerald Green', hex: '#50C878' },
      { name: 'Royal Blue', hex: '#0F52BA' },
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 64,
    features: [
      'Premium Embroidery Work',
      'Traditional Pakistani Design',
      'Comfortable Fabric',
      'Multiple Sizes Available',
      'Perfect for Weddings',
    ],
  },
  {
    id: '6',
    slug: 'accessories-collection',
    name: 'Accessories Collection',
    description: 'Traditional Pakistani accessories with antique finish. Features intricate meenakari work and pearl embellishments. Perfect for cultural events and festive occasions.',
    price: 2999,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1535556116002-6281ff3e9f99?w=800',
      'https://images.unsplash.com/photo-1596944924591-4375e59fae5a?w=800',
    ],
    colors: [
      { name: 'Antique Gold', hex: '#C9B037' },
      { name: 'Oxidized Silver', hex: '#71797E' },
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 91,
    features: [
      'Traditional Design',
      'Meenakari Work',
      'Pearl Embellishments',
      'Premium Quality',
      'Antique Finish',
    ],
  },
  {
    id: '7',
    slug: 'luxury-lawn-suit',
    name: 'Luxury Lawn Suit',
    description: 'Premium quality lawn suit with beautiful prints and embroidery. Perfect for summer occasions. Soft, breathable fabric with elegant design.',
    price: 3999,
    originalPrice: 5499,
    category: 'Clothing',
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=800',
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pink', hex: '#FFC0CB' },
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Mint Green', hex: '#98FF98' },
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 156,
    features: [
      'Premium Lawn Fabric',
      'Beautiful Embroidery',
      'Breathable Material',
      'Summer Collection',
      'Complete 3-Piece Set',
    ],
  },
  {
    id: '8',
    slug: 'gold-plated-bangles',
    name: 'Gold Plated Bangles',
    description: 'Set of 6 beautiful gold-plated bangles with intricate design. Perfect for parties and special occasions. Adds elegance to any outfit.',
    price: 2799,
    originalPrice: 3999,
    category: 'Bangles',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
    ],
    sizes: ['2.4', '2.6', '2.8'],
    colors: [
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Rose Gold', hex: '#B76E79' },
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 203,
    features: [
      'Set of 6 Bangles',
      'Gold Plated Finish',
      'Intricate Design',
      'Multiple Sizes',
      'Anti-Tarnish',
    ],
  },
];

export const reviews: { [productId: string]: Review[] } = {
  '1': [
    {
      id: '1',
      customerName: 'Ayesha Khan',
      rating: 5,
      comment: 'Absolutely gorgeous! The quality is amazing and it looks even better in person. Highly recommend!',
      createdAt: '2024-02-15',
    },
    {
      id: '2',
      customerName: 'Sara Ahmed',
      rating: 4,
      comment: 'Beautiful necklace, very well made. The gold plating is excellent. Would buy again.',
      createdAt: '2024-02-10',
    },
    {
      id: '3',
      customerName: 'Fatima Ali',
      rating: 5,
      comment: 'Perfect for my wedding! Got so many compliments. The packaging was also beautiful.',
      createdAt: '2024-01-28',
    },
  ],
  '2': [
    {
      id: '4',
      customerName: 'Zainab Hassan',
      rating: 5,
      comment: 'Love these earrings! So elegant and comfortable to wear all day.',
      createdAt: '2024-02-20',
    },
  ],
  '3': [
    {
      id: '5',
      customerName: 'Hina Malik',
      rating: 5,
      comment: 'This bridal set is absolutely stunning! Worth every penny. The Kundan work is exquisite.',
      createdAt: '2024-01-15',
    },
  ],
};

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getRelatedProducts(productId: string, category: string, limit = 4): Product[] {
  return products
    .filter(p => p.id !== productId && p.category === category)
    .slice(0, limit);
}

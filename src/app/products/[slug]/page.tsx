'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw, Check, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Product, Review } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { CloudinaryImageAsset, getMappedCloudinaryImage } from '@/lib/product-image-map';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import { useWishlistStore } from '@/store/wishlistStore';

export default function ProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const addWishlistItem = useWishlistStore((state) => state.addItem)
  const removeWishlistItem = useWishlistStore((state) => state.removeItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)

  const from = searchParams.get('from')
  const mobileBackHref = from === 'admin-products'
    ? '/admin/products'
    : from === 'wishlist'
      ? '/wishlist'
      : '/collections'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();
        
        if (data.success && data.product) {
          const productData = data.product

          try {
            const cloudinaryResponse = await fetch('/api/cloudinary/media', { cache: 'no-store' })
            const cloudinaryJson = await cloudinaryResponse.json()

            if (cloudinaryJson.success && Array.isArray(cloudinaryJson.media?.allAssets)) {
              const assets: CloudinaryImageAsset[] = cloudinaryJson.media.allAssets
                .filter((asset: { resourceType: string }) => asset.resourceType === 'image')
                .map((asset: { publicId: string; secureUrl: string }) => ({
                  publicId: asset.publicId,
                  secureUrl: asset.secureUrl,
                }))

              const matchedImage = getMappedCloudinaryImage(productData.slug, productData.name, assets)
              if (matchedImage) {
                productData.images = [matchedImage, ...(productData.images || []).filter((img: string) => img !== matchedImage)]
              }
            }
          } catch {
            // Keep product images as-is when Cloudinary request fails.
          }

          setProduct(productData);
          setIsFavorite(isInWishlist(productData.id))
          setRelatedProducts(data.relatedProducts || []);
          setProductReviews(data.product.reviews || []);
          
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, isInWishlist]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-2xl font-bold text-primary">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/collections" className="gold-btn px-6 py-3 rounded-lg font-semibold">
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    });
    toast.success(`${product.name} added to cart!`, {
      icon: '🛍️',
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return

    const currentlyInWishlist = isInWishlist(product.id)

    if (currentlyInWishlist) {
      removeWishlistItem(product.id)
      setIsFavorite(false)
      toast.success('Removed from wishlist')
      return
    }

    addWishlistItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.images[0] || '',
      slug: product.slug,
    })
    setIsFavorite(true)
    toast.success('Added to wishlist')
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:hidden">
          <Link
            href={mobileBackHref}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections' },
            { label: product.name },
          ]}
        />

        {/* Product Detail Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div 
              className="relative aspect-square gold-glass rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-navy/80 hover:bg-navy p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-navy/80 hover:bg-navy p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {discount}% OFF
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 bg-navy/80 hover:bg-navy p-3 rounded-full transition-colors"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </motion.div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-primary scale-105' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-semibold">{product.rating}</span>
                </div>
                <span className="text-sm opacity-70">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary">Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-2xl line-through opacity-50">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-semibold">In Stock</span>
                </>
              ) : (
                <span className="text-red-500 font-semibold">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <p className="text-lg leading-relaxed opacity-90">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Size:</h3>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary/10 scale-105'
                          : 'border-primary/30 hover:border-primary/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Color:</h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-primary bg-primary/10 scale-105'
                          : 'border-primary/30 hover:border-primary/50'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity:</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-navy-light hover:bg-navy-elevated px-4 py-2 rounded-lg font-bold transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-navy-light hover:bg-navy-elevated px-4 py-2 rounded-lg font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="gold-btn w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart
            </button>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="gold-glass rounded-xl p-6 space-y-3">
                <h3 className="font-bold text-lg mb-4">Product Features:</h3>
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Service Info */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-primary/20">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="text-xs opacity-70">On orders over Rs. 3000</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-semibold">Secure Payment</p>
                <p className="text-xs opacity-70">100% Protected</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-semibold">Easy Returns</p>
                <p className="text-xs opacity-70">7 Days Return</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {productReviews.length > 0 && (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productReviews.map((review) => (
                <div key={review.id} className="gold-glass rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{review.customerName}</h4>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-primary text-primary' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="opacity-90 mb-2">{review.comment}</p>
                  <p className="text-xs opacity-60">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="gold-glass rounded-xl overflow-hidden group hover:scale-105 transition-transform"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        Rs. {relatedProduct.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

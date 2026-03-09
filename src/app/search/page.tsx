'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import ProductCard from '@/components/product/ProductCard';

const priceRanges = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under Rs. 2000', min: 0, max: 2000 },
  { label: 'Rs. 2000 - 5000', min: 2000, max: 5000 },
  { label: 'Rs. 5000 - 10000', min: 5000, max: 10000 },
  { label: 'Above Rs. 10000', min: 10000, max: Infinity },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const addItem = useCartStore((state) => state.addItem);

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success && Array.isArray(data.products)) {
          setAllProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(allProducts.map(p => p.category)))];

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    let results = allProducts;

    // Apply search filter
    if (searchTerm) {
      results = results.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      results = results.filter((product) => product.category === selectedCategory);
    }

    // Apply price range filter
    if (priceRange !== 'All') {
      const range = priceRanges.find(r => r.label === priceRange);
      if (range) {
        results = results.filter((product) => 
          product.price >= range.min && product.price < range.max
        );
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // featured - keep original order
        break;
    }

    setFilteredProducts(results);
  }, [searchTerm, selectedCategory, priceRange, sortBy, allProducts]);

  const handleAddToCart = (productId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange('All');
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'All Products'}
          </h1>
          <p className="text-lg opacity-80">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Filters Bar */}
        <div className="gold-glass rounded-xl p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden gold-btn px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className={`${showFilters ? 'flex' : 'hidden lg:flex'} flex-wrap gap-4 w-full lg:w-auto`}>
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg bg-navy-light border border-primary/30 focus:border-primary outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Price Range Filter */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 rounded-lg bg-navy-light border border-primary/30 focus:border-primary outline-none"
              >
                {priceRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-navy-light border border-primary/30 focus:border-primary outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* Clear Filters */}
              {(selectedCategory !== 'All' || priceRange !== 'All' || sortBy !== 'featured') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg bg-red-600/20 border border-red-600/50 hover:bg-red-600/30 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  image={product.images[0]}
                  price={product.price}
                  rating={product.rating || 0}
                  originalPrice={product.originalPrice}
                  onAddToCart={handleAddToCart}
                  showAnimations={false}
                  showWishlistButton={false}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">No products found</h2>
            <p className="opacity-70 mb-6">
              Try different search terms or clear your filters
            </p>
            <button
              onClick={clearFilters}
              className="gold-btn px-6 py-3 rounded-lg font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-16 px-4" />}>
      <SearchPageContent />
    </Suspense>
  );
}

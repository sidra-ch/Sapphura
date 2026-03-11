'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import Loader from '@/components/ui/Loader';
import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  // ...existing code...
  const [page, setPage] = useState(1);
  const [limit] = useState(16); // Products per page
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    return res.json();
  };

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sort: sortOrder,
    ...(debouncedSearch && { search: debouncedSearch })
  });
  const { data, error, isValidating } = useSWR(`/api/products/catalog?${queryParams}`, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
  });

  const products = data?.products || [];
  const totalCount = data?.total || 0;
  const loading = isValidating && !products.length;

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">All Products</h1>
          <p className="text-primary/70 max-w-2xl mx-auto">
            Browse our complete collection of elegant, stitched & unstitched outfits and luxury jewelry.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-navy-light/50 p-4 rounded-xl border border-primary/20">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-navy border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-primary placeholder:text-primary/30"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="items-center gap-2 text-sm text-primary/70 sm:flex hidden">
              <Filter className="w-4 h-4" />
              <span>{totalCount} Items</span>
            </div>

            {/* Sorting */}
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1); // Back to start on resort
              }}
              className="w-full md:w-auto px-4 py-2 bg-navy border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-primary cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Clean Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                        page === num
                          ? 'bg-primary text-navy'
                          : 'border border-primary/30 text-primary hover:bg-primary/10'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 gold-glass rounded-2xl">
            <Search className="w-16 h-16 mx-auto mb-4 text-primary/30" />
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-primary/70">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

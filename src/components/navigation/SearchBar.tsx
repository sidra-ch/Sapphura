'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useDebounce } from '@/hooks/useDebounce'

type SearchBarProps = {
  isOpen: boolean
  query: string
  onQueryChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onClose?: () => void
}

type SearchResult = {
  id: string
  name: string
  slug: string
  price: number
  originalPrice: number | null
  images: string[]
  category: string
}

export default function SearchBar({
  isOpen,
  query,
  onQueryChange,
  onSubmit,
  onKeyDown,
  onClose,
}: SearchBarProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        const data = await res.json()
        if (data.success) {
          setResults(data.products)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (onClose) onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 relative"
        >
          <form onSubmit={onSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search for luxury jewellery..."
                className="w-full rounded-lg border border-primary/40 bg-navy-light px-4 py-2 text-primary placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary/60 w-5 h-5" />
              )}
            </div>
            <button
              type="submit"
              className="gold-btn flex items-center gap-2 rounded-lg px-6 py-2 font-semibold"
            >
              <Search size={18} />
              Search
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center rounded-lg border border-primary/40 px-3 py-2 text-primary hover:bg-primary/10 transition-colors"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {query.length >= 2 && (isLoading || results.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-navy border border-primary/20 rounded-lg shadow-2xl z-50 max-h-[400px] overflow-y-auto"
              >
                {results.length > 0 ? (
                  <ul className="py-2">
                    {results.map((product) => (
                      <li key={product.id} className="border-b border-primary/10 last:border-0 hover:bg-primary/5 transition-colors">
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            if (onClose) onClose()
                            onQueryChange('')
                          }}
                          className="flex items-center gap-4 px-4 py-3"
                        >
                          <div className="relative w-12 h-12 flex-shrink-0 bg-navy-light rounded overflow-hidden">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/10" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="text-primary font-medium truncate">{product.name}</h4>
                            <p className="text-primary/60 text-xs capitalize">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-primary font-semibold">Rs. {product.price.toLocaleString()}</p>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <p className="text-primary/60 text-xs line-through">
                                Rs. {product.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li className="p-3 text-center border-t border-primary/20 bg-primary/5">
                      <button
                        onClick={onSubmit as any}
                        className="text-primary font-medium text-sm hover:underline"
                      >
                        View all search results for &quot;{query}&quot;
                      </button>
                    </li>
                  </ul>
                ) : !isLoading && (
                  <div className="p-6 text-center text-primary/70">
                    No products found matching &quot;{query}&quot;.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'

type SearchBarProps = {
  isOpen: boolean
  query: string
  onQueryChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function SearchBar({
  isOpen,
  query,
  onQueryChange,
  onSubmit,
  onKeyDown,
}: SearchBarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4"
        >
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search for jewellery..."
              className="flex-1 rounded-lg border border-primary/40 bg-navy-light px-4 py-2 text-primary placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              type="submit"
              className="gold-btn flex items-center gap-2 rounded-lg px-6 py-2 font-semibold"
            >
              <Search size={18} />
              Search
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

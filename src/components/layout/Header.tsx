'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, Menu, Search, User, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import Navbar from '@/components/navigation/Navbar'
import MobileMenu from '@/components/navigation/MobileMenu'
import SearchBar from '@/components/navigation/SearchBar'
import Tooltip from '@/components/ui/Tooltip'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const cartItems = useCartStore((state) => state.items)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/pages/about-us' },
    { name: 'Contact', href: '/pages/contact' },
  ]

  const categoryLinks = [
    { name: 'Bridal', href: '/collections/bridal-jewellery-sets' },
    { name: 'Bangles', href: '/collections/bangles-for-women' },
    { name: 'Earrings', href: '/collections/earrings' },
    { name: 'Necklace', href: '/collections/necklace-sets' },
    { name: 'All Products', href: '/collections/all-products' },
  ]

  const mobileLinks = [...navLinks, ...categoryLinks]

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-primary/20 bg-navy shadow-lg shadow-primary/20'
          : 'border-b border-primary/10 bg-navy/95 backdrop-blur-sm'
      }`}
    >
      <div className="bg-primary px-4 py-2 text-center text-sm font-semibold text-navy">
        <p>Free Shipping on Orders Over PKR 3,000 | Cash on Delivery Available</p>
      </div>

      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <h1 className="text-2xl font-bold tracking-[0.14em] text-primary md:text-3xl">SAPPHURA</h1>
              <p className="text-xs text-primary/80">Artificial Jewellery</p>
            </motion.div>
          </Link>

          <Navbar
            links={navLinks}
            categories={categoryLinks}
            isMegaOpen={isMegaOpen}
            onMegaEnter={() => setIsMegaOpen(true)}
            onMegaLeave={() => setIsMegaOpen(false)}
          />

          <div className="flex items-center space-x-4">
            <Tooltip label="Search">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="rounded-full p-2 text-primary transition-colors hover:bg-navy-light"
              >
                <Search size={20} />
              </button>
            </Tooltip>

            <Tooltip label="Wishlist">
              <Link href="/wishlist" className="rounded-full p-2 text-primary transition-colors hover:bg-navy-light">
                <Heart size={20} />
              </Link>
            </Tooltip>

            <Tooltip label="Account">
              <Link href="/account" className="rounded-full p-2 text-primary transition-colors hover:bg-navy-light">
                <User size={20} />
              </Link>
            </Tooltip>

            <Tooltip label={`Cart (${cartItems.length})`}>
              <Link href="/cart" className="relative rounded-full p-2 text-primary transition-colors hover:bg-navy-light">
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-navy">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </Tooltip>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 text-primary transition-colors hover:bg-navy-light lg:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        <SearchBar
          isOpen={isSearchOpen}
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSubmit={handleSearch}
          onKeyDown={handleSearchKeyDown}
        />
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        links={mobileLinks}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  )
}

export default Header

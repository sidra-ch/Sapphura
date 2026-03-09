'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

type NavLink = {
  name: string
  href: string
}

type MobileMenuProps = {
  isOpen: boolean
  links: NavLink[]
  onClose: () => void
}

export default function MobileMenu({ isOpen, links, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          />

          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 right-0 z-50 h-full w-64 border-l border-primary/25 bg-navy shadow-2xl lg:hidden"
          >
            <div className="gold-glass h-full p-6">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-primary hover:bg-navy-light"
              >
                <X size={24} />
              </button>

              <nav className="mt-12 space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className="block py-2 font-medium text-primary/90 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

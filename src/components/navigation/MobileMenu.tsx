'use client'

import { useEffect } from 'react'
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/90 lg:hidden"
          />

          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 right-0 z-[80] h-full w-[86vw] max-w-sm border-l border-primary/30 bg-[#040a18] shadow-2xl lg:hidden"
          >
            <div className="h-full overflow-y-auto p-5">
              <div className="pr-12">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70">Menu</p>
                <h3 className="mt-1 text-lg font-bold text-primary">Sapphura Navigation</h3>
              </div>

              <button
                onClick={onClose}
                className="absolute right-3 top-3 rounded-full border border-primary/30 p-2 text-primary hover:bg-navy-light"
              >
                <X size={24} />
              </button>

              <nav className="mt-6 space-y-3">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className="block rounded-md border border-primary/30 bg-navy px-4 py-3 text-[15px] font-bold text-primary transition-colors hover:bg-navy-light hover:text-primary"
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

'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

type CategoryLink = {
  name: string
  href: string
}

type MegaMenuProps = {
  isOpen: boolean
  links: CategoryLink[]
}

export default function MegaMenu({ isOpen, links }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute left-0 top-full mt-3 w-72 rounded-xl border border-primary/20 bg-navy p-4 shadow-xl"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.1em] text-primary/70">Categories</p>
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-primary/85 transition-colors hover:bg-navy-light hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

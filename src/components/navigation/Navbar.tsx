'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import MegaMenu from './MegaMenu'

type NavLink = {
  name: string
  href: string
}

type NavbarProps = {
  links: NavLink[]
  categories: NavLink[]
  isMegaOpen: boolean
  onMegaEnter: () => void
  onMegaLeave: () => void
}

export default function Navbar({
  links,
  categories,
  isMegaOpen,
  onMegaEnter,
  onMegaLeave,
}: NavbarProps) {
  return (
    <div className="hidden items-center space-x-6 lg:flex">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-sm font-semibold uppercase tracking-[0.12em] text-primary/90 transition-colors hover:text-primary"
        >
          {link.name}
        </Link>
      ))}

      <div
        className="relative"
        onMouseEnter={onMegaEnter}
        onMouseLeave={onMegaLeave}
      >
        <button className="flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.12em] text-primary/90 transition-colors hover:text-primary">
          Categories
          <ChevronDown size={16} />
        </button>
        <MegaMenu isOpen={isMegaOpen} links={categories} />
      </div>
    </div>
  )
}

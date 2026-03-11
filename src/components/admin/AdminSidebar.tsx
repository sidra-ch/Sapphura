import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Tag, Truck } from 'lucide-react'

type AdminSidebarProps = {
  activePath?: string
}

const links = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Campaigns', href: '/admin/campaigns', icon: Tag },
  { label: 'Shipping', href: '/admin/shipping', icon: Truck },
]

export default function AdminSidebar({ activePath }: AdminSidebarProps) {
  const renderLink = (link: (typeof links)[number], compact = false) => {
    const Icon = link.icon
    const isActive = activePath === link.href || activePath?.startsWith(`${link.href}/`)

    return (
      <Link
        key={`${compact ? 'm' : 'd'}-${link.href}`}
        href={link.href}
        className={`flex items-center gap-2 rounded-md py-2 font-medium transition-colors ${
          compact
            ? 'justify-center px-2 text-xs'
            : 'justify-start px-3 text-sm'
        } ${
          isActive
            ? 'bg-primary text-navy'
            : 'text-primary hover:bg-primary/15'
        }`}
      >
        <Icon size={16} />
        <span>{link.label}</span>
      </Link>
    )
  }

  return (
    <aside className="w-full shrink-0 rounded-xl border border-primary/20 bg-navy-light p-3 md:w-64 md:p-4">
      <h3 className="mb-3 text-xs uppercase tracking-[0.1em] text-primary/70 md:mb-4 md:text-sm">Admin</h3>
      <nav className="grid grid-cols-3 gap-2 md:hidden">
        {links.map((link) => renderLink(link, true))}
      </nav>

      <nav className="hidden mt-2 space-y-2 md:block">
        {links.map((link) => renderLink(link))}
      </nav>
    </aside>
  )
}

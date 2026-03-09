import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react'

type AdminSidebarProps = {
  activePath?: string
}

const links = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
]

export default function AdminSidebar({ activePath }: AdminSidebarProps) {
  return (
    <aside className="w-64 shrink-0 rounded-xl border border-primary/20 bg-navy-light p-4">
      <h3 className="mb-4 text-sm uppercase tracking-[0.1em] text-primary/70">Admin</h3>
      <nav className="space-y-2">
        {links.map((link) => (
          (() => {
            const Icon = link.icon
            const isActive = activePath === link.href || activePath?.startsWith(`${link.href}/`)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-navy'
                    : 'text-primary hover:bg-primary/15'
                }`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            )
          })()
        ))}
      </nav>
    </aside>
  )
}

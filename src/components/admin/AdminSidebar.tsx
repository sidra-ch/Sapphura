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
    <aside className="w-full shrink-0 rounded-xl border border-primary/20 bg-navy-light p-3 md:w-64 md:p-4">
      <h3 className="mb-3 text-xs uppercase tracking-[0.1em] text-primary/70 md:mb-4 md:text-sm">Admin</h3>
      <nav className="grid grid-cols-3 gap-2 md:block md:space-y-2">
        {links.map((link) => (
          (() => {
            const Icon = link.icon
            const isActive = activePath === link.href || activePath?.startsWith(`${link.href}/`)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-center gap-2 rounded-md px-2 py-2 text-xs font-medium transition-colors md:justify-start md:px-3 md:text-sm ${
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

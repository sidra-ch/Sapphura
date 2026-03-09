import Link from 'next/link'

type AdminSidebarProps = {
  activePath?: string
}

const links = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Orders', href: '/admin/orders' },
]

export default function AdminSidebar({ activePath }: AdminSidebarProps) {
  return (
    <aside className="rounded-xl border border-primary/20 bg-navy-light p-4">
      <h3 className="mb-4 text-sm uppercase tracking-[0.1em] text-primary/70">Admin</h3>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
              activePath === link.href
                ? 'bg-primary text-navy'
                : 'text-primary/85 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthPage, setIsAuthPage] = useState(false)

  useEffect(() => {
    // Don't show sidebar on login/register/forgot-password pages
    const authPages = ['/admin/login', '/admin/register', '/admin/forgot-password', '/admin']
    setIsAuthPage(authPages.includes(pathname))
  }, [pathname])

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-navy p-4 gap-4">
      <AdminSidebar activePath={pathname} />
      <main className="flex-1 overflow-auto rounded-xl border border-primary/10 bg-navy">
        {children}
      </main>
    </div>
  )
}


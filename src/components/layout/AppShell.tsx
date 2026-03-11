'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppWidget from '@/components/ui/WhatsAppWidget'

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return <main className="min-h-screen relative">{children}</main>
  }

  return (
    <>
      <Header />
      <main className="min-h-screen relative">{children}</main>
      <WhatsAppWidget />
      <Footer />
    </>
  )
}

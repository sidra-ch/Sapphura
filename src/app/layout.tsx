import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import AppShell from '@/components/layout/AppShell'
import { Toaster } from 'react-hot-toast'

const openSans = Open_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  title: 'Sappura - Artificial Jewellery in Pakistan #1 Jewellery Brand',
  description: 'Sappura | Artificial Jewellery in Pakistan #1 Jewellery Brand. Bridal, Bangles, Anklets, Earrings, Necklace, Rings, for Engagement, Marriage & Parties',
  keywords: 'artificial jewellery, jewellery pakistan, bridal jewellery, bangles, earrings, necklace, rings, anklets',
  icons: {
    icon: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004790/logo-1_gzmux1.png',
    apple: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004790/logo-1_gzmux1.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} font-sans antialiased bg-navy text-primary`}>
        <AppShell>{children}</AppShell>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#122852',
              color: '#f4c04d',
              border: '1px solid rgba(230,185,125,0.35)',
            },
          }}
        />
      </body>
    </html>
  )
}

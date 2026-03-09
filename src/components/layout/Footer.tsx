'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-dark text-primary border-t border-primary/20">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">SAPPHURA</h3>
            <p className="text-primary/75 mb-4">
              Pakistan&apos;s #1 Artificial Jewellery Brand. Premium quality jewellery for every occasion.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/sapphura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sapphura Facebook"
                className="hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/sapphura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sapphura Instagram"
                className="hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://x.com/sapphura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sapphura X"
                className="hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@sapphura"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sapphura TikTok"
                className="hover:text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M16.6 5.82a4.77 4.77 0 0 0 2.8.9V9.3a7.3 7.3 0 0 1-2.8-.54v5.05a5.64 5.64 0 1 1-5.64-5.64c.22 0 .44.02.65.04v2.54a3.1 3.1 0 1 0 2.45 3.03V2.5h2.52z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pages/about-us" className="text-primary/75 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pages/contact" className="text-primary/75 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/pages/faqs" className="text-primary/75 hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/pages/shipping-rates" className="text-primary/75 hover:text-primary transition-colors">
                  Shipping Rates
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Policies</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/policies/terms-of-service" className="text-primary/75 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping-policy" className="text-primary/75 hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/refund-policy" className="text-primary/75 hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/pages/exchange-policy" className="text-primary/75 hover:text-primary transition-colors">
                  Exchange Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-primary/75">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Nadir Plaza, 5th Road, Commercial Market, Rawalpindi, Pakistan</span>
              </li>
              <li className="flex items-center space-x-2 text-primary/75">
                <Phone size={18} />
                <span>+923318807247</span>
              </li>
              <li className="flex items-center space-x-2 text-primary/75">
                <Mail size={18} />
                <span>info@sappura.pk</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary/75 text-sm">
              © {currentYear} Sappura. All rights reserved.
            </p>
            <p className="text-primary/75 text-sm mt-2 md:mt-0">
              Crafted with ❤️ in Pakistan
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

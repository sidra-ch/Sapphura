'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function WhatsAppWidget() {
  const pathname = usePathname()
  const [productName, setProductName] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Set this to your actual WhatsApp Number
  const phoneNumber = '923318807247'

  useEffect(() => {
    if (pathname?.includes('/products/')) {
      let name = pathname.split('/').pop() || ''
      name = decodeURIComponent(name).replace(/-/g, ' ')
      // Title Case
      name = name.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
      })
      setProductName(name)
    } else {
      setProductName('')
    }
  }, [pathname])

  const defaultMessage = productName 
    ? `Hi Sappura Team! I'm interested in purchasing: ${productName}`
    : `Hi Sappura Team! I need some help.`

  const handleWhatsAppClick = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const url = isMobile
      ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(defaultMessage)}`
    window.open(url, '_blank')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-72 rounded-2xl bg-navy-light border border-primary/20 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-primary/95 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-primary font-bold text-lg">
              S
            </div>
            <div>
              <h3 className="font-bold text-navy">Sappura Support</h3>
              <p className="text-xs text-navy/80">Typically replies within 1 hour</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="ml-auto text-navy hover:text-white transition"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="p-4 bg-navy relative min-h-[100px]">
             <div className="absolute inset-0 bg-navy/90 backdrop-blur-sm"></div>
             <div className="relative z-10 bg-white/10 p-3 rounded-xl rounded-tl-none text-primary/90 text-sm w-11/12 shadow-sm">
                Hello there! 🤝 How can we help you today?
             </div>
          </div>
          <div className="p-3 bg-navy text-center border-t border-primary/10">
            <button 
              onClick={handleWhatsAppClick}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-2 rounded-xl transition flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Start Chat
            </button>
          </div>
        </div>
      )}
      
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 relative group"
          aria-label="Chat on WhatsApp"
        >
          <span className="absolute right-full mr-4 bg-white text-gray-800 text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow border border-gray-100 hidden md:block">
             Chat with us
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        </button>
      )}
    </div>
  )
}

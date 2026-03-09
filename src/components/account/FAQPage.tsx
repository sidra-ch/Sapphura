'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Mail, Phone, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

type FAQ = {
  id: string
  question: string
  answer: string
  category: 'shipping' | 'returns' | 'payment' | 'products'
}

const faqs: FAQ[] = [
  {
    id: '1',
    category: 'shipping',
    question: 'What are the shipping charges?',
    answer:
      'Free shipping on orders above PKR 2,500. For orders below that, shipping charges are PKR 250 within Karachi and PKR 350 for other cities.',
  },
  {
    id: '2',
    category: 'shipping',
    question: 'How long does delivery take?',
    answer:
      'Standard delivery takes 3-5 business days within Karachi and 5-7 business days for other cities. Express delivery (1-2 days) is available for PKR 500 extra.',
  },
  {
    id: '3',
    category: 'shipping',
    question: 'Can I track my order?',
    answer:
      'Yes! You can track your order from your account dashboard. Click on "Orders" to view the tracking status of your current orders.',
  },
  {
    id: '4',
    category: 'returns',
    question: 'What is your return policy?',
    answer:
      'We offer 14-day returns on most items if they are unused and in original condition. Custom or stitched items cannot be returned. Contact us within 2 days of delivery to initiate a return.',
  },
  {
    id: '5',
    category: 'returns',
    question: 'How do I return an item?',
    answer:
      'Visit your account, go to Orders, find the item you want to return, and click "Request Return". We\'ll provide a prepaid return label. Once we receive and inspect the item, we\'ll process a refund within 5-7 days.',
  },
  {
    id: '6',
    category: 'returns',
    question: 'What if the item is damaged?',
    answer:
      'If you receive a damaged item, please notify us within 24 hours with photos. We\'ll send a replacement immediately or process a full refund at your preference.',
  },
  {
    id: '7',
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer:
      'We accept credit cards (Visa, MasterCard), debit cards, bank transfers, and cash on delivery (COD) for selected areas.',
  },
  {
    id: '8',
    category: 'payment',
    question: 'Is my payment information secure?',
    answer:
      'Yes! We use SSL encryption and PCI-DSS compliance to protect your payment information. Your data is never shared with third parties without consent.',
  },
  {
    id: '9',
    category: 'products',
    question: 'Are your products original?',
    answer:
      'All our products are authentic and sourced directly from designers and manufacturers. We guarantee 100% original quality.',
  },
  {
    id: '10',
    category: 'products',
    question: 'Do you offer customization or stitching?',
    answer:
      'Yes! We offer stitching and customization services for selected items. Add-on charges apply based on the type of customization. Contact us for details.',
  },
]

type FAQItemProps = {
  faq: FAQ
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ faq, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      initial={false}
      className="border border-primary/20 rounded-lg overflow-hidden gold-glass"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
      >
        <span className="font-semibold text-primary text-left">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown size={20} className="text-primary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-primary/20"
          >
            <p className="px-6 py-4 text-primary/80 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

type FAQPageProps = {
  initialCategory?: 'all' | 'shipping' | 'returns' | 'payment' | 'products'
}

export default function FAQPage({ initialCategory = 'all' }: FAQPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<typeof initialCategory>(
    initialCategory
  )
  const [openItems, setOpenItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'returns', label: 'Returns' },
    { id: 'payment', label: 'Payment' },
    { id: 'products', label: 'Products' },
  ] as const

  const filteredFaqs = faqs.filter((faq) => {
    const matchCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleContactClick = () => {
    toast.success('Redirecting to contact form...')
    // window.location.href = '/contact'
  }

  return (
    <main className="min-h-screen bg-navy">
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4 rounded-full bg-primary/20 p-4">
              <HelpCircle size={48} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-primary/70 text-lg max-w-2xl mx-auto">
              Find answers to common questions about shipping, returns, payments, and more.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-navy-light border border-primary/30 text-primary outline-none focus:border-primary placeholder-primary/50 transition-colors"
            />
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex overflow-x-auto gap-2 mb-8 pb-2"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'gold-btn text-navy'
                    : 'border border-primary/30 text-primary hover:bg-primary/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* FAQ Items */}
          <motion.div layout className="space-y-4 mb-12">
            {filteredFaqs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <p className="text-primary/70 text-lg">No FAQs found for your search.</p>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, idx) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <FAQItem
                    faq={faq}
                    isOpen={openItems.includes(faq.id)}
                    onToggle={() => toggleItem(faq.id)}
                  />
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="gold-glass rounded-xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl font-bold text-primary mb-4">Still need help?</h2>
            <p className="text-primary/70 mb-8 max-w-xl mx-auto">
              Can't find the answer you're looking for? Please contact our support team. We're here to help!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Mail className="text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-primary/70">Email</p>
                  <a href="mailto:support@sappura.com" className="font-semibold text-primary hover:underline">
                    support@sappura.com
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Phone className="text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-primary/70">Phone</p>
                  <a href="tel:+923000000000" className="font-semibold text-primary hover:underline">
                    +92 (300) 0000-000
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Globe className="text-primary flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-primary/70">Live Chat</p>
                  <button className="font-semibold text-primary hover:underline">
                    Start Chat
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleContactClick}
              className="gold-btn px-8 py-3 rounded-lg font-semibold"
            >
              Contact Us
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

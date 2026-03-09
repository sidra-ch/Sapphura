'use client'

import { motion } from 'framer-motion'
import { Truck, Shield, CreditCard, HeadphonesIcon } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free delivery on orders above PKR 3,000',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment with SSL encryption',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: CreditCard,
      title: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Dedicated customer support team',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-navy to-navy-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="gold-glass rounded-2xl p-6 transition-all"
            >
              <div className={`${feature.bgColor} ${feature.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-primary/30`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-primary/75">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

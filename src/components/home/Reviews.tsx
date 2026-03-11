'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const Reviews = () => {
  const reviews = [
    {
      name: 'Ayesha Khan',
      rating: 5,
      review: 'Absolutely stunning jewellery! The quality is amazing and the delivery was super fast. Highly recommended!',
      location: 'Rawalpindi',
      product: 'Royal Bridal Set'
    },
    {
      name: 'Fatima Ali',
      rating: 5,
      review: 'Beautiful designs and excellent customer service. I ordered bangles for my sister\'s wedding and everyone loved them!',
      location: 'Lahore',
      product: 'Golden Bangles Set'
    },
    {
      name: 'Sara Ahmed',
      rating: 5,
      review: 'The earrings are exactly as shown in the pictures. Great quality and affordable prices. Will definitely order again!',
      location: 'Islamabad',
      product: 'Diamond Drop Earrings'
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-navy-dark to-navy">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-primary/80 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Sappura for their jewellery needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="gold-glass rounded-2xl p-6 transition-all relative"
            >
              <Quote className="text-primary/20 absolute top-4 right-4" size={48} />
              
              <div className="flex items-center mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-primary/85 mb-6 italic">&quot;{review.review}&quot;</p>

              <div className="border-t pt-4">
                <p className="font-semibold text-lg">{review.name}</p>
                <p className="text-sm text-primary/75">{review.location}</p>
                <p className="text-sm text-primary mt-1">Purchased: {review.product}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Review Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-primary to-primary-light text-navy rounded-2xl p-8 border border-primary/60"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">50,000+</h3>
              <p className="text-navy/90">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">4.9/5.0</h3>
              <p className="text-navy/90">Average Rating</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">15,000+</h3>
              <p className="text-navy/90">5-Star Reviews</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Reviews

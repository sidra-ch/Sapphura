'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Send } from 'lucide-react'
import toast from 'react-hot-toast'

type ReviewFormProps = {
  productId: string
  productName: string
  onSubmit?: (review: { rating: number; title: string; comment: string }) => void
  loading?: boolean
}

export default function ReviewForm({
  productId,
  productName,
  onSubmit,
  loading = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter a review title')
      return
    }

    if (!comment.trim()) {
      toast.error('Please enter a review comment')
      return
    }

    onSubmit?.({ rating, title, comment })
    setSubmitted(true)

    // Reset form after 2 seconds
    setTimeout(() => {
      setRating(0)
      setTitle('')
      setComment('')
      setSubmitted(false)
    }, 2000)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gold-glass rounded-xl p-6 space-y-6"
    >
      <div>
        <h4 className="text-xl font-semibold mb-2">Add Your Review</h4>
        <p className="text-primary/70 text-sm">Share your experience with {productName}</p>
      </div>

      {submitted ? (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-center py-8"
        >
          <div className="inline-block rounded-full bg-primary/20 p-3 text-primary mb-3">
            <Star size={24} className="fill-primary" />
          </div>
          <p className="font-semibold text-primary mb-1">Thank you for your review!</p>
          <p className="text-sm text-primary/70">Your feedback helps us improve</p>
        </motion.div>
      ) : (
        <>
          {/* Rating */}
          <div className="space-y-3">
            <label className="block font-medium">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-colors"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'fill-primary text-primary'
                        : 'text-primary/30'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-primary/70">{rating} of 5 stars selected</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="review-title" className="block font-medium">
              Review Title
            </label>
            <input
              id="review-title"
              type="text"
              placeholder="e.g., Great quality and fast shipping!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={loading}
              className="w-full rounded-lg border border-primary/30 bg-navy px-4 py-3 text-primary placeholder-primary/50 outline-none transition-colors focus:border-primary disabled:opacity-50"
            />
            <p className="text-xs text-primary/60">{title.length}/100</p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="review-comment" className="block font-medium">
              Your Review
            </label>
            <textarea
              id="review-comment"
              placeholder="Share details about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={4}
              disabled={loading}
              className="w-full rounded-lg border border-primary/30 bg-navy px-4 py-3 text-primary placeholder-primary/50 outline-none transition-colors focus:border-primary disabled:opacity-50 resize-none"
            />
            <p className="text-xs text-primary/60">{comment.length}/500</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || rating === 0 || !title.trim() || !comment.trim()}
            className="w-full gold-btn py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Send size={18} />
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </>
      )}
    </motion.form>
  )
}

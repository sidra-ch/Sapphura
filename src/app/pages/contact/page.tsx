'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Failed to send message')
        return
      }

      setSuccess('Message sent successfully. We will contact you soon.')
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy px-4 py-24">
      <div className="container mx-auto max-w-3xl">
        <div className="gold-glass rounded-2xl p-8 md:p-10 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Contact Us</h1>
          <p className="text-primary/70 mb-6">Share your query and our team will respond shortly.</p>

          <div className="mb-6 rounded-xl border border-primary/20 bg-navy-light/60 p-4 text-primary/85 space-y-2">
            <p><strong>Address:</strong> Nadir Plaza, 5th Road, Commercial Market, Rawalpindi</p>
            <p>
              <strong>Contact Number:</strong>{' '}
              <a href="tel:+923318807247" className="text-primary hover:underline">+923318807247</a>
            </p>
            <p>
              <strong>WhatsApp:</strong>{' '}
              <a href="https://wa.me/923318807247" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                +923318807247
              </a>
            </p>
            <p className="text-primary/70 text-sm">
              Use this number for order placement and order verification as well.
            </p>
          </div>

          {success && <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">{success}</div>}
          {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary"
              placeholder="Your email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <textarea
              className="w-full rounded-lg border border-primary/20 bg-navy-light px-4 py-3 text-primary min-h-32"
              placeholder="Type your message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="gold-btn w-full rounded-lg px-6 py-3 font-semibold text-black disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

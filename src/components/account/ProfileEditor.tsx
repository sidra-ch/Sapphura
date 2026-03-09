'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Edit, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

type ProfileEditorProps = {
  profile?: {
    id?: string
    name: string
    email: string
    phone: string
  }
  onSave?: (profile: { name: string; email: string; phone: string }) => void
  loading?: boolean
}

export default function ProfileEditor({ profile, onSave, loading = false }: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  })
  const [errors, setErrors] = useState<Partial<typeof formData>>({})

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors')
      return
    }

    onSave?.(formData)
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    })
    setErrors({})
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gold-glass rounded-xl p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
            <div className="rounded-full bg-primary/20 p-3">
              <User size={24} className="text-primary" />
            </div>
            My Profile
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 gold-btn rounded-lg font-semibold transition-all"
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-b border-primary/20 pb-4">
            <p className="text-sm text-primary/60 mb-1">Full Name</p>
            <p className="text-lg font-semibold text-primary">{profile?.name || 'Not provided'}</p>
          </div>

          <div className="border-b border-primary/20 pb-4">
            <p className="text-sm text-primary/60 flex items-center gap-2 mb-1">
              <Mail size={16} />
              Email Address
            </p>
            <p className="text-lg font-semibold text-primary">{profile?.email || 'Not provided'}</p>
          </div>

          <div>
            <p className="text-sm text-primary/60 flex items-center gap-2 mb-1">
              <Phone size={16} />
              Phone Number
            </p>
            <p className="text-lg font-semibold text-primary">{profile?.phone || 'Not provided'}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="gold-glass rounded-xl p-8"
    >
      <h2 className="text-2xl font-bold text-primary mb-8">Edit Profile</h2>

      <div className="space-y-6">
        <div>
          <label className="block font-semibold mb-2 flex items-center gap-2">
            <User size={18} />
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              setErrors({ ...errors, name: undefined })
            }}
            className={`w-full px-4 py-3 rounded-lg bg-navy border ${
              errors.name ? 'border-red-500' : 'border-primary/30'
            } text-primary outline-none focus:border-primary transition-colors`}
            placeholder="John Doe"
            disabled={loading}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-2 flex items-center gap-2">
            <Mail size={18} />
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              setErrors({ ...errors, email: undefined })
            }}
            className={`w-full px-4 py-3 rounded-lg bg-navy border ${
              errors.email ? 'border-red-500' : 'border-primary/30'
            } text-primary outline-none focus:border-primary transition-colors`}
            placeholder="john@example.com"
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-2 flex items-center gap-2">
            <Phone size={18} />
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value })
              setErrors({ ...errors, phone: undefined })
            }}
            className={`w-full px-4 py-3 rounded-lg bg-navy border ${
              errors.phone ? 'border-red-500' : 'border-primary/30'
            } text-primary outline-none focus:border-primary transition-colors`}
            placeholder="+92 300 1234567"
            disabled={loading}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 gold-btn py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/10 transition-all disabled:opacity-50"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  )
}

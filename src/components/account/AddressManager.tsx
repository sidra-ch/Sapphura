'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Edit, Trash2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

type Address = {
  id?: string
  label: string
  street: string
  city: string
  state: string
  zipCode: string
  phone: string
  isDefault?: boolean
}

type AddressManagerProps = {
  addresses?: Address[]
  onAdd?: (address: Address) => void
  onUpdate?: (id: string, address: Address) => void
  onDelete?: (id: string) => void
  onSetDefault?: (id: string) => void
  loading?: boolean
}

export default function AddressManager({
  addresses = [],
  onAdd,
  onUpdate,
  onDelete,
  onSetDefault,
  loading = false,
}: AddressManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Address>({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<Address>>({})

  const validateForm = () => {
    const newErrors: Partial<Address> = {}

    if (!formData.label.trim()) newErrors.label = 'Label is required'
    if (!formData.street.trim()) newErrors.street = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    if (!validateForm()) {
      toast.error('Please fill all fields')
      return
    }
    onAdd?.(formData)
    setFormData({ label: '', street: '', city: '', state: '', zipCode: '', phone: '' })
    setIsAdding(false)
    toast.success('Address added successfully!')
  }

  const handleUpdate = (id: string) => {
    if (!validateForm()) {
      toast.error('Please fill all fields')
      return
    }
    onUpdate?.(id, formData)
    setEditingId(null)
    toast.success('Address updated successfully!')
  }

  const handleEdit = (address: Address) => {
    setFormData(address)
    setEditingId(address.id || '')
  }

  const handleCancel = () => {
    setFormData({ label: '', street: '', city: '', state: '', zipCode: '', phone: '' })
    setErrors({})
    setIsAdding(false)
    setEditingId(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
          <div className="rounded-full bg-primary/20 p-3">
            <MapPin size={24} className="text-primary" />
          </div>
          My Addresses
        </h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 gold-btn rounded-lg font-semibold transition-all"
          >
            <Plus size={18} />
            Add Address
          </button>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="gold-glass rounded-xl p-6"
          >
            <h3 className="font-bold text-lg mb-4">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Label (e.g., Home, Office)"
                value={formData.label}
                onChange={(e) => {
                  setFormData({ ...formData, label: e.target.value })
                  setErrors({ ...errors, label: undefined })
                }}
                className={`w-full px-4 py-3 rounded-lg bg-navy border ${
                  errors.label ? 'border-red-500' : 'border-primary/30'
                } text-primary outline-none focus:border-primary`}
                disabled={loading}
              />

              <input
                type="text"
                placeholder="Street Address"
                value={formData.street}
                onChange={(e) => {
                  setFormData({ ...formData, street: e.target.value })
                  setErrors({ ...errors, street: undefined })
                }}
                className={`w-full px-4 py-3 rounded-lg bg-navy border ${
                  errors.street ? 'border-red-500' : 'border-primary/30'
                } text-primary outline-none focus:border-primary`}
                disabled={loading}
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value })
                    setErrors({ ...errors, city: undefined })
                  }}
                  className={`px-4 py-3 rounded-lg bg-navy border ${
                    errors.city ? 'border-red-500' : 'border-primary/30'
                  } text-primary outline-none focus:border-primary`}
                  disabled={loading}
                />

                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value })
                    setErrors({ ...errors, state: undefined })
                  }}
                  className={`px-4 py-3 rounded-lg bg-navy border ${
                    errors.state ? 'border-red-500' : 'border-primary/30'
                  } text-primary outline-none focus:border-primary`}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => {
                    setFormData({ ...formData, zipCode: e.target.value })
                    setErrors({ ...errors, zipCode: undefined })
                  }}
                  className={`px-4 py-3 rounded-lg bg-navy border ${
                    errors.zipCode ? 'border-red-500' : 'border-primary/30'
                  } text-primary outline-none focus:border-primary`}
                  disabled={loading}
                />

                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value })
                    setErrors({ ...errors, phone: undefined })
                  }}
                  className={`px-4 py-3 rounded-lg bg-navy border ${
                    errors.phone ? 'border-red-500' : 'border-primary/30'
                  } text-primary outline-none focus:border-primary`}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => (editingId ? handleUpdate(editingId) : handleAdd())}
                  disabled={loading}
                  className="flex-1 gold-btn py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check size={18} />
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/10 disabled:opacity-50"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-primary/60"
          >
            <MapPin size={48} className="mx-auto mb-3 opacity-30" />
            <p>No addresses saved yet</p>
          </motion.div>
        ) : (
          addresses.map((addr, idx) => (
            <motion.div
              key={addr.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`gold-glass rounded-xl p-6 border-2 ${
                addr.isDefault ? 'border-primary' : 'border-primary/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-primary">{addr.label}</h3>
                  {addr.isDefault && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded mt-1 inline-block">
                      Default Address
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(addr)}
                    disabled={loading}
                    className="p-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete?.(addr.id || '')}
                    disabled={loading}
                    className="p-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <p className="text-primary/80 mb-2">{addr.street}</p>
              <p className="text-primary/80 mb-3">
                {addr.city}, {addr.state} {addr.zipCode}
              </p>
              <p className="text-primary/80 mb-3">Phone: {addr.phone}</p>

              {!addr.isDefault && (
                <button
                  onClick={() => onSetDefault?.(addr.id || '')}
                  disabled={loading}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Set as Default
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

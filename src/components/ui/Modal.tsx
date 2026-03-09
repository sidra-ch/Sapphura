'use client'

import { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  title?: string
  children: ReactNode
  onClose: () => void
}

export default function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-white p-6 text-gray-900" onClick={(e) => e.stopPropagation()}>
        {title ? <h3 className="mb-4 text-xl font-semibold">{title}</h3> : null}
        {children}
      </div>
    </div>
  )
}

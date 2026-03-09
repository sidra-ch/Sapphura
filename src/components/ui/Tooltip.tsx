'use client'

import { ReactNode, useState } from 'react'

type TooltipProps = {
  label: string
  children: ReactNode
}

export default function Tooltip({ label, children }: TooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open ? (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-2 py-1 text-xs text-primary shadow-lg">
          {label}
        </span>
      ) : null}
    </span>
  )
}

'use client'

type AddToCartButtonProps = {
  onClick: () => void
  disabled?: boolean
  label?: string
}

export default function AddToCartButton({ onClick, disabled = false, label = 'Add to Cart' }: AddToCartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="gold-btn rounded-lg px-4 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label}
    </button>
  )
}

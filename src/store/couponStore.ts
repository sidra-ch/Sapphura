import { create } from 'zustand'

export interface AppliedCoupon {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  discount: number
  description?: string
}

export interface CouponStore {
  appliedCoupon: AppliedCoupon | null
  
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  getCouponCode: () => string | null
  getDiscount: () => number
}

export const useCouponStore = create<CouponStore>((set, get) => ({
  appliedCoupon: null,

  applyCoupon: (coupon: AppliedCoupon) =>
    set({ appliedCoupon: coupon }),

  removeCoupon: () =>
    set({ appliedCoupon: null }),

  getCouponCode: () => {
    const state = get()
    return state.appliedCoupon?.code || null
  },

  getDiscount: () => {
    const state = get()
    return state.appliedCoupon?.discount || 0
  }
}))

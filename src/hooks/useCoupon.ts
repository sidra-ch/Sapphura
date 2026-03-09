import axios from 'axios'
import toast from 'react-hot-toast'
import { useCouponStore } from '@/store/couponStore'

export function useCoupon() {
  const store = useCouponStore()

  const validateCoupon = async (code: string, cartTotal: number) => {
    try {
      if (!code.trim()) {
        toast.error('Please enter a coupon code')
        return false
      }

      const response = await axios.post('/api/coupons/validate', {
        code: code.toUpperCase(),
        cartTotal
      })

      if (response.data.success) {
        store.applyCoupon(response.data.data)
        toast.success(response.data.message)
        return true
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to apply coupon'
      toast.error(errorMsg)
      return false
    }
  }

  const removeCoupon = () => {
    store.removeCoupon()
    toast.success('Coupon removed')
  }

  return {
    validateCoupon,
    removeCoupon,
    appliedCoupon: store.appliedCoupon,
    discount: store.getDiscount(),
    couponCode: store.getCouponCode()
  }
}

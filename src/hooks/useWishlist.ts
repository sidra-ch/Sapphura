import axios from 'axios'
import toast from 'react-hot-toast'
import { useWishlistStore } from '@/store/wishlistStore'

export interface UseWishlistOptions {
  email?: string
}

export function useWishlist(options?: UseWishlistOptions) {
  const store = useWishlistStore()

  const addToWishlist = async (productId: string, productData: any) => {
    try {
      const email = options?.email || store.email || 'guest@user.local'

      const response = await axios.post('/api/wishlist', {
        productId,
        email
      })

      if (response.data.success) {
        store.addItem({
          productId,
          productName: productData.name,
          price: productData.price,
          image: productData.images?.[0] || '',
          slug: productData.slug
        })
        toast.success('Added to wishlist')
        return true
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Already in wishlist')
      } else {
        toast.error('Failed to add to wishlist')
      }
      console.error('Add to wishlist error:', error)
      return false
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const email = options?.email || store.email || 'guest@user.local'

      const response = await axios.delete(`/api/wishlist/${productId}`, {
        data: { email }
      })

      if (response.data.success) {
        store.removeItem(productId)
        toast.success('Removed from wishlist')
        return true
      }
    } catch (error) {
      toast.error('Failed to remove from wishlist')
      console.error('Remove from wishlist error:', error)
      return false
    }
  }

  const toggleWishlist = async (productId: string, productData?: any) => {
    if (store.isInWishlist(productId)) {
      return removeFromWishlist(productId)
    } else {
      return addToWishlist(productId, productData || {})
    }
  }

  const fetchWishlist = async () => {
    try {
      const email = options?.email || store.email || 'guest@user.local'

      const response = await axios.get('/api/wishlist', {
        params: { email }
      })

      if (response.data.success) {
        // Update store with fetched items
        store.clearWishlist()
        response.data.data.forEach((item: any) => {
          store.addItem({
            productId: item.product.id,
            productName: item.product.name,
            price: item.product.price,
            image: item.product.images?.[0] || '',
            slug: item.product.slug
          })
        })
        return response.data.data
      }
    } catch (error) {
      console.error('Fetch wishlist error:', error)
      return []
    }
  }

  return {
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlist,
    isInWishlist: store.isInWishlist,
    items: store.items,
    count: store.getCount()
  }
}

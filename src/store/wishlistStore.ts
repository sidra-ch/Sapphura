import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface WishlistItem {
  productId: string
  productName: string
  price: number
  image: string
  slug: string
}

export interface WishlistStore {
  items: WishlistItem[]
  email: string | null
  hasHydrated: boolean
  
  // Actions
  setEmail: (email: string) => void
  setHasHydrated: (hydrated: boolean) => void
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  toggleItem: (item: WishlistItem) => boolean
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  getCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      email: null,
      hasHydrated: false,

      setEmail: (email: string) =>
        set({ email }),

      setHasHydrated: (hydrated: boolean) =>
        set({ hasHydrated: hydrated }),

      addItem: (item: WishlistItem) =>
        set((state) => {
          // Check if item already exists
          if (state.items.some((i) => i.productId === item.productId)) {
            return state
          }
          return {
            items: [...state.items, item]
          }
        }),

      removeItem: (productId: string) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId)
        })),

      toggleItem: (item: WishlistItem) => {
        const state = get()
        if (state.isInWishlist(item.productId)) {
          state.removeItem(item.productId)
          return false
        } else {
          state.addItem(item)
          return true
        }
      },

      isInWishlist: (productId: string) => {
        const state = get()
        return state.items.some((item) => item.productId === productId)
      },

      clearWishlist: () =>
        set({ items: [] }),

      getCount: () => {
        const state = get()
        return state.items.length
      }
    }),
    {
      name: 'wishlist-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import toast from 'react-hot-toast'
import type { Product } from '@/lib/supabase/client'

interface AddToCartButtonProps {
  product: Product
  quantity?: number
}

export default function AddToCartButton({ product, quantity = 1 }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      quantity,
      image: product.images[0] || '',
      category: product.category,
    })
    toast.success('تم إضافة المنتج للسلة')
  }

  return (
    <button
      onClick={handleAddToCart}
      className="btn btn-primary w-full"
    >
      <ShoppingCart className="h-5 w-5" />
      أضف للسلة
    </button>
  )
}

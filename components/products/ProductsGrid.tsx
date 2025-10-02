import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import AddToCartButton from './AddToCartButton'
import type { Product } from '@/lib/supabase/client'

interface ProductsGridProps {
  products: Product[]
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          لم يتم العثور على منتجات
        </h3>
        <p className="text-gray-600">جرب تغيير معايير البحث</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          عرض <span className="font-semibold">{products.length}</span> منتج
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const discount = product.discount_price
            ? calculateDiscount(product.price, product.discount_price)
            : 0

          return (
            <div key={product.id} className="card group">
              <Link
                href={`/products/${product.slug}`}
                className="block relative aspect-square mb-4 overflow-hidden rounded-lg"
              >
                <Image
                  src={product.images[0] || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    خصم {discount}%
                  </div>
                )}
              </Link>

              <div className="space-y-2">
                <span className="text-sm text-gray-500">{product.category}</span>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-lg hover:text-primary-500 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary-500">
                    {formatPrice(product.discount_price || product.price)}
                  </span>
                  {product.discount_price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews_count})
                  </span>
                </div>

                <AddToCartButton product={product} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

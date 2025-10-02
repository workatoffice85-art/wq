import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/supabase/client'

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">منتجات مشابهة</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group"
          >
            <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
              <Image
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold group-hover:text-primary-500 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-primary-500">
                {formatPrice(product.discount_price || product.price)}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="mr-1">{product.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

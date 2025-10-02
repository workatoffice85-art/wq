import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProducts } from '@/lib/supabase/queries'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { Star, ShoppingCart } from 'lucide-react'
import AddToCartButton from '@/components/products/AddToCartButton'

export default async function FeaturedProducts() {
  let products: any[] = []
  
  try {
    const fetchedProducts = await getFeaturedProducts(6)
    products = fetchedProducts || []
  } catch (error) {
    console.error('Error fetching featured products:', error)
    products = []
  }

  // إذا مفيش منتجات، استخدم منتجات افتراضية للعرض
  if (!products || products.length === 0) {
    products = [
      {
        id: '1',
        name: 'نافذة ألوميتال عصرية',
        slug: 'modern-aluminum-window',
        description: 'نافذة ألوميتال بتصميم عصري وجودة عالية',
        category: 'نوافذ',
        price: 2500,
        discount_price: 2000,
        images: ['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400&h=400&fit=crop'],
        features: [],
        specifications: {},
        is_featured: true,
        is_active: true,
        stock_quantity: 10,
        rating: 4.5,
        reviews_count: 12,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null
      },
      {
        id: '2',
        name: 'باب ألوميتال فاخر',
        slug: 'luxury-aluminum-door',
        description: 'باب ألوميتال فاخر بتشطيبات راقية',
        category: 'أبواب',
        price: 5000,
        discount_price: null,
        images: ['https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400&h=400&fit=crop'],
        features: [],
        specifications: {},
        is_featured: true,
        is_active: true,
        stock_quantity: 5,
        rating: 5,
        reviews_count: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null
      },
      {
        id: '3',
        name: 'مطبخ ألوميتال كامل',
        slug: 'complete-aluminum-kitchen',
        description: 'مطبخ ألوميتال كامل بتصميم عصري',
        category: 'مطابخ',
        price: 15000,
        discount_price: 12000,
        images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop'],
        features: [],
        specifications: {},
        is_featured: true,
        is_active: true,
        stock_quantity: 3,
        rating: 4.8,
        reviews_count: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null
      }
    ]
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            منتجات مميزة
          </h2>
          <p className="text-gray-600 text-lg">
            اكتشف أجود المنتجات من مجموعتنا المتميزة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const discount = product.discount_price
              ? calculateDiscount(product.price, product.discount_price)
              : 0

            return (
              <div key={product.id} className="card group">
                <Link href={`/products/${product.slug}`} className="block relative aspect-square mb-4 overflow-hidden rounded-lg">
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
                    <h3 className="font-semibold text-lg hover:text-primary-500 transition-colors">
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
                      ({product.reviews_count} تقييم)
                    </span>
                  </div>

                  <AddToCartButton product={product} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="btn btn-primary">
            عرض جميع المنتجات
          </Link>
        </div>
      </div>
    </section>
  )
}

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Star, Check } from 'lucide-react'
import { getProductBySlug, getRelatedProducts, getProductReviews } from '@/lib/supabase/queries'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import AddToCartButton from '@/components/products/AddToCartButton'
import ProductGallery from '@/components/products/ProductGallery'
import RelatedProducts from '@/components/products/RelatedProducts'
import ProductReviews from '@/components/products/ProductReviews'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const product = await getProductBySlug(params.slug)
    return {
      title: `${product.name} - ألوميتال برو`,
      description: product.description,
    }
  } catch {
    return {
      title: 'منتج غير موجود',
    }
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product
  let relatedProducts = []
  let reviews = []

  try {
    product = await getProductBySlug(params.slug)
    relatedProducts = await getRelatedProducts(product.id, product.category)
    reviews = await getProductReviews(product.id)
  } catch (error) {
    notFound()
  }

  const discount = product.discount_price
    ? calculateDiscount(product.price, product.discount_price)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Product Details */}
        <div className="bg-white rounded-xl p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gallery */}
            <ProductGallery images={product.images} name={product.name} />

            {/* Info */}
            <div className="space-y-6">
              <div>
                <span className="text-sm text-gray-500">{product.category}</span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews_count} تقييم)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary-500">
                  {formatPrice(product.discount_price || product.price)}
                </span>
                {product.discount_price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      خصم {discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg mb-2">الوصف</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">المميزات</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">المواصفات</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <tr key={key} className="border-b border-gray-200 last:border-0">
                            <td className="py-2 font-medium text-gray-700">{key}</td>
                            <td className="py-2 text-gray-600">{value as string}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ProductReviews reviews={reviews} productId={product.id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  )
}

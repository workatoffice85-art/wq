import { Suspense } from 'react'
import ProductsGrid from '@/components/products/ProductsGrid'
import ProductsFilters from '@/components/products/ProductsFilters'
import { getProducts } from '@/lib/supabase/queries'

export const metadata = {
  title: 'المنتجات - ألوميتال برو',
  description: 'تصفح جميع منتجاتنا من مطابخ وأبواب وشبابيك الألوميتال',
}

interface SearchParams {
  category?: string
  search?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const filters = {
    category: searchParams.category,
    search: searchParams.search,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
  }

  let products: any[] = []
  try {
    products = await getProducts(filters)
    
    // Apply sorting
    if (searchParams.sort === 'price-low') {
      products.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price))
    } else if (searchParams.sort === 'price-high') {
      products.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price))
    } else if (searchParams.sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 relative">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            المنتجات
          </h1>
          <p className="text-gray-600">
            تصفح جميع منتجاتنا من مطابخ وأبواب وشبابيك الألوميتال
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div>جاري التحميل...</div>}>
              <ProductsFilters />
            </Suspense>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            <Suspense fallback={<div>جاري التحميل...</div>}>
              <ProductsGrid products={products} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

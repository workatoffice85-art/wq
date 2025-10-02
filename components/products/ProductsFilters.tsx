'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'

export default function ProductsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '0')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '50000')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'default')
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)
    if (minPrice !== '0') params.set('minPrice', minPrice)
    if (maxPrice !== '50000') params.set('maxPrice', maxPrice)
    if (sortBy !== 'default') params.set('sort', sortBy)

    router.push(`/products?${params.toString()}`)
  }

  useEffect(() => {
    applyFilters()
  }, [category, sortBy])

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm sticky top-20">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary-500" />
        <h2 className="text-lg font-semibold">الفلاتر</h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="label">البحث</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
          placeholder="ابحث عن منتج..."
          className="input"
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="label">الفئة</label>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'جميع المنتجات' },
            { value: 'kitchens', label: 'مطابخ' },
            { value: 'doors', label: 'أبواب' },
            { value: 'windows', label: 'شبابيك' },
          ].map((cat) => (
            <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat.value}
                checked={category === cat.value}
                onChange={(e) => setCategory(e.target.value)}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="label">نطاق السعر</label>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">من</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input"
              min="0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">إلى</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input"
              min="0"
            />
          </div>
          <button onClick={applyFilters} className="btn btn-primary w-full text-sm">
            تطبيق
          </button>
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <label className="label">الترتيب</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input"
        >
          <option value="default">الافتراضي</option>
          <option value="price-low">السعر: من الأقل للأعلى</option>
          <option value="price-high">السعر: من الأعلى للأقل</option>
          <option value="rating">الأعلى تقييماً</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setCategory('all')
          setMinPrice('0')
          setMaxPrice('50000')
          setSortBy('default')
          setSearch('')
          router.push('/products')
        }}
        className="btn btn-outline w-full text-sm"
      >
        إعادة تعيين
      </button>
    </div>
  )
}

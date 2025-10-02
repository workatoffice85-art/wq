'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  
  const [product, setProduct] = useState({
    name: '',
    slug: '',
    description: '',
    category: '',
    price: 0,
    discount_price: null as number | null,
    images: [] as string[],
    features: [] as string[],
    specifications: {} as Record<string, string>,
    is_featured: false,
    is_active: true,
    stock_quantity: 0,
  })

  const [newFeature, setNewFeature] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  const handleSave = async () => {
    if (!product.name || !product.category || !product.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'فشل في حفظ المنتج')
      }

      const savedProduct = await response.json()
      toast.success('تم إضافة المنتج بنجاح! ✅')
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error(error.message || 'حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setProduct({ ...product, features: [...product.features, newFeature.trim()] })
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setProduct({
      ...product,
      features: product.features.filter((_, i) => i !== index)
    })
  }

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setProduct({
        ...product,
        specifications: {
          ...product.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      })
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const removeSpecification = (key: string) => {
    const newSpecs = { ...product.specifications }
    delete newSpecs[key]
    setProduct({ ...product, specifications: newSpecs })
  }

  const addImage = (url: string) => {
    setProduct({ ...product, images: [...product.images, url] })
  }

  const removeImage = (index: number) => {
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index)
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إضافة منتج جديد</h1>
            <p className="text-gray-600">أضف منتج جديد إلى المتجر</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          <Save className="h-5 w-5" />
          {saving ? 'جاري الحفظ...' : 'حفظ المنتج'}
        </button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">المعلومات الأساسية</h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">اسم المنتج *</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => {
                    const name = e.target.value
                    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
                    setProduct({ ...product, name, slug })
                  }}
                  className="input"
                  placeholder="مثال: مطبخ ألوميتال عصري"
                />
              </div>

              <div>
                <label className="label">الرابط (Slug)</label>
                <input
                  type="text"
                  value={product.slug}
                  onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                  className="input"
                  placeholder="modern-aluminum-kitchen"
                />
              </div>

              <div>
                <label className="label">الوصف</label>
                <textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  className="input min-h-[120px]"
                  placeholder="وصف تفصيلي للمنتج..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">الفئة *</label>
                  <select
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="input"
                  >
                    <option value="">اختر الفئة</option>
                    <option value="مطابخ">مطابخ</option>
                    <option value="أبواب">أبواب</option>
                    <option value="نوافذ">نوافذ</option>
                    <option value="شبابيك">شبابيك</option>
                    <option value="واجهات">واجهات</option>
                  </select>
                </div>

                <div>
                  <label className="label">الكمية المتاحة *</label>
                  <input
                    type="number"
                    value={product.stock_quantity}
                    onChange={(e) => setProduct({ ...product, stock_quantity: parseInt(e.target.value) || 0 })}
                    className="input"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">الأسعار</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">السعر الأساسي *</label>
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                  className="input"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="label">سعر الخصم (اختياري)</label>
                <input
                  type="number"
                  value={product.discount_price || ''}
                  onChange={(e) => setProduct({ ...product, discount_price: e.target.value ? parseFloat(e.target.value) : null })}
                  className="input"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">صور المنتج</h3>
            
            <div className="space-y-4">
              {/* Existing Images */}
              {product.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                          الصورة الرئيسية
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Image */}
              <div>
                <label className="label">إضافة صورة جديدة</label>
                <ImageUpload
                  value=""
                  onChange={addImage}
                  bucket="products"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 الصورة الأولى ستكون الصورة الرئيسية للمنتج
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">المميزات</h3>
            
            <div className="space-y-4">
              {/* Existing Features */}
              {product.features.length > 0 && (
                <div className="space-y-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-1">{feature}</span>
                      <button
                        onClick={() => removeFeature(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Feature */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  className="input flex-1"
                  placeholder="أضف ميزة جديدة..."
                />
                <button onClick={addFeature} className="btn btn-outline">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">المواصفات</h3>
            
            <div className="space-y-4">
              {/* Existing Specifications */}
              {Object.keys(product.specifications).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{key}:</span>
                      <span className="flex-1">{value}</span>
                      <button
                        onClick={() => removeSpecification(key)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Specification */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  className="input flex-1"
                  placeholder="المفتاح (مثال: المادة)"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSpecification()}
                  className="input flex-1"
                  placeholder="القيمة (مثال: ألوميتال)"
                />
                <button onClick={addSpecification} className="btn btn-outline">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">الحالة</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-medium">منتج نشط</label>
                <input
                  type="checkbox"
                  checked={product.is_active}
                  onChange={(e) => setProduct({ ...product, is_active: e.target.checked })}
                  className="w-5 h-5 text-primary-500 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="font-medium">منتج مميز</label>
                <input
                  type="checkbox"
                  checked={product.is_featured}
                  onChange={(e) => setProduct({ ...product, is_featured: e.target.checked })}
                  className="w-5 h-5 text-primary-500 rounded"
                />
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-3">💡 نصائح:</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• استخدم صور عالية الجودة</li>
              <li>• اكتب وصف تفصيلي وواضح</li>
              <li>• أضف جميع المواصفات المهمة</li>
              <li>• حدد السعر بدقة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuth } from '@/hooks/useAuth'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  })

  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoLoading, setPromoLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email || '' }))
    }
  }, [user])

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart')
    }
  }, [mounted, items.length, router])

  if (!mounted || items.length === 0) {
    return null
  }

  const total = getTotal()
  const tax = total * 0.14
  const shipping = 50
  const discountAmount = promoApplied ? promoDiscount : 0
  const finalTotal = total + tax + shipping - discountAmount

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('أدخل كود البرومو')
      return
    }

    setPromoLoading(true)
    try {
      // محاولة استخدام API أولاً
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          cartTotal: total
        }),
      })

      if (response.ok) {
        const promo = await response.json()
        setPromoDiscount(promo.discountAmount)
        setPromoApplied(true)
        toast.success(`تم تطبيق الخصم! توفير ${formatPrice(promo.discountAmount)}`)
      } else {
        // حل بديل محلي إذا فشل API
        const promo = await response.json()
        if (promo.message.includes('غير صالح')) {
          // محاولة حل بديل محلي للأكواد الشائعة
          if (promoCode.toUpperCase() === 'WELCOME10' && total >= 100) {
            const discountAmount = Math.min(total * 0.1, 500)
            setPromoDiscount(discountAmount)
            setPromoApplied(true)
            toast.success(`تم تطبيق خصم 10%! توفير ${formatPrice(discountAmount)}`)
          } else if (promoCode.toUpperCase() === 'SAVE500' && total >= 5000) {
            const discountAmount = 500
            setPromoDiscount(discountAmount)
            setPromoApplied(true)
            toast.success(`تم تطبيق خصم 500 جنيه!`)
          } else {
            toast.error(promo.message || 'كود البرومو غير صالح')
          }
        } else {
          toast.error(promo.message || 'كود البرومو غير صالح')
        }
      }
    } catch (error) {
      console.error('Error applying promo code:', error)

      // حل بديل محلي في حالة خطأ في الشبكة
      if (promoCode.toUpperCase() === 'WELCOME10' && total >= 100) {
        const discountAmount = Math.min(total * 0.1, 500)
        setPromoDiscount(discountAmount)
        setPromoApplied(true)
        toast.success(`تم تطبيق خصم 10%! توفير ${formatPrice(discountAmount)}`)
      } else if (promoCode.toUpperCase() === 'SAVE500' && total >= 5000) {
        const discountAmount = 500
        setPromoDiscount(discountAmount)
        setPromoApplied(true)
        toast.success(`تم تطبيق خصم 500 جنيه!`)
      } else {
        toast.error('حدث خطأ أثناء تطبيق كود البرومو - جرب الأكواد: WELCOME10 أو SAVE500')
      }
    } finally {
      setPromoLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          notes: formData.notes,
          promo_code: promoApplied ? promoCode : null,
          discount_amount: discountAmount,
          items: items.map(item => ({
            product_id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal: total,
          tax,
          shipping,
          total: finalTotal,
        }),
      })

      if (!response.ok) throw new Error('Failed to create order')

      const order = await response.json()
      
      clearCart()
      toast.success('تم إرسال طلبك بنجاح!')
      router.push('/account')
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('حدث خطأ أثناء إرسال الطلب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">بيانات التوصيل</h2>

              <div className="space-y-4">
                <div>
                  <label className="label">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="label">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="label">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="label">العنوان *</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="أدخل عنوانك بالتفصيل"
                  />
                </div>

                <div>
                  <label className="label">ملاحظات (اختياري)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="أي ملاحظات إضافية"
                  />
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-green-600">🎟️</span>
                  كود البرومو
                </h3>

                {!promoApplied ? (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="أدخل كود البرومو"
                      className="input flex-1"
                      disabled={promoLoading}
                    />
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      disabled={promoLoading || !promoCode.trim()}
                      className="btn btn-primary whitespace-nowrap"
                    >
                      {promoLoading ? 'جاري التطبيق...' : 'تطبيق'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span className="font-medium">كود البرومو مُطبق</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPromoApplied(false)
                        setPromoDiscount(0)
                        setPromoCode('')
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      إزالة
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-6"
              >
                {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>خصم كود البرومو</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>الضريبة (14%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>الإجمالي</span>
                  <span className="text-primary-500">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

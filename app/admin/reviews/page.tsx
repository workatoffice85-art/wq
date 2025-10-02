'use client'

import { useState, useEffect } from 'react'
import { Star, Check, X } from 'lucide-react'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockReviews = [
      {
        id: '1',
        customer_name: 'أحمد محمد',
        product_name: 'مطبخ ألوميتال عصري',
        rating: 5,
        comment: 'منتج ممتاز وجودة عالية',
        is_approved: false,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        customer_name: 'فاطمة علي',
        product_name: 'باب ألوميتال',
        rating: 4,
        comment: 'جيد جداً',
        is_approved: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
    setReviews(mockReviews)
    setLoading(false)
  }, [])

  const approveReview = (reviewId: string) => {
    setReviews(reviews.map(review =>
      review.id === reviewId ? { ...review, is_approved: true } : review
    ))
  }

  const rejectReview = (reviewId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المراجعة؟')) {
      setReviews(reviews.filter(review => review.id !== reviewId))
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المراجعات</h1>
        <p className="text-gray-600">الموافقة على المراجعات أو رفضها</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-bold">
                    {review.customer_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{review.customer_name}</h3>
                    <p className="text-sm text-gray-500">{review.product_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <p className="text-gray-700">{review.comment}</p>
              </div>

              <div className="flex items-center gap-2">
                {review.is_approved ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    مقبول
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => approveReview(review.id)}
                      className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                      title="قبول"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => rejectReview(review.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                      title="رفض"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

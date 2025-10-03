import { Star } from 'lucide-react'

export default function ReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: 'أحمد محمد',
      rating: 5,
      comment: 'خدمة ممتازة وجودة عالية جداً. أنصح الجميع بالتعامل معهم',
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'فاطمة علي',
      rating: 4,
      comment: 'منتج جيد وسعر مناسب. التركيب كان احترافي',
      date: '2024-01-20',
    },
    {
      id: 3,
      name: 'محمد صلاح',
      rating: 5,
      comment: 'أفضل شركة ألوميتال في مصر. الجودة والسعر ممتازين',
      date: '2024-01-25',
    },
  ]

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            آراء عملائنا
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            تعرف على تجارب عملائنا الكرام
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="card">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-bold text-base sm:text-lg flex-shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm sm:text-base truncate">{review.name}</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

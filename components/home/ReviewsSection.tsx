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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            آراء عملائنا
          </h2>
          <p className="text-gray-600 text-lg">
            تعرف على تجارب عملائنا الكرام
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="card">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{review.name}</h4>
                  <div className="flex items-center gap-1">
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
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

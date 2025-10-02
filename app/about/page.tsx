import Image from 'next/image'
import { Check, Award, Users, Clock, Shield } from 'lucide-react'

export const metadata = {
  title: 'من نحن - ألوميتال برو',
  description: 'تعرف على شركة ألوميتال برو وخبرتنا في مجال الألوميتال',
}

export default function AboutPage() {
  const values = [
    { icon: Award, title: 'الجودة العالية', description: 'نستخدم أفضل المواد والتقنيات' },
    { icon: Users, title: 'فريق محترف', description: 'فريق عمل مدرب على أعلى مستوى' },
    { icon: Clock, title: 'التسليم في الوقت', description: 'نلتزم بمواعيد التسليم المحددة' },
    { icon: Shield, title: 'ضمان شامل', description: 'ضمان يصل إلى 5 سنوات' },
  ]

  const features = [
    'خبرة تزيد عن 15 عامًا في مجال الألوميتال',
    'فريق عمل محترف ومدرب',
    'استخدام أفضل المواد والخامات',
    'أسعار تنافسية ومناسبة',
    'خدمة تركيب مجانية',
    'ضمان شامل على جميع المنتجات',
    'خدمة عملاء متميزة',
    'صيانة دورية مجانية',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">من نحن</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            شركة رائدة في مجال تصنيع وتركيب منتجات الألوميتال عالية الجودة
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">ألوميتال برو</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                نحن شركة متخصصة في تصنيع وتركيب مطابخ وأبواب وشبابيك الألوميتال بأعلى معايير الجودة.
                تأسست شركتنا منذ أكثر من 15 عامًا، ونفخر بخدمة آلاف العملاء في جميع أنحاء مصر.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                نؤمن بأن الجودة هي أساس النجاح، لذلك نستخدم أفضل المواد والتقنيات الحديثة في التصنيع،
                ونوفر فريق عمل محترف ومدرب على أعلى مستوى لضمان رضا عملائنا.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800"
                alt="عن الشركة"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">قيمنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="card text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* All Features */}
          <div className="bg-white rounded-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">لماذا تختارنا؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

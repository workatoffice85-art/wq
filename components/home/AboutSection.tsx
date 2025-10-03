'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Award, Users, Wrench } from 'lucide-react'

export default function AboutSection() {
  const [content, setContent] = useState({
    title: 'لماذا تختار ألوميتال برو؟',
    description: 'نتميز بخبرة تزيد عن 15 عامًا في مجال الألوميتال',
    features: [
      'جودة عالية مضمونة',
      'خبرة تزيد عن 15 عامًا',
      'أسعار مناسبة ومنافسة',
      'ضمان شامل على جميع المنتجات',
    ],
  })

  useEffect(() => {
    const saved = localStorage.getItem('page_home')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.sections?.about) {
          setContent({
            title: data.sections.about.title || content.title,
            description: data.sections.about.description || content.description,
            features: data.sections.about.features || content.features,
          })
        }
      } catch (e) {
        console.error('Error loading about content:', e)
      }
    }
  }, [])

  const features = [
    {
      icon: CheckCircle,
      title: 'جودة عالية مضمونة',
      description: 'نستخدم أفضل خامات الألوميتال المستوردة',
    },
    {
      icon: Award,
      title: 'خبرة تزيد عن 15 عامًا',
      description: 'فريق محترف ومتخصص في مجال الألوميتال',
    },
    {
      icon: Users,
      title: 'رضا العملاء أولويتنا',
      description: 'أكثر من 5000 عميل راضٍ عن خدماتنا',
    },
    {
      icon: Wrench,
      title: 'ضمان شامل',
      description: 'ضمان على جميع المنتجات والتركيبات',
    },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {content.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

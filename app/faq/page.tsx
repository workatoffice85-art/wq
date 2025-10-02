'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'ما هي مدة الضمان على المنتجات؟',
      answer: 'نقدم ضمان يتراوح من 3 إلى 5 سنوات حسب نوع المنتج. المطابخ تأتي بضمان 5 سنوات، بينما الأبواب والشبابيك بضمان 3 سنوات.',
    },
    {
      question: 'هل تقدمون خدمة التركيب؟',
      answer: 'نعم، نقدم خدمة التركيب المجاني لجميع المنتجات مع فريق عمل محترف ومدرب.',
    },
    {
      question: 'كم تستغرق مدة التسليم؟',
      answer: 'عادة ما تستغرق من 7-14 يوم عمل حسب حجم الطلب والتخصيصات المطلوبة.',
    },
    {
      question: 'هل يمكنني تخصيص المنتج حسب احتياجاتي؟',
      answer: 'بالتأكيد! نوفر خدمة التخصيص الكامل للمنتجات حسب المقاسات والألوان والتصميمات التي تريدها.',
    },
    {
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نقبل الدفع نقداً عند التسليم، التحويل البنكي، وبطاقات الائتمان.',
    },
    {
      question: 'هل تقدمون خدمة الصيانة؟',
      answer: 'نعم، نقدم خدمة الصيانة الدورية المجانية خلال فترة الضمان، وخدمة صيانة مدفوعة بعد انتهاء الضمان.',
    },
    {
      question: 'هل يمكنني إلغاء أو تعديل الطلب؟',
      answer: 'يمكنك إلغاء أو تعديل الطلب خلال 24 ساعة من تقديمه. بعد ذلك قد تطبق رسوم إلغاء حسب مرحلة التصنيع.',
    },
    {
      question: 'هل تغطي المنتجات جميع المحافظات؟',
      answer: 'نعم، نوفر خدمة التوصيل والتركيب في جميع محافظات مصر.',
    },
    {
      question: 'ما هي المواد المستخدمة في التصنيع؟',
      answer: 'نستخدم ألوميتال عالي الجودة مستورد من أفضل المصانع العالمية، مع ضمان المتانة ومقاومة العوامل الجوية.',
    },
    {
      question: 'كيف يمكنني التواصل مع خدمة العملاء؟',
      answer: 'يمكنك التواصل معنا عبر الهاتف، البريد الإلكتروني، أو نموذج الاتصال في الموقع. فريقنا متاح من السبت إلى الخميس من 9 صباحاً حتى 6 مساءً.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">الأسئلة الشائعة</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            إجابات على أكثر الأسئلة شيوعاً
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-lg pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-12 text-center bg-white rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">لم تجد إجابة لسؤالك؟</h2>
              <p className="text-gray-600 mb-6">
                تواصل معنا وسنكون سعداء بمساعدتك
              </p>
              <a href="/contact" className="btn btn-primary">
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

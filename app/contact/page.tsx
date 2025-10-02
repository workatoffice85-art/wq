'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  
  const [pageContent, setPageContent] = useState({
    hero: {
      title: 'اتصل بنا',
      subtitle: 'نحن هنا للإجابة على جميع استفساراتك',
    },
    info: {
      phone: '+20 100 123 4567',
      email: 'info@alupro.com',
      address: 'القاهرة، مصر',
    },
  })

  useEffect(() => {
    const saved = localStorage.getItem('page_contact')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.sections) {
          setPageContent({
            hero: data.sections.hero || pageContent.hero,
            info: data.sections.info || pageContent.info,
          })
        }
      } catch (e) {
        console.error('Error loading contact content:', e)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send message')

      toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال الرسالة')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'الهاتف',
      value: pageContent.info.phone,
      link: `tel:${pageContent.info.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: pageContent.info.email,
      link: `mailto:${pageContent.info.email}`,
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: pageContent.info.address,
      link: '#',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{pageContent.hero.title}</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {pageContent.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.value}</p>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">الاسم *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="أدخل اسمك"
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
                  <label className="label">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="label">الموضوع</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input"
                    placeholder="موضوع الرسالة"
                  />
                </div>

                <div>
                  <label className="label">الرسالة *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input"
                    rows={5}
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  <Send className="h-5 w-5" />
                  {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">موقعنا</h2>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221088.49265568405!2d29.86252!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Egypt!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-lg">ساعات العمل</h3>
                <div className="space-y-2 text-gray-600">
                  <p>السبت - الخميس: 9:00 صباحاً - 6:00 مساءً</p>
                  <p>الجمعة: مغلق</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

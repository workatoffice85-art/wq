'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function HeroSection() {
  const [content, setContent] = useState({
    title: 'أفضل منتجات الألوميتال في مصر',
    subtitle: 'مطابخ وأبواب وشبابيك ألوميتال عصرية بجودة عالية',
    buttonText: 'تصفح المنتجات',
  })

  const { settings } = useSiteSettings()

  useEffect(() => {
    // Load saved content from localStorage
    const saved = localStorage.getItem('page_home')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.sections?.hero) {
          setContent({
            title: data.sections.hero.title || content.title,
            subtitle: data.sections.hero.subtitle || content.subtitle,
            buttonText: data.sections.hero.buttonText || content.buttonText,
          })
        }
      } catch (e) {
        console.error('Error loading hero content:', e)
      }
    }
  }, [])

  return (
    <section className="relative min-h-[85vh] sm:min-h-[80vh] md:min-h-[75vh] lg:min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white overflow-hidden">
      {/* Background Image */}
      {settings.hero_background && (
        <div className="absolute inset-0">
          <img
            src={settings.hero_background}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/80 to-primary-700/80" />
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 animate-fade-in leading-tight drop-shadow-lg">
            {content.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 text-white/95 animate-fade-in-delay leading-relaxed drop-shadow-md max-w-4xl mx-auto">
            {content.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center animate-fade-in-delay-2">
            <Link href="/products" className="btn bg-white text-primary-600 hover:bg-gray-50 hover:text-primary-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 px-8 py-4 text-lg">
              {content.buttonText}
            </Link>
            <Link href="/contact" className="btn bg-white/15 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/25 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 px-8 py-4 text-lg">
              اتصل بنا
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

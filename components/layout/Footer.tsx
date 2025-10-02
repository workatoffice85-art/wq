'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function Footer() {
  const { settings } = useSiteSettings()
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {settings.site_logo && (
                <img
                  src={settings.site_logo}
                  alt={settings.site_name || 'ألوميتال برو'}
                  className="h-10 w-10 object-contain"
                />
              )}
              <div>
                <h3 className="text-xl font-bold" style={{ color: settings.primary_color || '#1a365d' }}>
                  {typeof settings.site_name === 'string' ? settings.site_name : 'ألوميتال برو'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {typeof settings.site_tagline === 'string' ? settings.site_tagline : 'الجودة والأناقة'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-500 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-500 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-500 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">منتجاتنا</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=kitchens" className="text-gray-400 hover:text-white transition-colors">
                  مطابخ ألوميتال
                </Link>
              </li>
              <li>
                <Link href="/products?category=doors" className="text-gray-400 hover:text-white transition-colors">
                  أبواب ألوميتال
                </Link>
              </li>
              <li>
                <Link href="/products?category=windows" className="text-gray-400 hover:text-white transition-colors">
                  شبابيك ألوميتال
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{typeof settings.contact_phone === 'string' ? settings.contact_phone : '+20 100 123 4567'}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>{typeof settings.contact_email === 'string' ? settings.contact_email : 'info@alupro.com'}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{typeof settings.contact_address === 'string' ? settings.contact_address : 'القاهرة، مصر'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>{typeof settings.footer_text === 'string' ? settings.footer_text : '© 2024 ألوميتال برو. جميع الحقوق محفوظة.'}</p>
        </div>
      </div>
    </footer>
  )
}

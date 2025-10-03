'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, ShoppingCart, User, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/lib/store/cartStore'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, signOut, isAdmin } = useAuth()
  const itemsCount = useCartStore((state) => state.getItemsCount())
  const { settings } = useSiteSettings()

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/products', label: 'المنتجات' },
    { href: '/about', label: 'من نحن' },
    { href: '/contact', label: 'اتصل بنا' },
    { href: '/faq', label: 'أسئلة شائعة' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {settings.site_logo && settings.site_logo !== '' && settings.site_logo !== '/logo.svg' && (
              <img
                src={settings.site_logo}
                alt={settings.site_name || 'ألوميتال برو'}
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  console.error('Logo image failed to load:', settings.site_logo)
                  e.currentTarget.style.display = 'none'
                }}
                onLoad={(e) => {
                  console.log('Logo image loaded successfully:', settings.site_logo)
                }}
                key={settings.site_logo} // Force re-render when URL changes
              />
            )}
            <div className="flex flex-col">
              <span className="text-xl font-bold" style={{ color: settings.primary_color || '#1a365d' }}>
                {typeof settings.site_name === 'string' ? settings.site_name : 'ألوميتال برو'}
              </span>
              <span className="text-xs" style={{ color: settings.secondary_color || '#2d3748' }}>
                {typeof settings.site_tagline === 'string' ? settings.site_tagline : 'الجودة والأناقة'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="hidden sm:flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm">
              <Search className="h-4 w-4" />
              <span>بحث...</span>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs text-white">
                  {itemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-2 sm:px-3"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {userMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-lg bg-white shadow-lg border">
                  {user ? (
                    <>
                      <div className="border-b px-4 py-3">
                        <p className="text-sm font-medium">{profile?.full_name || 'مستخدم'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        حسابي
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        طلباتي
                      </Link>
                      {isAdmin() && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 border-t"
                        >
                          <Settings className="h-4 w-4" />
                          لوحة التحكم
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t"
                      >
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        إنشاء حساب
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t py-4 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-2 text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

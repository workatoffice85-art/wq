'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Search, ShoppingCart, User, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/lib/store/cartStore'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user, profile, signOut, isAdmin } = useAuth()
  const itemsCount = useCartStore((state) => state.getItemsCount())
  const { settings } = useSiteSettings()

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

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
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo Section - Mobile Optimized */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {settings.site_logo && settings.site_logo !== '' && settings.site_logo !== '/logo.svg' && (
              <img
                src={settings.site_logo}
                alt={settings.site_name || 'ألوميتال برو'}
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain flex-shrink-0"
                onError={(e) => {
                  console.error('Logo image failed to load:', settings.site_logo)
                  e.currentTarget.style.display = 'none'
                }}
                onLoad={(e) => {
                  console.log('Logo image loaded successfully:', settings.site_logo)
                }}
                key={settings.site_logo}
              />
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-xl font-bold truncate" style={{ color: settings.primary_color || '#1a365d' }}>
                {typeof settings.site_name === 'string' ? settings.site_name : 'ألوميتال برو'}
              </span>
              <span className="text-xs sm:text-sm text-gray-600 truncate" style={{ color: settings.secondary_color || '#2d3748' }}>
                {typeof settings.site_tagline === 'string' ? settings.site_tagline : 'الجودة والأناقة'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Properly Hidden on Mobile */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions Section - Desktop Optimized */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {/* Search - Desktop Version */}
            <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200 transition-colors">
              <Search className="h-4 w-4" />
              <span>بحث...</span>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-xs text-white">
                  {itemsCount > 9 ? '9+' : itemsCount}
                </span>
              )}
            </Link>

            {/* User Menu - Desktop Version */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200 transition-colors"
              >
                <User className="h-5 w-5" />
                {user && (
                  <span className="text-sm font-medium">
                    {profile?.full_name?.split(' ')[0] || 'مستخدم'}
                  </span>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg bg-white shadow-lg border z-50">
                  {user ? (
                    <>
                      <div className="border-b px-4 py-3">
                        <p className="text-sm font-medium">{profile?.full_name || 'مستخدم'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        حسابي
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        طلباتي
                      </Link>
                      {isAdmin() && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 border-t transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          لوحة التحكم
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut()
                          setUserMenuOpen(false)
                        }}
                        className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t transition-colors"
                      >
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        إنشاء حساب
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions Section */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 md:hidden">
            {/* Search - Hidden on Small Mobile */}
            <button className="hidden sm:flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 transition-colors">
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">بحث...</span>
            </button>

            {/* Cart - Always Visible */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-accent-500 text-xs text-white">
                  {itemsCount > 9 ? '9+' : itemsCount}
                </span>
              )}
            </Link>

            {/* User Menu - Compact on Mobile */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-2 sm:px-3 hover:bg-gray-200 transition-colors"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                {user && (
                  <span className="hidden sm:inline text-xs font-medium">
                    {profile?.full_name?.split(' ')[0] || 'مستخدم'}
                  </span>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 sm:w-56 rounded-lg bg-white shadow-lg border z-50">
                  {user ? (
                    <>
                      <div className="border-b px-4 py-3">
                        <p className="text-sm font-medium truncate">{profile?.full_name || 'مستخدم'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        حسابي
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        طلباتي
                      </Link>
                      {isAdmin() && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 border-t transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          لوحة التحكم
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut()
                          setUserMenuOpen(false)
                        }}
                        className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t transition-colors"
                      >
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        إنشاء حساب
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button - Better Positioning */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Improved Layout */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <nav className="py-4">
              <div className="space-y-1">
                {/* Main Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-50 transition-colors rounded-lg mx-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Search in Mobile Menu */}
                <div className="px-4 py-2">
                  <button className="flex items-center gap-2 w-full rounded-lg bg-gray-100 px-4 py-3 text-sm hover:bg-gray-200 transition-colors">
                    <Search className="h-4 w-4" />
                    <span>بحث في المنتجات...</span>
                  </button>
                </div>

                {/* Contact Info in Mobile Menu */}
                <div className="px-4 py-3 border-t mt-2">
                  <div className="text-xs text-gray-600 space-y-1">
                    <p className="flex items-center gap-2">
                      📞 {settings.contact_phone || '+20 100 123 4567'}
                    </p>
                    <p className="flex items-center gap-2">
                      ✉️ {settings.contact_email || 'info@alupro.com'}
                    </p>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

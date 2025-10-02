'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  Settings,
  Star,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, signOut, isAdmin } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin()) {
    router.push('/')
    return null
  }

  const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم', roles: ['super_admin', 'admin', 'editor', 'support'] },
    { href: '/admin/pages', icon: Settings, label: 'إدارة الصفحات', roles: ['super_admin', 'admin', 'editor'] },
    { href: '/admin/products', icon: Package, label: 'المنتجات', roles: ['super_admin', 'admin', 'editor'] },
    { href: '/admin/orders', icon: ShoppingBag, label: 'الطلبات', roles: ['super_admin', 'admin'] },
    { href: '/admin/promo-codes', icon: Star, label: 'أكواد الخصم', roles: ['super_admin', 'admin'] },
    { href: '/admin/users', icon: Users, label: 'المستخدمين', roles: ['super_admin', 'admin'] },
    { href: '/admin/reviews', icon: Star, label: 'المراجعات', roles: ['super_admin', 'admin', 'editor'] },
    { href: '/admin/messages', icon: MessageSquare, label: 'الرسائل', roles: ['super_admin', 'admin', 'support'] },
  ]

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(profile?.role || 'user')
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-xl font-bold text-primary-500">لوحة التحكم</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-l z-50
          transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 border-b">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-bold text-primary-500">ألوميتال برو</span>
              <span className="text-sm text-gray-500">لوحة التحكم</span>
            </Link>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-bold">
                {profile?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{profile?.full_name || 'المدير'}</p>
                <p className="text-xs text-gray-500">{profile?.role}</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5 text-gray-600" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 w-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

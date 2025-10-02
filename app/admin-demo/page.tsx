'use client'

import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react'

export default function AdminDemoPage() {
  const stats = [
    { icon: Package, label: 'المنتجات', value: '156', color: 'blue' },
    { icon: ShoppingBag, label: 'الطلبات', value: '89', color: 'green' },
    { icon: Users, label: 'العملاء', value: '1,234', color: 'purple' },
    { icon: DollarSign, label: 'المبيعات', value: '245,000 ج.م', color: 'orange' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            لوحة التحكم التجريبية
          </h1>
          <p className="text-gray-600">
            هذه نسخة تجريبية من لوحة التحكم (بدون database)
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            📋 لتفعيل لوحة التحكم الكاملة:
          </h2>
          <ol className="space-y-3 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>شغّل <code className="bg-blue-100 px-2 py-1 rounded">supabase/schema.sql</code> في Supabase Dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>سجل حساب في <code className="bg-blue-100 px-2 py-1 rounded">/auth/register</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>عيّن نفسك كـ Super Admin في Supabase</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>اذهب إلى <code className="bg-blue-100 px-2 py-1 rounded">/admin</code></span>
            </li>
          </ol>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/auth/register"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-lg mb-2">📝 تسجيل حساب</h3>
            <p className="text-gray-600 text-sm">سجل حساب جديد للبدء</p>
          </a>

          <a
            href="/products"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-lg mb-2">🛍️ المنتجات</h3>
            <p className="text-gray-600 text-sm">تصفح صفحة المنتجات</p>
          </a>

          <a
            href="/"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-lg mb-2">🏠 الصفحة الرئيسية</h3>
            <p className="text-gray-600 text-sm">العودة للصفحة الرئيسية</p>
          </a>
        </div>
      </div>
    </div>
  )
}

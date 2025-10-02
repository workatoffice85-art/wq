'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Eye, FileText } from 'lucide-react'

export default function AdminPagesPage() {
  const pages = [
    {
      id: 'home',
      name: 'الصفحة الرئيسية',
      path: '/',
      sections: ['Hero', 'Featured Products', 'About', 'Stats', 'Reviews'],
      lastUpdated: '2024-01-15',
    },
    {
      id: 'about',
      name: 'من نحن',
      path: '/about',
      sections: ['Hero', 'Content', 'Values', 'Features'],
      lastUpdated: '2024-01-10',
    },
    {
      id: 'contact',
      name: 'اتصل بنا',
      path: '/contact',
      sections: ['Hero', 'Contact Form', 'Map', 'Info'],
      lastUpdated: '2024-01-08',
    },
    {
      id: 'faq',
      name: 'الأسئلة الشائعة',
      path: '/faq',
      sections: ['Hero', 'FAQ List'],
      lastUpdated: '2024-01-05',
    },
    {
      id: 'settings',
      name: 'إعدادات الموقع',
      path: '/admin/pages/settings',
      sections: ['Logo', 'Colors', 'Contact Info', 'Social Media'],
      lastUpdated: '2024-01-20',
    },
    {
      id: 'intro-video',
      name: 'فيديو الترحيب',
      path: '/admin/pages/intro-video',
      sections: ['Video Settings', 'Display Options'],
      lastUpdated: '2024-01-21',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الصفحات</h1>
        <p className="text-gray-600">تعديل محتوى جميع صفحات الموقع</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((page) => (
          <div key={page.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{page.name}</h3>
                  <p className="text-sm text-gray-500">{page.path}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">الأقسام:</p>
              <div className="flex flex-wrap gap-2">
                {page.sections.map((section, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-xs text-gray-500">
                آخر تحديث: {page.lastUpdated}
              </span>
              <div className="flex gap-2">
                <Link
                  href={page.path}
                  target="_blank"
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                  title="معاينة"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/pages/${page.id}`}
                  className="p-2 hover:bg-primary-50 rounded-lg text-primary-600 transition-colors"
                  title="تعديل"
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">💡 كيفية التعديل:</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• اضغط على زر "تعديل" لأي صفحة</li>
          <li>• عدّل النصوص والصور والألوان</li>
          <li>• معاينة التغييرات مباشرة</li>
          <li>• احفظ التغييرات</li>
        </ul>
      </div>
    </div>
  )
}

'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Calendar } from 'lucide-react'

export default function AccountPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

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

  if (!user) {
    router.push('/auth/login?redirect=/account')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">حسابي</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-6">المعلومات الشخصية</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">الاسم</p>
                    <p className="font-semibold">{profile?.full_name || 'غير محدد'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="font-semibold">{profile?.phone || 'غير محدد'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">تاريخ التسجيل</p>
                    <p className="font-semibold">
                      {new Date(profile?.created_at || '').toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary mt-6">
                تعديل المعلومات
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">روابط سريعة</h2>
              
              <div className="space-y-2">
                <a
                  href="/account/orders"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  طلباتي
                </a>
                <a
                  href="/account/settings"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  الإعدادات
                </a>
                <a
                  href="/account/addresses"
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  العناوين
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

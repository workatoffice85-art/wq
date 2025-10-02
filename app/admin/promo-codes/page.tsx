'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

interface PromoCode {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_uses: number
  used_count: number
  active: boolean
  valid_until?: string
}

export default function PromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([
    {
      id: '1',
      code: 'WELCOME10',
      discount_type: 'percentage',
      discount_value: 10,
      max_uses: 100,
      used_count: 23,
      active: true,
      valid_until: '2024-12-31'
    },
    {
      id: '2',
      code: 'SAVE50',
      discount_type: 'fixed',
      discount_value: 50,
      max_uses: 50,
      used_count: 12,
      active: true,
      valid_until: '2024-06-30'
    }
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('تم نسخ الكود!')
  }

  const handleToggleActive = (id: string) => {
    setCodes(codes.map(c => c.id === id ? { ...c, active: !c.active } : c))
    toast.success('تم تحديث حالة الكود')
  }

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكود؟')) {
      setCodes(codes.filter(c => c.id !== id))
      toast.success('تم حذف الكود')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">أكواد الخصم</h1>
          <p className="text-gray-600">إدارة أكواد الخصم والعروض</p>
        </div>
        <button
          onClick={() => {
            setEditingCode(null)
            setShowModal(true)
          }}
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5" />
          إضافة كود جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {codes.map((code) => (
          <div key={code.id} className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-2xl font-bold text-primary-500">{code.code}</code>
                  <button
                    onClick={() => handleCopy(code.code)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    code.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {code.active ? 'مفعّل' : 'معطّل'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الخصم:</span>
                <span className="font-semibold">
                  {code.discount_type === 'percentage' 
                    ? `${code.discount_value}%` 
                    : `${code.discount_value} ج.م`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الاستخدام:</span>
                <span className="font-semibold">{code.used_count} / {code.max_uses}</span>
              </div>
              {code.valid_until && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ينتهي في:</span>
                  <span className="font-semibold">{code.valid_until}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => handleToggleActive(code.id)}
                className="flex-1 btn btn-outline btn-sm"
              >
                {code.active ? 'تعطيل' : 'تفعيل'}
              </button>
              <button
                onClick={() => {
                  setEditingCode(code)
                  setShowModal(true)
                }}
                className="btn btn-outline btn-sm"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(code.id)}
                className="btn btn-outline btn-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingCode ? 'تعديل الكود' : 'إضافة كود جديد'}
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="label">الكود</label>
                <input
                  type="text"
                  className="input"
                  placeholder="WELCOME10"
                  defaultValue={editingCode?.code}
                />
              </div>

              <div>
                <label className="label">نوع الخصم</label>
                <select className="input" defaultValue={editingCode?.discount_type}>
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ج.م)</option>
                </select>
              </div>

              <div>
                <label className="label">قيمة الخصم</label>
                <input
                  type="number"
                  className="input"
                  placeholder="10"
                  defaultValue={editingCode?.discount_value}
                />
              </div>

              <div>
                <label className="label">عدد مرات الاستخدام</label>
                <input
                  type="number"
                  className="input"
                  placeholder="100"
                  defaultValue={editingCode?.max_uses}
                />
              </div>

              <div>
                <label className="label">تاريخ الانتهاء</label>
                <input
                  type="date"
                  className="input"
                  defaultValue={editingCode?.valid_until}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn btn-outline"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    toast.success('تم حفظ الكود!')
                    setShowModal(false)
                  }}
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

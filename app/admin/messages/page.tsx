'use client'

import { useState, useEffect } from 'react'
import { Mail, MailOpen, Trash2 } from 'lucide-react'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  useEffect(() => {
    // Mock data - in real app, fetch from Supabase
    const mockMessages = [
      {
        id: '1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '01001234567',
        subject: 'استفسار عن المطابخ',
        message: 'أريد الاستفسار عن أسعار المطابخ الألوميتال',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'فاطمة علي',
        email: 'fatma@example.com',
        phone: '01112345678',
        subject: 'طلب عرض سعر',
        message: 'أحتاج عرض سعر لباب ألوميتال',
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
    setMessages(mockMessages)
    setLoading(false)
  }, [])

  const markAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, is_read: true } : msg
    ))
  }

  const deleteMessage = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      setMessages(messages.filter(msg => msg.id !== id))
      setSelectedMessage(null)
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">الرسائل</h1>
        <p className="text-gray-600">إدارة رسائل العملاء</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold">الرسائل ({messages.length})</h2>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {messages.map((message) => (
              <button
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message)
                  markAsRead(message.id)
                }}
                className={`w-full text-right p-4 hover:bg-gray-50 transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                } ${!message.is_read ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {message.is_read ? (
                    <MailOpen className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                  ) : (
                    <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate ${!message.is_read ? 'text-blue-900' : 'text-gray-900'}`}>
                      {message.name}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-semibold">من:</span> {selectedMessage.name}</p>
                    <p><span className="font-semibold">البريد:</span> {selectedMessage.email}</p>
                    <p><span className="font-semibold">الهاتف:</span> {selectedMessage.phone}</p>
                    <p><span className="font-semibold">التاريخ:</span> {new Date(selectedMessage.created_at).toLocaleString('ar-EG')}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">الرسالة:</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="border-t mt-6 pt-6">
                <h3 className="font-semibold mb-3">الرد:</h3>
                <textarea
                  className="input mb-4"
                  rows={5}
                  placeholder="اكتب ردك هنا..."
                />
                <button className="btn btn-primary">
                  إرسال الرد
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">اختر رسالة لعرض تفاصيلها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

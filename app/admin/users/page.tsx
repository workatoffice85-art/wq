'use client'

import { useState, useEffect } from 'react'
import { Shield, Edit, Trash2, Search } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data - in real app, fetch from Supabase
    const mockUsers = [
      {
        id: '1',
        full_name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '01001234567',
        role: 'user',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        full_name: 'فاطمة علي',
        email: 'fatma@example.com',
        phone: '01112345678',
        role: 'user',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
    setUsers(mockUsers)
    setLoading(false)
  }, [])

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { label: string; color: string }> = {
      super_admin: { label: 'Super Admin', color: 'bg-red-100 text-red-800' },
      admin: { label: 'Admin', color: 'bg-blue-100 text-blue-800' },
      editor: { label: 'Editor', color: 'bg-purple-100 text-purple-800' },
      support: { label: 'Support', color: 'bg-green-100 text-green-800' },
      user: { label: 'User', color: 'bg-gray-100 text-gray-800' },
    }
    return roles[role] || roles.user
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    // In real app, update in Supabase
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
  }

  const deleteUser = async (userId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
          <p className="text-gray-600">عرض وإدارة جميع المستخدمين</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن مستخدم..."
            className="input pr-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">المستخدم</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">البريد الإلكتروني</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الهاتف</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الصلاحية</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">تاريخ التسجيل</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const roleBadge = getRoleBadge(user.role)
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-bold">
                          {user.full_name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-medium text-gray-900">{user.full_name || 'غير محدد'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge.color}`}
                      >
                        <option value="user">User</option>
                        <option value="support">Support</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

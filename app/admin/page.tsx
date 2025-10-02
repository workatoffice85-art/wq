import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Clock } from 'lucide-react'

export default function AdminDashboard() {
  // In real app, fetch from Supabase
  const stats = [
    { icon: Package, label: 'إجمالي المنتجات', value: '156', change: '+12%', color: 'blue' },
    { icon: ShoppingBag, label: 'الطلبات', value: '89', change: '+23%', color: 'green' },
    { icon: Users, label: 'العملاء', value: '1,234', change: '+8%', color: 'purple' },
    { icon: DollarSign, label: 'المبيعات', value: '245,000 ج.م', change: '+15%', color: 'orange' },
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'أحمد محمد', total: 25000, status: 'pending', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'فاطمة علي', total: 18500, status: 'confirmed', date: '2024-01-14' },
    { id: 'ORD-003', customer: 'محمد صلاح', total: 32000, status: 'shipped', date: '2024-01-13' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة'
      case 'confirmed': return 'مؤكد'
      case 'shipped': return 'تم الشحن'
      case 'delivered': return 'تم التسليم'
      default: return status
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p className="text-gray-600">مرحباً بك في لوحة تحكم ألوميتال برو</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                <TrendingUp className="h-4 w-4" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">أحدث الطلبات</h2>
            <a href="/admin/orders" className="text-primary-500 hover:text-primary-600 text-sm font-semibold">
              عرض الكل
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">رقم الطلب</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">العميل</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">المبلغ</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {order.total.toLocaleString('ar-EG')} ج.م
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

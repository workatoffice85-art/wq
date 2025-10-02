export function getOrderConfirmationEmail(order: any) {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { background: #f7fafc; padding: 20px; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ألوميتال برو</h1>
          <p>تأكيد الطلب</p>
        </div>
        <div class="content">
          <h2>شكراً لك ${order.customer_name}!</h2>
          <p>تم استلام طلبك بنجاح وسنتواصل معك قريباً.</p>

          <div class="order-details">
            <h3>تفاصيل الطلب</h3>
            <p><strong>رقم الطلب:</strong> ${order.order_number}</p>
            <p><strong>التاريخ:</strong> ${new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
            <p><strong>الحالة:</strong> قيد المراجعة</p>
            <p><strong>الإجمالي:</strong> ${order.total.toLocaleString('ar-EG')} جنيه</p>
          </div>

          <p>يمكنك متابعة حالة طلبك من خلال حسابك على الموقع.</p>
        </div>
        <div class="footer">
          <p>ألوميتال برو - الجودة والأناقة</p>
          <p>للاستفسارات: info@alupro.com | +20 100 123 4567</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getOrderStatusUpdateEmail(order: any, newStatus: string) {
  const statusText: Record<string, string> = {
    confirmed: 'تم تأكيد طلبك',
    preparing: 'جاري تحضير طلبك',
    shipped: 'تم شحن طلبك',
    delivered: 'تم تسليم طلبك',
  }

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { background: #f7fafc; padding: 20px; }
        .status { background: #38a169; color: white; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ألوميتال برو</h1>
          <p>تحديث حالة الطلب</p>
        </div>
        <div class="content">
          <h2>مرحباً ${order.customer_name}!</h2>

          <div class="status">
            <h3>${statusText[newStatus]}</h3>
            <p>رقم الطلب: ${order.order_number}</p>
          </div>

          <p>شكراً لاختيارك ألوميتال برو!</p>
        </div>
        <div class="footer">
          <p>ألوميتال برو - الجودة والأناقة</p>
          <p>للاستفسارات: info@alupro.com | +20 100 123 4567</p>
        </div>
      </div>
    </body>
    </html>
  `
}

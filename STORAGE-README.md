# Alumetal Pro - Storage Setup Guide

## نظرة عامة
هذا الدليل يوضح كيفية إعداد وتكوين نظام التخزين (Storage) في Supabase لمشروع ألوميتال برو.

## الملفات المطلوبة

### 1. `storage-setup.sql`
الملف الأساسي لإعداد Buckets التخزين وسياسات الأمان الأساسية.

### 2. `storage-advanced-policies.sql`
ملف إضافي يحتوي على سياسات متقدمة للأمان والمراقبة.

## خطوات الإعداد

### الخطوة 1: إنشاء Buckets التخزين

1. اذهب إلى Supabase Dashboard
2. اختر Storage من القائمة الجانبية
3. انقر على "New bucket" وأنشئ المجلدات التالية:

| Bucket Name | Public | الوصف |
|-------------|---------|--------|
| `products-images` | ✅ عام | صور المنتجات |
| `site-assets` | ✅ عام | أصول الموقع (شعارات، لافتات) |
| `user-avatars` | ✅ عام | صور الملفات الشخصية |
| `intro-videos` | ✅ عام | فيديوهات المقدمة |
| `admin-uploads` | ❌ خاص | ملفات خاصة بالمشرفين |

### الخطوة 2: تشغيل ملفات SQL

#### الطريقة الأولى: Supabase Dashboard
1. اذهب إلى SQL Editor في Supabase Dashboard
2. انسخ محتوى `storage-setup.sql` والصقها
3. شغل الاستعلام
4. كرر العملية مع `storage-advanced-policies.sql`

#### الطريقة الثانية: Supabase CLI
```bash
# تشغيل الملف الأساسي
psql -h [YOUR_DB_HOST] -p 5432 -U postgres -d postgres -f storage-setup.sql

# تشغيل السياسات المتقدمة
psql -h [YOUR_DB_HOST] -p 5432 -U postgres -d postgres -f storage-advanced-policies.sql
```

### الخطوة 3: إعداد CORS

في Supabase Dashboard → Storage → Settings:

```
Allowed Origins: https://yourdomain.com, http://localhost:3000
Allowed Headers: authorization, x-client-info, apikey, content-type
Allowed Methods: GET, POST, PUT, DELETE
Max Age: 3600
```

### الخطوة 4: اختبار النظام

```javascript
// مثال على رفع ملف صورة منتج
const { data, error } = await supabase.storage
  .from('products-images')
  .upload('product-id/image.jpg', file)

// الحصول على رابط عام للملف
const { data: urlData } = supabase.storage
  .from('products-images')
  .getPublicUrl('product-id/image.jpg')

// حذف ملف
await supabase.storage
  .from('products-images')
  .remove(['product-id/image.jpg'])
```

## هيكل المجلدات المقترح

```
products-images/
├── product-id-1/
│   ├── main.jpg
│   ├── gallery-1.jpg
│   └── gallery-2.jpg
└── product-id-2/
    ├── main.jpg
    └── gallery-1.jpg

site-assets/
├── logos/
│   ├── light-logo.png
│   └── dark-logo.png
├── banners/
│   ├── hero-banner.jpg
│   └── promotional-banner.jpg
└── icons/
    ├── favicon.ico
    └── touch-icon.png

user-avatars/
├── user-id-1/
│   └── avatar.jpg
└── user-id-2/
    └── avatar.jpg

intro-videos/
├── main-intro.mp4
└── thumbnail.jpg

admin-uploads/
└── reports/
    └── monthly-report.pdf
```

## الأمان والأذونات

### مستويات الوصول:

1. **عام (Public)**:
   - `products-images`: يمكن للجميع قراءة الصور
   - `site-assets`: يمكن للجميع قراءة الأصول
   - `user-avatars`: يمكن للجميع قراءة الصور الشخصية
   - `intro-videos`: يمكن للجميع مشاهدة الفيديوهات

2. **خاص (Private)**:
   - `admin-uploads`: فقط المشرفون يمكنهم الوصول

### قيود الأمان:
- ✅ تحقق من نوع الملف
- ✅ تحقق من حجم الملف (حد أقصى 10MB)
- ✅ منع هجمات directory traversal
- ✅ أسماء ملفات آمنة
- ✅ تتبع الاستخدام والحصص

## استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في الأذونات**:
   ```sql
   -- تحقق من أن المستخدم لديه صلاحيات كافية
   SELECT * FROM public.profiles WHERE id = auth.uid();
   ```

2. **حجم الملف كبير جداً**:
   - تحقق من إعدادات file_size_limit في البucket
   - افتراضياً: 10MB للصور، 100MB للفيديوهات

3. **نوع الملف غير مدعوم**:
   ```sql
   -- تحقق من allowed_mime_types في البucket
   SELECT * FROM storage.buckets WHERE id = 'your-bucket-id';
   ```

## الصيانة والمراقبة

### مراقبة الاستخدام:
```sql
-- عرض استخدام التخزين لكل مستخدم
SELECT * FROM public.storage_usage ORDER BY total_size DESC;

-- مراقبة نشاط الملفات
SELECT * FROM public.activity_logs
WHERE entity_type = 'storage'
ORDER BY created_at DESC LIMIT 100;
```

### التنظيف التلقائي:
```sql
-- حذف الملفات المؤقتة القديمة
SELECT cleanup_old_files();

-- حذف صور المنتجات المحذوفة
DELETE FROM storage.objects
WHERE bucket_id = 'products-images'
AND NOT EXISTS (
  SELECT 1 FROM public.products p
  WHERE p.id::text = (string_to_array(name, '/'))[1]
);
```

## ملاحظات مهمة

1. **النسخ الاحتياطي**: تأكد من عمل نسخ احتياطية منتظمة للبيانات
2. **التكلفة**: راقب استخدام التخزين للسيطرة على التكاليف
3. **الأداء**: استخدم CDN للصور العامة لتحسين الأداء
4. **الأمان**: لا تخزن ملفات حساسة في buckets عامة

## الدعم

للمساعدة أو الاستفسارات، يرجى مراجعة:
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---
تم إنشاء هذا الدليل بواسطة نظام إدارة المشروع - ألوميتال برو

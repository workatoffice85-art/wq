# 🚀 دليل استخدام أدوات النظام الجديدة
# ======================================

## 📋 الأدوات المتاحة:

### 1️⃣ system-tools.ps1 - أدوات فحص النظام
```powershell
# فحص حالة النظام
.\system-tools.ps1 -CheckSystem

# اختبار نظام الصور
.\system-tools.ps1 -TestImages

# فحص API endpoints
.\system-tools.ps1 -CheckAPI

# فحص صفحة الإدارة
.\system-tools.ps1 -TestAdmin

# اختبار شامل للنظام
.\system-tools.ps1 -FullTest
```

### 2️⃣ project-tools.ps1 - أدوات المشروع
```powershell
# فحص حالة المشروع
.\project-tools.ps1 -Status

# تثبيت التبعيات
.\project-tools.ps1 -InstallDeps

# تنظيف الكاش
.\project-tools.ps1 -ClearCache

# تشغيل المشروع
.\project-tools.ps1 -StartDev

# بناء المشروع
.\project-tools.ps1 -Build

# اختبار الموقع محلياً
.\project-tools.ps1 -TestLocal
```

### 3️⃣ database-tools.ps1 - أدوات قاعدة البيانات
```powershell
# فحص اتصال Supabase
.\database-tools.ps1 -CheckConnection

# عرض ملف SQL للتنفيذ
.\database-tools.ps1 -CreateTables

# إصلاح صلاحيات قاعدة البيانات
.\database-tools.ps1 -FixPermissions

# اختبار إعدادات الموقع
.\database-tools.ps1 -TestSettings

# إضافة بيانات تجريبية
.\database-tools.ps1 -AddTestData
```

## 🎯 كيفية الاستخدام:

### الخطوة 1: تشغيل أداة فحص النظام
```powershell
.\system-tools.ps1 -FullTest
```

### الخطوة 2: تشغيل المشروع
```powershell
.\project-tools.ps1 -InstallDeps
.\project-tools.ps1 -StartDev
```

### الخطوة 3: فحص قاعدة البيانات
```powershell
.\database-tools.ps1 -CheckConnection
.\database-tools.ps1 -CreateTables
```

### الخطوة 4: اختبار الموقع
```powershell
# في المتصفح اذهب إلى:
# http://localhost:3000 - الصفحة الرئيسية
# http://localhost:3000/admin - لوحة الإدارة
# http://localhost:3000/products - المنتجات
```

## 🔧 حل المشاكل الشائعة:

### إذا لم يعمل المشروع:
```powershell
.\project-tools.ps1 -ClearCache
.\project-tools.ps1 -InstallDeps
.\project-tools.ps1 -StartDev
```

### إذا لم تظهر الصور:
```powershell
.\database-tools.ps1 -FixPermissions
# ثم اذهب إلى Supabase ونفذ ملف create-site-settings-final.sql
```

### إذا لم تعمل صفحة الإدارة:
```powershell
.\database-tools.ps1 -CheckConnection
# تأكد من وجود المستخدم في Supabase Auth
```

## ✨ المميزات الجديدة:

✅ **أدوات فعلية** - تنفذ العمليات الحقيقية وليس طباعة نصوص فقط
✅ **فحص شامل** - تتحقق من جميع ملفات ومجلدات النظام
✅ **تشخيص دقيق** - تعطي تفاصيل واضحة عن حالة كل جزء
✅ **إصلاح تلقائي** - تحل المشاكل الشائعة تلقائياً
✅ **سهولة الاستخدام** - واجهة بسيطة وواضحة

## 🚀 البدء السريع:

1. شغل فحص شامل: `.\system-tools.ps1 -FullTest`
2. شغل المشروع: `.\project-tools.ps1 -StartDev`
3. اذهب إلى الموقع واختبر جميع المميزات
4. إذا واجهت مشاكل، استخدم الأدوات لإصلاحها

🎊 **النظام جاهز للاستخدام بالكامل!**

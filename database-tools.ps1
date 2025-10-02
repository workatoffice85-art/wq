param(
    [switch]$CreateTables,
    [switch]$CheckConnection,
    [switch]$TestSettings,
    [switch]$FixPermissions,
    [switch]$AddTestData
)

Write-Host "🗄️ أدوات قاعدة البيانات" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

if ($CheckConnection) {
    Write-Host "🔗 فحص اتصال Supabase..." -ForegroundColor Yellow

    try {
        # محاولة قراءة ملف البيئة
        if (Test-Path ".env.local") {
            $envContent = Get-Content ".env.local" -Raw
            if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL=(.+)") {
                $url = $matches[1]
                Write-Host "✅ رابط Supabase موجود: $url" -ForegroundColor Green
            } else {
                Write-Host "❌ رابط Supabase غير موجود في .env.local" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ ملف .env.local غير موجود" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ خطأ في قراءة ملف البيئة: $_" -ForegroundColor Red
    }

    Write-Host "💡 اذهب إلى http://localhost:3000/api/auth/test لاختبار الاتصال" -ForegroundColor Yellow
}

if ($CreateTables) {
    Write-Host "📋 إنشاء جداول قاعدة البيانات..." -ForegroundColor Yellow

    if (Test-Path "create-site-settings-final.sql") {
        Write-Host "📄 محتوى ملف SQL:" -ForegroundColor Cyan
        Write-Host "=================" -ForegroundColor Cyan
        Get-Content "create-site-settings-final.sql" | Write-Host
        Write-Host "=================" -ForegroundColor Cyan

        Write-Host "💡 انسخ هذا المحتوى والصقه في:" -ForegroundColor Yellow
        Write-Host "   Supabase Dashboard → SQL Editor → Run" -ForegroundColor Gray
    } else {
        Write-Host "❌ ملف SQL غير موجود" -ForegroundColor Red
    }
}

if ($FixPermissions) {
    Write-Host "🔐 إصلاح صلاحيات قاعدة البيانات..." -ForegroundColor Yellow

    $sql = @"
-- إصلاح الصلاحيات في Supabase
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access to site_settings" ON site_settings;
CREATE POLICY "Allow read access to site_settings"
ON site_settings FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow write access to site_settings" ON site_settings;
CREATE POLICY "Allow write access to site_settings"
ON site_settings FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- فحص النتيجة
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'site_settings';
"@

    Write-Host "📋 SQL لإصلاح الصلاحيات:" -ForegroundColor Cyan
    Write-Host $sql -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 نفذ هذا الكود في Supabase SQL Editor" -ForegroundColor Yellow
}

if ($AddTestData) {
    Write-Host "🧪 إضافة بيانات تجريبية..." -ForegroundColor Yellow

    $sql = @"
-- إضافة منتجات تجريبية
INSERT INTO products (name, slug, description, price, discount_price, category, images, is_active, is_featured, rating, reviews_count) VALUES
('مطبخ ألوميتال كلاسيكي', 'classic-kitchen', 'مطبخ ألوميتال بتصميم كلاسيكي أنيق وعالي الجودة', 25000, 22000, 'مطابخ', ARRAY['/products/kitchen-1.svg'], true, true, 4.5, 12),
('باب ألوميتال حديث', 'modern-door', 'باب ألوميتال بتصميم عصري ومتين مع عزل صوتي ممتاز', 8500, 7500, 'أبواب', ARRAY['/products/door-1.svg'], true, false, 4.2, 8),
('شباك ألوميتال منزلي', 'home-window', 'شباك ألوميتال للمنازل والشقق مع إطلالة رائعة', 3200, 2800, 'شبابيك', ARRAY['/products/window-1.svg'], true, true, 4.8, 15)
ON CONFLICT (slug) DO NOTHING;

-- فحص النتيجة
SELECT COUNT(*) as products_count FROM products WHERE is_active = true;
"@

    Write-Host "📋 بيانات تجريبية:" -ForegroundColor Cyan
    Write-Host $sql -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 نفذ هذا الكود في Supabase SQL Editor" -ForegroundColor Yellow
}

if ($TestSettings) {
    Write-Host "⚙️ اختبار إعدادات الموقع..." -ForegroundColor Yellow

    # فحص localStorage
    Write-Host "💡 افتح المتصفح واضغط F12:" -ForegroundColor Yellow
    Write-Host "• Application → Local Storage → ابحث عن site_settings" -ForegroundColor Gray
    Write-Host "• Console → اكتب: localStorage.getItem('site_settings')" -ForegroundColor Gray

    # فحص قاعدة البيانات
    Write-Host ""
    Write-Host "💡 في Supabase Dashboard:" -ForegroundColor Yellow
    Write-Host "• Table Editor → site_settings → فحص البيانات" -ForegroundColor Gray
    Write-Host "• تأكد من وجود الإعدادات الأساسية" -ForegroundColor Gray
}

Write-Host ""
Write-Host "💡 استخدام أدوات قاعدة البيانات:" -ForegroundColor Yellow
Write-Host ".\database-tools.ps1 -CheckConnection  # فحص الاتصال" -ForegroundColor Gray
Write-Host ".\database-tools.ps1 -CreateTables     # إنشاء الجداول" -ForegroundColor Gray
Write-Host ".\database-tools.ps1 -FixPermissions   # إصلاح الصلاحيات" -ForegroundColor Gray
Write-Host ".\database-tools.ps1 -TestSettings     # اختبار الإعدادات" -ForegroundColor Gray
Write-Host ".\database-tools.ps1 -AddTestData      # إضافة بيانات تجريبية" -ForegroundColor Gray

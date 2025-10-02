param(
    [switch]$StartDev,
    [switch]$Build,
    [switch]$TestLocal,
    [switch]$ClearCache,
    [switch]$InstallDeps,
    [switch]$Status
)

Write-Host "🚀 أدوات تشغيل واختبار المشروع" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

if ($Status) {
    Write-Host "📊 حالة المشروع الحالية:" -ForegroundColor Yellow

    # فحص إذا كان المشروع يعمل
    $processes = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" }
    if ($processes) {
        Write-Host "✅ المشروع يعمل بالفعل على: http://localhost:3000" -ForegroundColor Green
    } else {
        Write-Host "❌ المشروع متوقف" -ForegroundColor Red
    }

    # فحص التبعيات
    if (Test-Path "node_modules") {
        $nodeModules = Get-ChildItem "node_modules" -Directory | Measure-Object
        Write-Host "✅ التبعيات مثبتة ($($nodeModules.Count) حزمة)" -ForegroundColor Green
    } else {
        Write-Host "❌ التبعيات غير مثبتة" -ForegroundColor Red
    }

    # فحص متغيرات البيئة
    if (Test-Path ".env.local") {
        Write-Host "✅ ملف متغيرات البيئة موجود" -ForegroundColor Green
    } else {
        Write-Host "❌ ملف متغيرات البيئة مفقود" -ForegroundColor Red
    }

    Write-Host "✨ فحص الحالة مكتمل!" -ForegroundColor Cyan
}

if ($InstallDeps) {
    Write-Host "📦 تثبيت التبعيات..." -ForegroundColor Yellow

    if (Test-Path "package.json") {
        Write-Host "🔄 تشغيل npm install..." -ForegroundColor Cyan
        & npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ التبعيات تم تثبيتها بنجاح!" -ForegroundColor Green
        } else {
            Write-Host "❌ فشل في تثبيت التبعيات" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ ملف package.json غير موجود" -ForegroundColor Red
    }
}

if ($ClearCache) {
    Write-Host "🧹 تنظيف الكاش..." -ForegroundColor Yellow

    # حذف مجلد .next
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
        Write-Host "✅ تم حذف مجلد .next" -ForegroundColor Green
    }

    # حذف node_modules (اختياري)
    Write-Host "❓ حذف node_modules أيضاً؟ (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq 'y' -or $response -eq 'Y') {
        if (Test-Path "node_modules") {
            Remove-Item "node_modules" -Recurse -Force
            Write-Host "✅ تم حذف node_modules" -ForegroundColor Green
            Write-Host "💡 شغل npm install بعدها" -ForegroundColor Yellow
        }
    }

    Write-Host "✨ التنظيف مكتمل!" -ForegroundColor Cyan
}

if ($StartDev) {
    Write-Host "🚀 تشغيل المشروع في وضع التطوير..." -ForegroundColor Yellow

    # فحص التبعيات أولاً
    if (-not (Test-Path "node_modules")) {
        Write-Host "⚠️ التبعيات غير مثبتة، تثبيتها أولاً..." -ForegroundColor Yellow
        & npm install
    }

    Write-Host "🔄 تشغيل npm run dev..." -ForegroundColor Cyan
    Start-Process "npm" -ArgumentList "run dev" -NoNewWindow
    Write-Host "✅ تم تشغيل المشروع!" -ForegroundColor Green
    Write-Host "🌐 الموقع متاح على: http://localhost:3000" -ForegroundColor Cyan
}

if ($Build) {
    Write-Host "🏗️ بناء المشروع للإنتاج..." -ForegroundColor Yellow

    if (-not (Test-Path "node_modules")) {
        Write-Host "⚠️ تثبيت التبعيات أولاً..." -ForegroundColor Yellow
        & npm install
    }

    Write-Host "🔄 تشغيل npm run build..." -ForegroundColor Cyan
    & npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ تم بناء المشروع بنجاح!" -ForegroundColor Green
        Write-Host "📁 الملفات في مجلد .next جاهزة للنشر" -ForegroundColor Cyan
    } else {
        Write-Host "❌ فشل في بناء المشروع" -ForegroundColor Red
    }
}

if ($TestLocal) {
    Write-Host "🌐 اختبار الموقع محلياً..." -ForegroundColor Yellow

    # فحص إذا كان المشروع يعمل
    $processes = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" }
    if (-not $processes) {
        Write-Host "⚠️ المشروع غير يعمل، تشغيله أولاً..." -ForegroundColor Yellow
        Start-Process "npm" -ArgumentList "run dev" -NoNewWindow
        Start-Sleep -Seconds 3
    }

    Write-Host "🔗 روابط الاختبار:" -ForegroundColor Cyan
    Write-Host "• الصفحة الرئيسية: http://localhost:3000" -ForegroundColor Gray
    Write-Host "• لوحة الإدارة: http://localhost:3000/admin" -ForegroundColor Gray
    Write-Host "• صفحة المنتجات: http://localhost:3000/products" -ForegroundColor Gray
    Write-Host "• صفحة الدفع: http://localhost:3000/checkout" -ForegroundColor Gray

    Write-Host "💡 افتح هذه الروابط في المتصفح للاختبار" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 استخدام الأدوات:" -ForegroundColor Yellow
Write-Host ".\project-tools.ps1 -Status        # فحص حالة المشروع" -ForegroundColor Gray
Write-Host ".\project-tools.ps1 -InstallDeps   # تثبيت التبعيات" -ForegroundColor Gray
Write-Host ".\project-tools.ps1 -ClearCache    # تنظيف الكاش" -ForegroundColor Gray
Write-Host ".\project-tools.ps1 -StartDev      # تشغيل المشروع" -ForegroundColor Gray
Write-Host ".\project-tools.ps1 -Build         # بناء المشروع" -ForegroundColor Gray
Write-Host ".\project-tools.ps1 -TestLocal     # اختبار الموقع" -ForegroundColor Gray

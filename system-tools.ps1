param(
    [switch]$CheckSystem,
    [switch]$TestImages,
    [switch]$FixDatabase,
    [switch]$CheckAPI,
    [switch]$TestAdmin,
    [switch]$FullTest
)

Write-Host "🚀 أدوات اختبار وإصلاح النظام" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

if ($CheckSystem) {
    Write-Host "🔍 فحص حالة النظام..." -ForegroundColor Yellow

    # فحص الملفات الأساسية
    $files = @("package.json", "next.config.js", "tailwind.config.js", "tsconfig.json")
    foreach ($file in $files) {
        if (Test-Path $file) {
            Write-Host "✅ $file موجود" -ForegroundColor Green
        } else {
            Write-Host "❌ $file مفقود" -ForegroundColor Red
        }
    }

    # فحص المجلدات
    $dirs = @("app", "components", "hooks", "lib")
    foreach ($dir in $dirs) {
        if (Test-Path $dir) {
            $count = (Get-ChildItem $dir -Recurse -File | Measure-Object).Count
            Write-Host "✅ مجلد $dir يحتوي على $count ملف" -ForegroundColor Green
        } else {
            Write-Host "❌ مجلد $dir مفقود" -ForegroundColor Red
        }
    }

    Write-Host "✨ فحص النظام مكتمل!" -ForegroundColor Cyan
}

if ($TestImages) {
    Write-Host "🖼️ اختبار نظام الصور..." -ForegroundColor Yellow

    # فحص ملف اللوجو
    if (Test-Path "public\logo.svg") {
        Write-Host "✅ ملف logo.svg موجود في public" -ForegroundColor Green
    } else {
        Write-Host "❌ ملف logo.svg مفقود في public" -ForegroundColor Red
    }

    # فحص مجلد الصور
    if (Test-Path "public\products") {
        $images = Get-ChildItem "public\products" -File | Measure-Object
        Write-Host "✅ مجلد products يحتوي على $($images.Count) ملف" -ForegroundColor Green
    } else {
        Write-Host "❌ مجلد products غير موجود في public" -ForegroundColor Red
    }

    Write-Host "✨ اختبار الصور مكتمل!" -ForegroundColor Cyan
}

if ($FixDatabase) {
    Write-Host "🛠️ إصلاح قاعدة البيانات..." -ForegroundColor Yellow

    # فحص ملف SQL
    if (Test-Path "create-site-settings-final.sql") {
        Write-Host "✅ ملف SQL موجود" -ForegroundColor Green
        Write-Host "📋 المحتوى:" -ForegroundColor Cyan
        Get-Content "create-site-settings-final.sql" | Write-Host
    } else {
        Write-Host "❌ ملف SQL غير موجود" -ForegroundColor Red
    }

    Write-Host "💡 نفذ هذا الملف في Supabase Dashboard -> SQL Editor" -ForegroundColor Yellow
    Write-Host "✨ إصلاح قاعدة البيانات مكتمل!" -ForegroundColor Cyan
}

if ($CheckAPI) {
    Write-Host "🌐 فحص API endpoints..." -ForegroundColor Yellow

    $apis = @(
        "app\api\auth\test\route.ts",
        "app\api\products\route.ts",
        "app\api\orders\route.ts",
        "app\api\promo\validate\route.ts"
    )

    foreach ($api in $apis) {
        if (Test-Path $api) {
            Write-Host "✅ $api موجود" -ForegroundColor Green
        } else {
            Write-Host "❌ $api مفقود" -ForegroundColor Red
        }
    }

    Write-Host "✨ فحص API مكتمل!" -ForegroundColor Cyan
}

if ($TestAdmin) {
    Write-Host "👨‍💼 فحص صفحة الإدارة..." -ForegroundColor Yellow

    $adminFiles = @(
        "app\admin\layout.tsx",
        "app\admin\pages\page.tsx",
        "app\admin\pages\settings\page.tsx",
        "app\admin\pages\products\page.tsx"
    )

    foreach ($file in $adminFiles) {
        if (Test-Path $file) {
            Write-Host "✅ $file موجود" -ForegroundColor Green
        } else {
            Write-Host "❌ $file مفقود" -ForegroundColor Red
        }
    }

    Write-Host "✨ فحص الإدارة مكتمل!" -ForegroundColor Cyan
}

if ($FullTest) {
    Write-Host "🔬 اختبار شامل للنظام..." -ForegroundColor Yellow

    Write-Host "📋 فحص الملفات الأساسية:" -ForegroundColor Cyan
    $essential = @("package.json", ".env.local", "README.md")
    foreach ($file in $essential) {
        if (Test-Path $file) {
            Write-Host "✅ $file موجود" -ForegroundColor Green
        } else {
            Write-Host "❌ $file مفقود" -ForegroundColor Red
        }
    }

    Write-Host "📋 فحص المكونات:" -ForegroundColor Cyan
    $components = Get-ChildItem "components" -Recurse -File | Measure-Object
    Write-Host "✅ $($components.Count) مكون React موجود" -ForegroundColor Green

    Write-Host "📋 فحص صفحات الموقع:" -ForegroundColor Cyan
    $pages = Get-ChildItem "app" -Recurse -Name "*.tsx" | Where-Object { $_ -notlike "*admin*" }
    Write-Host "✅ $(($pages | Measure-Object).Count) صفحة للمستخدمين" -ForegroundColor Green

    Write-Host "📋 فحص صفحات الإدارة:" -ForegroundColor Cyan
    $adminPages = Get-ChildItem "app" -Recurse -Name "*.tsx" | Where-Object { $_ -like "*admin*" }
    Write-Host "✅ $(($adminPages | Measure-Object).Count) صفحة إدارة" -ForegroundColor Green

    Write-Host "✨ الاختبار الشامل مكتمل!" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "💡 استخدام الأدوات:" -ForegroundColor Yellow
Write-Host ".\system-tools.ps1 -CheckSystem    # فحص النظام" -ForegroundColor Gray
Write-Host ".\system-tools.ps1 -TestImages     # اختبار الصور" -ForegroundColor Gray
Write-Host ".\system-tools.ps1 -FixDatabase    # إصلاح قاعدة البيانات" -ForegroundColor Gray
Write-Host ".\system-tools.ps1 -CheckAPI       # فحص API" -ForegroundColor Gray
Write-Host ".\system-tools.ps1 -TestAdmin      # فحص الإدارة" -ForegroundColor Gray
Write-Host ".\system-tools.ps1 -FullTest       # اختبار شامل" -ForegroundColor Gray

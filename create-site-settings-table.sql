-- إنشاء جدول site_settings إذا لم يكن موجود
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  category VARCHAR(50) DEFAULT 'general',
  updated_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تفعيل Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- سياسة القراءة العامة (للسماح بعرض إعدادات الموقع)
DROP POLICY IF EXISTS "Allow read access to site_settings" ON site_settings;
CREATE POLICY "Allow read access to site_settings"
ON site_settings FOR SELECT
USING (true);

-- سياسة الكتابة للمستخدمين المسجلين فقط
DROP POLICY IF EXISTS "Allow write access to site_settings" ON site_settings;
CREATE POLICY "Allow write access to site_settings"
ON site_settings FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- إضافة بعض الإعدادات الافتراضية
INSERT INTO site_settings (key, value, category) VALUES
('site_name', 'ألوميتال برو', 'general'),
('site_tagline', 'الجودة والأناقة في منتجات الألوميتال', 'general'),
('contact_phone', '+20 100 123 4567', 'contact'),
('contact_email', 'info@alupro.com', 'contact'),
('primary_color', '#2563eb', 'colors'),
('secondary_color', '#1e40af', 'colors'),
('footer_text', '© 2024 ألوميتال برو. جميع الحقوق محفوظة.', 'footer')
ON CONFLICT (key) DO NOTHING;

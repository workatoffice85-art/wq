-- إنشاء جدول site_settings بالأسماء الصحيحة
DROP TABLE IF EXISTS site_settings CASCADE;

CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_category VARCHAR(50) DEFAULT 'general',
  updated_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تفعيل Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- سياسة القراءة العامة
DROP POLICY IF EXISTS "Allow read access to site_settings" ON site_settings;
CREATE POLICY "Allow read access to site_settings"
ON site_settings FOR SELECT
USING (true);

-- سياسة الكتابة للمستخدمين المسجلين
DROP POLICY IF EXISTS "Allow write access to site_settings" ON site_settings;
CREATE POLICY "Allow write access to site_settings"
ON site_settings FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- إضافة الإعدادات الافتراضية
INSERT INTO site_settings (setting_key, setting_value, setting_category) VALUES
('site_name', 'ألوميتال برو', 'general');

INSERT INTO site_settings (setting_key, setting_value, setting_category) VALUES
('site_tagline', 'الجودة والأناقة في منتجات الألوميتال', 'general');

INSERT INTO site_settings (setting_key, setting_value, setting_category) VALUES
('contact_phone', '+20 100 123 4567', 'contact');

INSERT INTO site_settings (setting_key, setting_value, setting_category) VALUES
('contact_email', 'info@alupro.com', 'contact');

INSERT INTO site_settings (setting_key, setting_value, setting_category) VALUES
('primary_color', '#2563eb', 'colors');

INSERT INTO site_settings (setting_key, setting_value, setting_category) VALUES
('secondary_color', '#1e40af', 'colors');

INSERT INTO site_settings (setting_key, setting_value, setting_category) VALUES
('footer_text', '© 2024 ألوميتال برو. جميع الحقوق محفوظة.', 'footer');

-- فحص النتيجة
SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key;

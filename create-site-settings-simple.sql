-- حل بديل إذا استمرت المشكلة
-- استخدم هذا إذا لم يعمل الحل السابق

-- فحص الجداول الموجودة أولاً
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- إنشاء جدول بسيط بدون تعقيدات
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

-- إضافة صلاحيات بسيطة
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_read" ON site_settings;
CREATE POLICY "site_settings_read" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "site_settings_write" ON site_settings;
CREATE POLICY "site_settings_write" ON site_settings FOR ALL USING (true);

-- إضافة البيانات بالطريقة الأبسط
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
SELECT * FROM site_settings ORDER BY setting_key;

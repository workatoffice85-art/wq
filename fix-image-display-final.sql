-- حل مشكلة عرض الصور بشكل مختلف بعد الريفريش
-- هذه المشكلة تحدث عادة بسبب مشاكل في استرجاع البيانات أو عرضها

-- خطوات الحل:

-- 1. حذف الجدول الحالي وإعادة إنشاؤه بالطريقة الصحيحة
DROP TABLE IF EXISTS site_settings CASCADE;

CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT, -- استخدم TEXT بدلاً من VARCHAR لتجنب مشاكل الترميز
  setting_category VARCHAR(50) DEFAULT 'general',
  updated_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. إضافة صلاحيات صحيحة
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- حذف السياسات القديمة إن وجدت
DROP POLICY IF EXISTS "Allow read access to site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow write access to site_settings" ON site_settings;

-- إضافة سياسات جديدة واضحة
CREATE POLICY "site_settings_read_policy" ON site_settings
FOR SELECT USING (true);

CREATE POLICY "site_settings_write_policy" ON site_settings
FOR ALL USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. إضافة البيانات بالطريقة الصحيحة (واحدة تلو الأخرى)
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

-- 4. فحص النتيجة
SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key;

-- 5. إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

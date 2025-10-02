'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Eye, ArrowLeft, Upload, Palette } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'
import { supabase } from '@/lib/supabase/client'

export default function EditSettingsPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    // General
    site_name: 'ألوميتال برو',
    site_tagline: 'الجودة والأناقة في منتجات الألوميتال',
    site_logo: '',

    // Contact
    contact_phone: '+20 100 123 4567',
    contact_email: 'info@alupro.com',
    contact_address: 'القاهرة، مصر',
    contact_whatsapp: '+20 100 123 4567',

    // Social Media
    facebook_url: 'https://facebook.com/alupro',
    instagram_url: 'https://instagram.com/alupro',
    twitter_url: 'https://twitter.com/alupro',

    // Colors
    primary_color: '#2563eb',
    secondary_color: '#1e40af',

    // Footer
    footer_text: '© 2024 ألوميتال برو. جميع الحقوق محفوظة.',

    // Intro Video Settings
    intro_video_enabled: false,
    intro_video_url: '',
    intro_video_can_skip: true,
    intro_video_autoplay: true,
    intro_video_show_once: true,
    intro_video_skip_delay: 3,

    // Background Images
    hero_background: '',
    images_background: '',
  })

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('site_settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error)
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('يجب تسجيل الدخول أولاً')
        setSaving(false)
        return
      }

      // Convert settings object to array for Supabase
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
        setting_category: 'general',
        updated_by: user.id
      }))

      // Upsert each setting
      for (const setting of settingsArray) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(
            {
              setting_key: setting.setting_key,
              setting_value: setting.setting_value,
              setting_category: setting.setting_category,
              updated_by: setting.updated_by,
              updated_at: new Date().toISOString()
            },
            {
              onConflict: 'setting_key'
            }
          )

        if (error) {
          console.error('Error saving setting:', setting.setting_key, error)
        }
      }

      // Also save to localStorage as backup
      localStorage.setItem('site_settings', JSON.stringify(settings))

      toast.success('تم حفظ الإعدادات بنجاح في Database! ✅')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    window.open('/', '_blank')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إعدادات الموقع</h1>
            <p className="text-gray-600">تعديل جميع إعدادات الموقع</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePreview} className="btn btn-outline">
            <Eye className="h-5 w-5" />
            معاينة
          </button>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            <Save className="h-5 w-5" />
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Editor */}
        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">الإعدادات العامة</h3>

            <div className="space-y-4">
              <div>
                <label className="label">اسم الموقع</label>
                <input
                  type="text"
                  value={settings.site_name}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">الشعار</label>
                <input
                  type="text"
                  value={settings.site_tagline}
                  onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">اللوجو</label>
                <ImageUpload
                  value={settings.site_logo}
                  onChange={(url) => setSettings({ ...settings, site_logo: url })}
                  bucket="logos"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">معلومات التواصل</h3>

            <div className="space-y-4">
              <div>
                <label className="label">رقم الهاتف</label>
                <input
                  type="tel"
                  value={settings.contact_phone}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">العنوان</label>
                <input
                  type="text"
                  value={settings.contact_address}
                  onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">واتساب</label>
                <input
                  type="tel"
                  value={settings.contact_whatsapp}
                  onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">السوشيال ميديا</h3>

            <div className="space-y-4">
              <div>
                <label className="label">Facebook</label>
                <input
                  type="url"
                  value={settings.facebook_url}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Instagram</label>
                <input
                  type="url"
                  value={settings.instagram_url}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Twitter</label>
                <input
                  type="url"
                  value={settings.twitter_url}
                  onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              الألوان
            </h3>

            <div className="space-y-4">
              <div>
                <label className="label">اللون الأساسي</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-16 h-12 rounded-lg border-2 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="input flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="label">اللون الثانوي</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="w-16 h-12 rounded-lg border-2 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="input flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">الفوتر</h3>

            <div>
              <label className="label">نص الفوتر</label>
              <input
                type="text"
                value={settings.footer_text}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                className="input"
              />
            </div>
          </div>

          {/* Intro Video Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              الفيديو الترحيبي
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="intro_video_enabled"
                  checked={settings.intro_video_enabled}
                  onChange={(e) => setSettings({ ...settings, intro_video_enabled: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="intro_video_enabled" className="font-medium">تفعيل الفيديو الترحيبي</label>
              </div>

              {settings.intro_video_enabled && (
                <>
                  <div>
                    <label className="label">رابط الفيديو (YouTube أو رابط مباشر)</label>
                    <input
                      type="url"
                      value={settings.intro_video_url}
                      onChange={(e) => setSettings({ ...settings, intro_video_url: e.target.value })}
                      className="input"
                      placeholder="https://youtube.com/watch?v=... أو https://example.com/video.mp4"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      يمكنك إضافة رابط يوتيوب أو رابط فيديو مباشر من Supabase
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="intro_video_can_skip"
                        checked={settings.intro_video_can_skip}
                        onChange={(e) => setSettings({ ...settings, intro_video_can_skip: e.target.checked })}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <label htmlFor="intro_video_can_skip" className="font-medium">إمكانية التخطي</label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="intro_video_autoplay"
                        checked={settings.intro_video_autoplay}
                        onChange={(e) => setSettings({ ...settings, intro_video_autoplay: e.target.checked })}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <label htmlFor="intro_video_autoplay" className="font-medium">تشغيل تلقائي</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="intro_video_show_once"
                        checked={settings.intro_video_show_once}
                        onChange={(e) => setSettings({ ...settings, intro_video_show_once: e.target.checked })}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <label htmlFor="intro_video_show_once" className="font-medium">عرض مرة واحدة فقط</label>
                    </div>

                    <div>
                      <label className="label">تأخير زر التخطي (بالثواني)</label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={settings.intro_video_skip_delay}
                        onChange={(e) => setSettings({ ...settings, intro_video_skip_delay: parseInt(e.target.value) || 0 })}
                        className="input"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Background Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              صور الخلفية
            </h3>

            <div className="space-y-4">
              <div>
                <label className="label">صورة خلفية Hero Section</label>
                <ImageUpload
                  value={settings.hero_background}
                  onChange={(url) => setSettings({ ...settings, hero_background: url })}
                  bucket="images"
                />
                <p className="text-sm text-gray-500 mt-1">
                  هذه الصورة ستظهر في خلفية القسم الرئيسي في الصفحة الرئيسية
                </p>
              </div>

              <div>
                <label className="label">صورة خلفية صفحة المنتجات</label>
                <ImageUpload
                  value={settings.images_background}
                  onChange={(url) => setSettings({ ...settings, images_background: url })}
                  bucket="images"
                />
                <p className="text-sm text-gray-500 mt-1">
                  هذه الصورة ستظهر في خلفية صفحة عرض المنتجات
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:sticky lg:top-20 h-fit">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">معاينة مباشرة</h3>
            <div className="space-y-4">
              {/* Logo & Name Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  {settings.site_logo && settings.site_logo !== '' && settings.site_logo !== '/logo.svg' && (
                    <img
                      src={settings.site_logo}
                      alt="Logo"
                      className="h-10"
                      onError={(e) => {
                        console.error('Logo preview failed to load:', settings.site_logo)
                        e.currentTarget.style.display = 'none'
                      }}
                      onLoad={(e) => {
                        console.log('Logo preview loaded successfully:', settings.site_logo)
                      }}
                      key={settings.site_logo}
                    />
                  )}
                  <div>
                    <h4 className="font-bold">{settings.site_name}</h4>
                    <p className="text-sm text-gray-600">{settings.site_tagline}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">معلومات التواصل:</h4>
                <div className="text-sm space-y-1">
                  <p>📞 {settings.contact_phone}</p>
                  <p>✉️ {settings.contact_email}</p>
                  <p>📍 {settings.contact_address}</p>
                </div>
              </div>

              {/* Colors Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">الألوان:</h4>
                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded-lg border-2"
                    style={{ backgroundColor: settings.primary_color }}
                    title="Primary"
                  />
                  <div
                    className="w-12 h-12 rounded-lg border-2"
                    style={{ backgroundColor: settings.secondary_color }}
                    title="Secondary"
                  />
                </div>
              </div>

              {/* Footer Preview */}
              <div className="p-4 bg-gray-900 text-white rounded-lg text-center text-sm">
                {settings.footer_text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

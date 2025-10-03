'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Eye, ArrowLeft, Upload, Palette, Type, Layout, Settings, Monitor, Smartphone, Info, MessageSquare, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'
import { supabase } from '@/lib/supabase/client'

export default function EditSettingsPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

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
    accent_color: '#f59e0b',
    background_color: '#ffffff',
    text_color: '#1f2937',
    border_color: '#e5e7eb',

    // Typography
    font_family_primary: 'Inter, sans-serif',
    font_family_secondary: 'Cairo, sans-serif',
    font_size_base: '16px',
    font_size_small: '14px',
    font_size_large: '18px',
    font_size_h1: '2.5rem',
    font_size_h2: '2rem',
    font_size_h3: '1.75rem',
    font_size_h4: '1.5rem',
    font_size_h5: '1.25rem',
    font_size_h6: '1.125rem',
    line_height_base: '1.6',
    line_height_heading: '1.2',

    // Layout & Spacing
    container_max_width: '1200px',
    section_padding: '4rem',
    element_spacing: '1rem',
    border_radius: '0.5rem',
    shadow_intensity: 'medium',

    // Header
    header_height: '4rem',
    header_background: '#ffffff',
    header_sticky: true,

    // Footer
    footer_text: '© 2024 ألوميتال برو. جميع الحقوق محفوظة.',
    footer_background: '#1f2937',
    footer_height: '3rem',

    // Buttons
    button_padding: '0.75rem 1.5rem',
    button_border_radius: '0.5rem',
    button_font_size: '1rem',
    button_font_weight: '500',

    // Cards
    card_padding: '1.5rem',
    card_border_radius: '0.75rem',
    card_shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',

    // Animations
    animation_duration: '0.3s',
    animation_easing: 'ease-in-out',
    enable_animations: true,
    enable_hover_effects: true,

    // Responsive breakpoints
    breakpoint_sm: '640px',
    breakpoint_md: '768px',
    breakpoint_lg: '1024px',
    breakpoint_xl: '1280px',

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

  const tabs = [
    { id: 'general', label: 'العام', icon: Info },
    { id: 'design', label: 'التصميم', icon: Palette },
    { id: 'typography', label: 'الخطوط', icon: Type },
    { id: 'layout', label: 'التخطيط', icon: Layout },
    { id: 'advanced', label: 'متقدم', icon: Settings },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            {/* General Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                الإعدادات العامة
              </h3>

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
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                معلومات التواصل
              </h3>

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

            {/* Background Images */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Image className="h-5 w-5" />
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
                </div>

                <div>
                  <label className="label">صورة خلفية صفحة المنتجات</label>
                  <ImageUpload
                    value={settings.images_background}
                    onChange={(url) => setSettings({ ...settings, images_background: url })}
                    bucket="images"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'design':
        return (
          <div className="space-y-6">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">لون التأكيد</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={settings.accent_color}
                        onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                        className="w-16 h-12 rounded-lg border-2 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.accent_color}
                        onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                        className="input flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">لون الخلفية</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={settings.background_color}
                        onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                        className="w-16 h-12 rounded-lg border-2 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.background_color}
                        onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                        className="input flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                إعدادات الهيدر
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="label">ارتفاع الهيدر</label>
                  <input
                    type="text"
                    value={settings.header_height}
                    onChange={(e) => setSettings({ ...settings, header_height: e.target.value })}
                    className="input"
                    placeholder="4rem"
                  />
                </div>

                <div>
                  <label className="label">لون خلفية الهيدر</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.header_background}
                      onChange={(e) => setSettings({ ...settings, header_background: e.target.value })}
                      className="w-16 h-12 rounded-lg border-2 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.header_background}
                      onChange={(e) => setSettings({ ...settings, header_background: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="header_sticky"
                    checked={settings.header_sticky}
                    onChange={(e) => setSettings({ ...settings, header_sticky: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <label htmlFor="header_sticky" className="font-medium">هيدر ثابت</label>
                </div>
              </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">إعدادات الفوتر</h3>

              <div className="space-y-4">
                <div>
                  <label className="label">نص الفوتر</label>
                  <input
                    type="text"
                    value={settings.footer_text}
                    onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">ارتفاع الفوتر</label>
                  <input
                    type="text"
                    value={settings.footer_height}
                    onChange={(e) => setSettings({ ...settings, footer_height: e.target.value })}
                    className="input"
                    placeholder="3rem"
                  />
                </div>

                <div>
                  <label className="label">لون خلفية الفوتر</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={settings.footer_background}
                      onChange={(e) => setSettings({ ...settings, footer_background: e.target.value })}
                      className="w-16 h-12 rounded-lg border-2 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.footer_background}
                      onChange={(e) => setSettings({ ...settings, footer_background: e.target.value })}
                      className="input flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'typography':
        return (
          <div className="space-y-6">
            {/* Typography Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Type className="h-5 w-5" />
                إعدادات الخطوط
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">نوع الخط الأساسي</label>
                    <select
                      value={settings.font_family_primary}
                      onChange={(e) => setSettings({ ...settings, font_family_primary: e.target.value })}
                      className="input"
                    >
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="Open Sans, sans-serif">Open Sans</option>
                      <option value="Cairo, sans-serif">Cairo</option>
                      <option value="Amiri, serif">Amiri</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">نوع الخط الثانوي</label>
                    <select
                      value={settings.font_family_secondary}
                      onChange={(e) => setSettings({ ...settings, font_family_secondary: e.target.value })}
                      className="input"
                    >
                      <option value="Cairo, sans-serif">Cairo</option>
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="Amiri, serif">Amiri</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">حجم الخط الأساسي</label>
                    <input
                      type="text"
                      value={settings.font_size_base}
                      onChange={(e) => setSettings({ ...settings, font_size_base: e.target.value })}
                      className="input"
                      placeholder="16px"
                    />
                  </div>

                  <div>
                    <label className="label">حجم الخط الصغير</label>
                    <input
                      type="text"
                      value={settings.font_size_small}
                      onChange={(e) => setSettings({ ...settings, font_size_small: e.target.value })}
                      className="input"
                      placeholder="14px"
                    />
                  </div>

                  <div>
                    <label className="label">حجم الخط الكبير</label>
                    <input
                      type="text"
                      value={settings.font_size_large}
                      onChange={(e) => setSettings({ ...settings, font_size_large: e.target.value })}
                      className="input"
                      placeholder="18px"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">حجم H1</label>
                    <input
                      type="text"
                      value={settings.font_size_h1}
                      onChange={(e) => setSettings({ ...settings, font_size_h1: e.target.value })}
                      className="input"
                      placeholder="2.5rem"
                    />
                  </div>

                  <div>
                    <label className="label">حجم H2</label>
                    <input
                      type="text"
                      value={settings.font_size_h2}
                      onChange={(e) => setSettings({ ...settings, font_size_h2: e.target.value })}
                      className="input"
                      placeholder="2rem"
                    />
                  </div>

                  <div>
                    <label className="label">حجم H3</label>
                    <input
                      type="text"
                      value={settings.font_size_h3}
                      onChange={(e) => setSettings({ ...settings, font_size_h3: e.target.value })}
                      className="input"
                      placeholder="1.75rem"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'layout':
        return (
          <div className="space-y-6">
            {/* Layout & Spacing Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Layout className="h-5 w-5" />
                التخطيط والمسافات
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">أقصى عرض للحاوي</label>
                    <input
                      type="text"
                      value={settings.container_max_width}
                      onChange={(e) => setSettings({ ...settings, container_max_width: e.target.value })}
                      className="input"
                      placeholder="1200px"
                    />
                  </div>

                  <div>
                    <label className="label">حشو الأقسام</label>
                    <input
                      type="text"
                      value={settings.section_padding}
                      onChange={(e) => setSettings({ ...settings, section_padding: e.target.value })}
                      className="input"
                      placeholder="4rem"
                    />
                  </div>

                  <div>
                    <label className="label">مسافة العناصر</label>
                    <input
                      type="text"
                      value={settings.element_spacing}
                      onChange={(e) => setSettings({ ...settings, element_spacing: e.target.value })}
                      className="input"
                      placeholder="1rem"
                    />
                  </div>

                  <div>
                    <label className="label">انحناء الحواف</label>
                    <input
                      type="text"
                      value={settings.border_radius}
                      onChange={(e) => setSettings({ ...settings, border_radius: e.target.value })}
                      className="input"
                      placeholder="0.5rem"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">شدة الظلال</label>
                  <select
                    value={settings.shadow_intensity}
                    onChange={(e) => setSettings({ ...settings, shadow_intensity: e.target.value })}
                    className="input"
                  >
                    <option value="none">بدون ظلال</option>
                    <option value="light">خفيفة</option>
                    <option value="medium">متوسطة</option>
                    <option value="heavy">ثقيلة</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Button Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">إعدادات الأزرار</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="label">حشو الأزرار</label>
                  <input
                    type="text"
                    value={settings.button_padding}
                    onChange={(e) => setSettings({ ...settings, button_padding: e.target.value })}
                    className="input"
                    placeholder="0.75rem 1.5rem"
                  />
                </div>

                <div>
                  <label className="label">انحناء الأزرار</label>
                  <input
                    type="text"
                    value={settings.button_border_radius}
                    onChange={(e) => setSettings({ ...settings, button_border_radius: e.target.value })}
                    className="input"
                    placeholder="0.5rem"
                  />
                </div>

                <div>
                  <label className="label">حجم خط الأزرار</label>
                  <input
                    type="text"
                    value={settings.button_font_size}
                    onChange={(e) => setSettings({ ...settings, button_font_size: e.target.value })}
                    className="input"
                    placeholder="1rem"
                  />
                </div>

                <div>
                  <label className="label">وزن خط الأزرار</label>
                  <select
                    value={settings.button_font_weight}
                    onChange={(e) => setSettings({ ...settings, button_font_weight: e.target.value })}
                    className="input"
                  >
                    <option value="400">عادي (400)</option>
                    <option value="500">متوسط (500)</option>
                    <option value="600">شبه عريض (600)</option>
                    <option value="700">عريض (700)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">إعدادات الكروت</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">حشو الكروت</label>
                  <input
                    type="text"
                    value={settings.card_padding}
                    onChange={(e) => setSettings({ ...settings, card_padding: e.target.value })}
                    className="input"
                    placeholder="1.5rem"
                  />
                </div>

                <div>
                  <label className="label">انحناء الكروت</label>
                  <input
                    type="text"
                    value={settings.card_border_radius}
                    onChange={(e) => setSettings({ ...settings, card_border_radius: e.target.value })}
                    className="input"
                    placeholder="0.75rem"
                  />
                </div>

                <div>
                  <label className="label">ظلال الكروت</label>
                  <input
                    type="text"
                    value={settings.card_shadow}
                    onChange={(e) => setSettings({ ...settings, card_shadow: e.target.value })}
                    className="input"
                    placeholder="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  />
                </div>
              </div>
            </div>

            {/* Responsive Breakpoints */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                نقاط التوقف المتجاوبة
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="label">نقطة SM</label>
                  <input
                    type="text"
                    value={settings.breakpoint_sm}
                    onChange={(e) => setSettings({ ...settings, breakpoint_sm: e.target.value })}
                    className="input"
                    placeholder="640px"
                  />
                </div>

                <div>
                  <label className="label">نقطة MD</label>
                  <input
                    type="text"
                    value={settings.breakpoint_md}
                    onChange={(e) => setSettings({ ...settings, breakpoint_md: e.target.value })}
                    className="input"
                    placeholder="768px"
                  />
                </div>

                <div>
                  <label className="label">نقطة LG</label>
                  <input
                    type="text"
                    value={settings.breakpoint_lg}
                    onChange={(e) => setSettings({ ...settings, breakpoint_lg: e.target.value })}
                    className="input"
                    placeholder="1024px"
                  />
                </div>

                <div>
                  <label className="label">نقطة XL</label>
                  <input
                    type="text"
                    value={settings.breakpoint_xl}
                    onChange={(e) => setSettings({ ...settings, breakpoint_xl: e.target.value })}
                    className="input"
                    placeholder="1280px"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'advanced':
        return (
          <div className="space-y-6">
            {/* Animation Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">إعدادات الحركات والتأثيرات</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enable_animations"
                      checked={settings.enable_animations}
                      onChange={(e) => setSettings({ ...settings, enable_animations: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <label htmlFor="enable_animations" className="font-medium">تفعيل الحركات</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="enable_hover_effects"
                      checked={settings.enable_hover_effects}
                      onChange={(e) => setSettings({ ...settings, enable_hover_effects: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <label htmlFor="enable_hover_effects" className="font-medium">تفعيل تأثيرات التمرير</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">مدة الحركات</label>
                    <input
                      type="text"
                      value={settings.animation_duration}
                      onChange={(e) => setSettings({ ...settings, animation_duration: e.target.value })}
                      className="input"
                      placeholder="0.3s"
                    />
                  </div>

                  <div>
                    <label className="label">نوع الحركة</label>
                    <select
                      value={settings.animation_easing}
                      onChange={(e) => setSettings({ ...settings, animation_easing: e.target.value })}
                      className="input"
                    >
                      <option value="ease-in-out">ease-in-out</option>
                      <option value="ease-in">ease-in</option>
                      <option value="ease-out">ease-out</option>
                      <option value="linear">linear</option>
                    </select>
                  </div>
                </div>
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
          </div>
        )

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

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Settings Editor */}
        <div className="lg:col-span-2">
          {renderTabContent()}
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
                  <div
                    className="w-12 h-12 rounded-lg border-2"
                    style={{ backgroundColor: settings.accent_color }}
                    title="Accent"
                  />
                </div>
              </div>

              {/* Footer Preview */}
              <div
                className="p-4 rounded-lg text-center text-sm text-white"
                style={{ backgroundColor: settings.footer_background }}
              >
                {settings.footer_text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

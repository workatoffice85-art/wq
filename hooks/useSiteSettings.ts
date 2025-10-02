'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface SiteSettings {
  site_name: string
  site_tagline: string
  site_logo: string
  contact_phone: string
  contact_email: string
  contact_address: string
  contact_whatsapp: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  youtube_url: string
  tiktok_url: string
  whatsapp_url: string
  primary_color: string
  secondary_color: string
  footer_text: string

  // Intro Video Settings
  intro_video_enabled: boolean
  intro_video_url: string
  intro_video_can_skip: boolean
  intro_video_autoplay: boolean
  intro_video_show_once: boolean
  intro_video_skip_delay: number

  // Background Images
  hero_background: string
  images_background: string
}

const defaultSettings: SiteSettings = {
  site_name: 'ألوميتال برو',
  site_tagline: 'الجودة والأناقة في منتجات الألوميتال',
  site_logo: '/logo.svg',
  contact_phone: '+20 100 123 4567',
  contact_email: 'info@alupro.com',
  contact_address: 'القاهرة، مصر',
  contact_whatsapp: '+20 100 123 4567',
  facebook_url: 'https://facebook.com/alupro',
  instagram_url: 'https://instagram.com/alupro',
  twitter_url: 'https://twitter.com/alupro',
  youtube_url: 'https://youtube.com/alupro',
  tiktok_url: 'https://tiktok.com/@alupro',
  whatsapp_url: 'https://wa.me/201001234567',
  primary_color: '#2563eb',
  secondary_color: '#1e40af',
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
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings'
        },
        (payload) => {
          console.log('Realtime update received:', payload)
          loadSettings() // Reload settings when changes occur
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function loadSettings() {
    try {
      // Try to load from Supabase first
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')

      if (error) {
        console.error('Error loading from Supabase:', error)
        // Fallback to localStorage
        loadFromLocalStorage()
        return
      }

      if (data && data.length > 0) {
        // Convert array to object with proper type handling
        const settingsObj: any = { ...defaultSettings }

        data.forEach((item: any) => {
          let value = item.setting_value

          // Debug logging
          console.log('Processing setting:', item.setting_key, 'Value:', value, 'Type:', typeof value)

          // Handle different data types from Supabase
          if (typeof value === 'string') {
            // Try to parse as JSON first
            try {
              const parsed = JSON.parse(value)
              // If it's a valid JSON object, check if it has ar/en keys
              if (typeof parsed === 'object' && parsed !== null) {
                if (parsed.ar) {
                  value = parsed.ar // Use Arabic value
                } else if (parsed.en) {
                  value = parsed.en // Fallback to English
                } else {
                  value = parsed // Use the object as is
                }
              } else {
                value = parsed // Use parsed primitive value
              }
            } catch {
              // Not JSON, use as string
              value = value
            }
          }

          // Handle special cases for different setting types
          switch (item.setting_key) {
            case 'site_logo':
            case 'images_background':
            case 'hero_background':
              // These should be URLs, keep as strings
              if (typeof value === 'string') {
                settingsObj[item.setting_key] = value
                console.log('Set URL setting:', item.setting_key, 'to:', value)
              } else {
                console.log('Invalid URL value for:', item.setting_key, 'Value:', value)
              }
              break

            case 'primary_color':
            case 'secondary_color':
              // These should be color strings (hex codes)
              if (typeof value === 'string' && value.startsWith('#')) {
                settingsObj[item.setting_key] = value
              } else if (typeof value === 'string') {
                // Fallback to default color
                settingsObj[item.setting_key] = defaultSettings[item.setting_key as keyof typeof defaultSettings]
              }
              break

            default:
              // For other settings, ensure they are strings for React
              if (typeof value === 'object' && value !== null) {
                settingsObj[item.setting_key] = JSON.stringify(value)
              } else {
                settingsObj[item.setting_key] = value
              }
          }
        })

        console.log('Loaded settings from Supabase:', settingsObj)
        setSettings(settingsObj)

        // Save to localStorage as backup
        localStorage.setItem('site_settings', JSON.stringify(settingsObj))
      } else {
        console.log('No data in Supabase, using defaults and localStorage')
        // No data in Supabase, use defaults and try localStorage
        loadFromLocalStorage()
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('site_settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsed })
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }

  return { settings, loading }
}

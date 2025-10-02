'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export default function IntroVideo() {
  const [show, setShow] = useState(false)
  const [canSkip, setCanSkip] = useState(false)
  const { settings } = useSiteSettings()

  useEffect(() => {
    // Check if video should be shown
    const hasShown = localStorage.getItem('intro_video_shown')

    if (settings.intro_video_enabled && settings.intro_video_url) {
      if (!settings.intro_video_show_once || !hasShown) {
        setShow(true)

        // Enable skip button after delay
        if (settings.intro_video_can_skip) {
          setTimeout(() => setCanSkip(true), settings.intro_video_skip_delay * 1000)
        }
      }
    }
  }, [settings.intro_video_enabled, settings.intro_video_url, settings.intro_video_show_once])

  const handleClose = () => {
    setShow(false)
    if (settings.intro_video_show_once) {
      localStorage.setItem('intro_video_shown', 'true')
    }
  }

  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    return match ? match[1] : null
  }

  if (!show) return null

  const videoId = getVideoId(settings.intro_video_url)

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      {canSkip && settings.intro_video_can_skip && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="font-medium">تخطي</span>
        </button>
      )}

      <div className="w-full max-w-4xl aspect-video">
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${settings.intro_video_autoplay ? 1 : 0}&controls=1`}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={settings.intro_video_url}
            autoPlay={settings.intro_video_autoplay}
            controls
            className="w-full h-full rounded-lg"
            onEnded={handleClose}
          />
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Link as LinkIcon, X, Play } from 'lucide-react'
import toast from 'react-hot-toast'

interface VideoUploadProps {
  value?: string
  onChange: (url: string) => void
}

export default function VideoUpload({ value, onChange }: VideoUploadProps) {
  const [url, setUrl] = useState(value || '')
  const [preview, setPreview] = useState<string | null>(value || null)

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    setPreview(newUrl)
    onChange(newUrl)
    if (newUrl) {
      toast.success('تم حفظ الرابط!')
    }
  }

  const handleRemove = () => {
    setUrl('')
    setPreview(null)
    onChange('')
  }

  return (
    <div className="space-y-4">
      {/* رابط الفيديو */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          رابط الفيديو (YouTube أو رابط مباشر)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="input pl-10"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          {url && (
            <button
              type="button"
              onClick={handleRemove}
              className="btn btn-outline text-red-600 hover:bg-red-50"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          استخدم رابط YouTube (الأفضل) أو رابط فيديو مباشر
        </p>
      </div>

      {/* روابط سريعة */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">📹 ارفع الفيديو على:</p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href="https://www.youtube.com/upload"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:underline flex items-center gap-1 p-2 hover:bg-white rounded"
          >
            🎥 YouTube (غير محدود)
          </a>
          <a
            href="https://vimeo.com/upload"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:underline flex items-center gap-1 p-2 hover:bg-white rounded"
          >
            🎬 Vimeo (500MB/أسبوع)
          </a>
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:underline flex items-center gap-1 p-2 hover:bg-white rounded"
          >
            📁 Google Drive (15GB)
          </a>
          <a
            href="https://www.dropbox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:underline flex items-center gap-1 p-2 hover:bg-white rounded"
          >
            📦 Dropbox (2GB)
          </a>
          <a
            href="https://cloudinary.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:underline flex items-center gap-1 p-2 hover:bg-white rounded"
          >
            ☁️ Cloudinary (25GB)
          </a>
          <a
            href="https://streamable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:underline flex items-center gap-1 p-2 hover:bg-white rounded"
          >
            📺 Streamable (مجاني)
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 بعد الرفع، انسخ الرابط والصقه في الحقل أعلاه
        </p>
      </div>

      {/* معاينة */}
      {preview && (
        <div className="relative">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-black">
            <video
              src={preview}
              controls
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* نصائح */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p className="font-semibold mb-2">💡 نصائح مهمة:</p>
        <ul className="text-xs space-y-1">
          <li>• <strong>YouTube:</strong> أفضل خيار (مجاني وغير محدود)</li>
          <li>• <strong>للخصوصية:</strong> اجعل الفيديو "Unlisted" أو "Private"</li>
          <li>• <strong>Google Drive:</strong> شارك الرابط كـ "Anyone with the link"</li>
          <li>• <strong>Facebook/Instagram:</strong> انسخ رابط الفيديو من المنشور</li>
          <li>• <strong>الجودة:</strong> استخدم 1080p أو أعلى للوضوح</li>
        </ul>
      </div>
      
      {/* روابط من السوشيال ميديا */}
      <details className="text-sm">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
          📱 استخدام فيديو من السوشيال ميديا
        </summary>
        <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Facebook:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>افتح الفيديو على Facebook</li>
              <li>اضغط على "Share" → "Copy Link"</li>
              <li>الصق الرابط هنا</li>
            </ol>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Instagram:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>افتح الفيديو على Instagram</li>
              <li>اضغط على "..." → "Copy Link"</li>
              <li>الصق الرابط هنا</li>
            </ol>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">TikTok:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>افتح الفيديو على TikTok</li>
              <li>اضغط على "Share" → "Copy Link"</li>
              <li>الصق الرابط هنا</li>
            </ol>
          </div>
        </div>
      </details>
    </div>
  )
}

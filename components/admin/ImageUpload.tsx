'use client'

import { useState, useRef } from 'react'
import { Upload, Link as LinkIcon, Loader2, X } from 'lucide-react'
import { uploadImage } from '@/lib/upload'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  bucket?: string
}

export default function ImageUpload({ value, onChange, bucket = 'products' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState(value || '')
  const [preview, setPreview] = useState<string | null>(value || null)
  const [uploadMethod, setUploadMethod] = useState<'supabase' | 'url'>('supabase')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // رفع على Supabase
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار صورة فقط')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت')
      return
    }

    setUploading(true)

    try {
      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Supabase
      const uploadedUrl = await uploadImage(file, bucket)
      
      if (uploadedUrl) {
        onChange(uploadedUrl)
        setUrl(uploadedUrl)
        toast.success('تم رفع الصورة بنجاح على Supabase! ✅')
      } else {
        toast.error('فشل رفع الصورة - تأكد من إعداد Supabase Storage')
        setPreview(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('حدث خطأ أثناء رفع الصورة')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* اختيار طريقة الرفع */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setUploadMethod('supabase')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            uploadMethod === 'supabase'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📤 رفع على Supabase
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            uploadMethod === 'url'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🔗 استخدام رابط
        </button>
      </div>

      {/* رفع على Supabase */}
      {uploadMethod === 'supabase' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          
          {preview ? (
            <div className="relative group">
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-primary-500"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <span>جاري الرفع على Supabase...</span>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10" />
                  <span className="text-sm font-medium">اضغط لرفع صورة</span>
                  <span className="text-xs text-gray-400">PNG, JPG, GIF حتى 5MB</span>
                  <span className="text-xs text-green-600 font-medium">✅ سيتم الرفع على Supabase Storage</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* استخدام رابط */}
      {uploadMethod === 'url' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رابط الصورة
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="input pl-10"
                placeholder="https://example.com/image.jpg"
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
            الصق رابط الصورة من Imgur, Cloudinary, أو أي موقع آخر
          </p>

          {/* روابط سريعة */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">📤 ارفع الصورة على:</p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href="https://imgur.com/upload"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:underline flex items-center gap-1 p-2 hover:bg-white rounded"
          >
            🖼️ Imgur (غير محدود)
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
            href="https://postimages.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:underline flex items-center gap-1 p-2 hover:bg-white rounded"
          >
            🌐 PostImages (مجاني)
          </a>
          <a
            href="https://imgbb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-500 hover:underline flex items-center gap-1 p-2 hover:bg-white rounded"
          >
            📸 ImgBB (مجاني)
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 بعد الرفع، انسخ الرابط المباشر للصورة والصقه في الحقل أعلاه
        </p>
      </div>

      {/* معاينة */}
      {preview && (
        <div className="relative group">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* صور افتراضية */}
      <details className="text-sm">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium">
          🎨 أو استخدم صورة افتراضية (جاهزة)
        </summary>
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleUrlChange('https://via.placeholder.com/400x300/2563eb/ffffff?text=Product')}
              className="p-2 border rounded hover:bg-gray-50 text-xs text-left"
            >
              📦 صورة منتج
            </button>
            <button
              type="button"
              onClick={() => handleUrlChange('https://source.unsplash.com/400x300/?aluminum,window')}
              className="p-2 border rounded hover:bg-gray-50 text-xs text-left"
            >
              🪟 نافذة ألوميتال
            </button>
            <button
              type="button"
              onClick={() => handleUrlChange('https://source.unsplash.com/400x300/?door,modern')}
              className="p-2 border rounded hover:bg-gray-50 text-xs text-left"
            >
              🚪 باب عصري
            </button>
            <button
              type="button"
              onClick={() => handleUrlChange('https://source.unsplash.com/400x300/?kitchen,luxury')}
              className="p-2 border rounded hover:bg-gray-50 text-xs text-left"
            >
              🍳 مطبخ فاخر
            </button>
            <button
              type="button"
              onClick={() => handleUrlChange('https://source.unsplash.com/400x300/?architecture,modern')}
              className="p-2 border rounded hover:bg-gray-50 text-xs text-left"
            >
              🏢 معماري
            </button>
            <button
              type="button"
              onClick={() => handleUrlChange('https://source.unsplash.com/400x300/?interior,design')}
              className="p-2 border rounded hover:bg-gray-50 text-xs text-left"
            >
              🎨 تصميم داخلي
            </button>
          </div>
        </div>
      </details>
        </div>
      )}
    </div>
  )
}

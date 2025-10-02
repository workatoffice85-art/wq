// Cloudinary Upload - حل نهائي بدون Supabase Storage

export async function uploadToCloudinary(file: File, folder: string = 'alumetal'): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'alumetal_preset') // سنشرح كيف تعمله
    formData.append('folder', folder)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()
    
    if (data.secure_url) {
      return data.secure_url
    }
    
    return null
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

// Alternative: استخدام روابط مباشرة (أسهل حل)
export function useDirectUrl(url: string): string {
  return url
}

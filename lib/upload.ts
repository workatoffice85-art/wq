import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function uploadImage(file: File, bucket: string = 'images'): Promise<string | null> {
  try {
    const supabase = createClientComponentClient()
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = fileName

    // Upload file to the specified bucket
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    // Get public URL from the correct bucket
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    console.log('Uploaded to:', bucket, 'URL:', publicUrl)
    return publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

export async function uploadVideo(file: File): Promise<string | null> {
  try {
    const supabase = createClientComponentClient()
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `videos/${fileName}`

    // Upload file
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    const supabase = createClientComponentClient()
    
    // Extract path from URL
    const path = url.split('/images/')[1]
    
    const { error } = await supabase.storage
      .from('images')
      .remove([path])

    return !error
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

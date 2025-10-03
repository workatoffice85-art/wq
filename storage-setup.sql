-- ============================================
-- Alumetal Pro - Supabase Storage Setup
-- ============================================

-- This file contains SQL commands to set up storage buckets and policies
-- These commands should be run in Supabase Dashboard -> Storage -> SQL Editor
-- Or via the Supabase CLI

-- ============================================
-- 1. CREATE STORAGE BUCKETS
-- ============================================

-- Create bucket for product images (public access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products-images', 'products-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for site assets (public access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for user avatars (public access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for intro videos (public access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('intro-videos', 'intro-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for admin uploads (private access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-uploads', 'admin-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. STORAGE POLICIES
-- ============================================

-- Policy: Anyone can view product images
CREATE POLICY "Product images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'products-images');

-- Policy: Anyone can view site assets
CREATE POLICY "Site assets are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'site-assets');

-- Policy: Anyone can view user avatars
CREATE POLICY "User avatars are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'user-avatars');

-- Policy: Anyone can view intro videos
CREATE POLICY "Intro videos are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'intro-videos');

-- Policy: Authenticated users can upload product images
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products-images'
  AND auth.role() = 'authenticated'
);

-- Policy: Authenticated users can upload site assets
CREATE POLICY "Authenticated users can upload site assets" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'site-assets'
  AND auth.role() = 'authenticated'
);

-- Policy: Users can upload their own avatars
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Authenticated users can upload intro videos
CREATE POLICY "Authenticated users can upload intro videos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'intro-videos'
  AND auth.role() = 'authenticated'
);

-- Policy: Only admins can upload to admin-uploads bucket
CREATE POLICY "Only admins can upload to admin-uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'admin-uploads'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
);

-- Policy: Only admins can view admin-uploads
CREATE POLICY "Only admins can view admin-uploads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'admin-uploads'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
);

-- Policy: Only admins can update admin-uploads
CREATE POLICY "Only admins can update admin-uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'admin-uploads'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
);

-- Policy: Only admins can delete from admin-uploads
CREATE POLICY "Only admins can delete admin-uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'admin-uploads'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
);

-- ============================================
-- 3. FOLDER STRUCTURE POLICIES
-- ============================================

-- Policy: Users can only upload to their own folder in user-avatars
CREATE POLICY "Users can only access their own avatar folder" ON storage.objects
FOR ALL USING (
  bucket_id = 'user-avatars'
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Policy: Product images organization (optional)
-- Uncomment if you want to organize product images by product ID
-- CREATE POLICY "Product images organized by product ID" ON storage.objects
-- FOR ALL USING (
--   bucket_id = 'products-images'
--   AND (string_to_array(name, '/'))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
-- );

-- ============================================
-- 4. STORAGE FUNCTIONS
-- ============================================

-- Function to get public URL for a file
CREATE OR REPLACE FUNCTION get_storage_public_url(bucket_name text, file_path text)
RETURNS text AS $$
BEGIN
  RETURN format('https://your-project.supabase.co/storage/v1/object/public/%s/%s', bucket_name, file_path);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate file size (optional)
CREATE OR REPLACE FUNCTION validate_file_size()
RETURNS TRIGGER AS $$
BEGIN
  -- Maximum file size: 10MB
  IF octet_length(NEW.metadata) > 10485760 THEN
    RAISE EXCEPTION 'File size too large. Maximum allowed size is 10MB';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply file size validation to all buckets
CREATE TRIGGER validate_products_images_size
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'products-images')
  EXECUTE FUNCTION validate_file_size();

CREATE TRIGGER validate_site_assets_size
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'site-assets')
  EXECUTE FUNCTION validate_file_size();

CREATE TRIGGER validate_user_avatars_size
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'user-avatars')
  EXECUTE FUNCTION validate_file_size();

CREATE TRIGGER validate_intro_videos_size
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'intro-videos')
  EXECUTE FUNCTION validate_file_size();

CREATE TRIGGER validate_admin_uploads_size
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'admin-uploads')
  EXECUTE FUNCTION validate_file_size();

-- ============================================
-- 5. STORAGE SETTINGS
-- ============================================

-- Enable image transformation (optional)
-- This allows automatic image resizing and optimization
-- Uncomment if you want to use Supabase's image transformation features

-- UPDATE storage.buckets
-- SET file_size_limit = 10485760, -- 10MB
--     allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
-- WHERE id = 'products-images';

-- UPDATE storage.buckets
-- SET file_size_limit = 10485760, -- 10MB
--     allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
-- WHERE id = 'user-avatars';

-- UPDATE storage.buckets
-- SET file_size_limit = 104857600, -- 100MB for videos
--     allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/ogg']
-- WHERE id = 'intro-videos';

-- ============================================
-- 6. CORS SETTINGS (Supabase Dashboard)
-- ============================================

-- These settings should be configured in Supabase Dashboard -> Storage -> Settings
-- Allowed Origins: your-domain.com, localhost:3000
-- Allowed Headers: authorization, x-client-info, apikey, content-type
-- Allowed Methods: GET, POST, PUT, DELETE
-- Max Age: 3600

-- ============================================
-- 7. USAGE EXAMPLES
-- ============================================

/*
-- Upload a file to products-images bucket:
const { data, error } = await supabase.storage
  .from('products-images')
  .upload('product-id/image.jpg', file)

-- Get public URL:
const { data } = supabase.storage
  .from('products-images')
  .getPublicUrl('product-id/image.jpg')

-- List files in a bucket:
const { data, error } = await supabase.storage
  .from('products-images')
  .list('product-id')

-- Delete a file:
const { error } = await supabase.storage
  .from('products-images')
  .remove(['product-id/image.jpg'])
*/

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- After running this script, you should:
-- 1. Configure CORS settings in Supabase Dashboard
-- 2. Set up RLS policies for your specific use case
-- 3. Test file uploads and access
-- 4. Configure CDN settings if needed

SELECT 'Storage setup completed successfully!' as status;

-- ============================================
-- Alumetal Pro - Advanced Storage Policies
-- ============================================

-- This file contains advanced storage policies and utilities
-- Use these when you need more granular control over file access

-- ============================================
-- 1. ADVANCED BUCKET POLICIES
-- ============================================

-- Policy: Only admins can delete product images (safety measure)
CREATE POLICY "Only admins can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'products-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
);

-- Policy: Only admins can delete site assets
CREATE POLICY "Only admins can delete site assets" ON storage.objects
FOR DELETE USING (
  bucket_id = 'site-assets'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
);

-- Policy: Only admins can delete intro videos
CREATE POLICY "Only admins can delete intro videos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'intro-videos'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
);

-- ============================================
-- 2. FILE TYPE RESTRICTIONS
-- ============================================

-- Function to validate image files
CREATE OR REPLACE FUNCTION validate_image_file()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if file is an image
  IF NEW.metadata->>'mimetype' NOT LIKE 'image/%' THEN
    RAISE EXCEPTION 'File must be an image';
  END IF;

  -- Check image dimensions (optional)
  -- This requires the pg_image extension or similar

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to validate video files
CREATE OR REPLACE FUNCTION validate_video_file()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if file is a video
  IF NEW.metadata->>'mimetype' NOT LIKE 'video/%' THEN
    RAISE EXCEPTION 'File must be a video';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply image validation to image buckets
CREATE TRIGGER validate_products_images_type
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'products-images')
  EXECUTE FUNCTION validate_image_file();

CREATE TRIGGER validate_user_avatars_type
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'user-avatars')
  EXECUTE FUNCTION validate_image_file();

-- Apply video validation to video bucket
CREATE TRIGGER validate_intro_videos_type
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'intro-videos')
  EXECUTE FUNCTION validate_video_file();

-- ============================================
-- 3. ORGANIZED FOLDER STRUCTURE
-- ============================================

-- Policy: Product images must be organized by product ID
CREATE POLICY "Product images organized by product ID" ON storage.objects
FOR ALL USING (
  bucket_id = 'products-images'
  AND array_length(string_to_array(name, '/'), 1) >= 2
  AND (string_to_array(name, '/'))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
);

-- Policy: Site assets organized by type
CREATE POLICY "Site assets organized by type" ON storage.objects
FOR ALL USING (
  bucket_id = 'site-assets'
  AND (string_to_array(name, '/'))[1] IN ('logos', 'banners', 'icons', 'backgrounds')
);

-- ============================================
-- 4. AUDIT LOGGING
-- ============================================

-- Function to log storage activities
CREATE OR REPLACE FUNCTION log_storage_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Log file uploads
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (
      user_id,
      action,
      entity_type,
      entity_id,
      details
    ) VALUES (
      auth.uid(),
      'file_uploaded',
      'storage',
      NEW.id,
      jsonb_build_object(
        'bucket_id', NEW.bucket_id,
        'file_name', NEW.name,
        'file_size', NEW.metadata->>'size'
      )
    );
    RETURN NEW;
  END IF;

  -- Log file deletions
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (
      user_id,
      action,
      entity_type,
      entity_id,
      details
    ) VALUES (
      auth.uid(),
      'file_deleted',
      'storage',
      OLD.id,
      jsonb_build_object(
        'bucket_id', OLD.bucket_id,
        'file_name', OLD.name
      )
    );
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit logging to all storage objects
CREATE TRIGGER log_storage_activity_trigger
  AFTER INSERT OR DELETE ON storage.objects
  FOR EACH ROW EXECUTE FUNCTION log_storage_activity();

-- ============================================
-- 5. CLEANUP POLICIES
-- ============================================

-- Function to clean up old files (optional)
-- Use with caution - this permanently deletes files
CREATE OR REPLACE FUNCTION cleanup_old_files()
RETURNS void AS $$
BEGIN
  -- Delete files older than 1 year from temp folders
  DELETE FROM storage.objects
  WHERE bucket_id = 'temp-uploads'
    AND created_at < NOW() - INTERVAL '1 year';

  -- Delete orphaned product images (when product is deleted)
  DELETE FROM storage.objects
  WHERE bucket_id = 'products-images'
    AND NOT EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id::text = (string_to_array(name, '/'))[1]
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. STORAGE QUOTAS (Optional)
-- ============================================

-- Create table to track storage usage per user
CREATE TABLE IF NOT EXISTS public.storage_usage (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_size BIGINT DEFAULT 0,
  file_count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update storage usage
CREATE OR REPLACE FUNCTION update_storage_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.storage_usage (user_id, total_size, file_count)
    VALUES (auth.uid(), NEW.metadata->>'size', 1)
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_size = storage_usage.total_size + (NEW.metadata->>'size')::BIGINT,
      file_count = storage_usage.file_count + 1,
      last_updated = NOW();
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE public.storage_usage
    SET
      total_size = total_size - (OLD.metadata->>'size')::BIGINT,
      file_count = file_count - 1,
      last_updated = NOW()
    WHERE user_id = auth.uid();
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply storage usage tracking
CREATE TRIGGER track_storage_usage_trigger
  AFTER INSERT OR DELETE ON storage.objects
  FOR EACH ROW EXECUTE FUNCTION update_storage_usage();

-- ============================================
-- 7. UTILITY FUNCTIONS
-- ============================================

-- Function to get user's storage usage
CREATE OR REPLACE FUNCTION get_user_storage_usage(user_uuid UUID)
RETURNS TABLE (
  total_size BIGINT,
  file_count INTEGER,
  usage_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(su.total_size, 0) as total_size,
    COALESCE(su.file_count, 0) as file_count,
    CASE
      WHEN su.total_size > 0 THEN
        LEAST((su.total_size::DECIMAL / 1073741824) * 100, 100) -- 1GB limit
      ELSE 0
    END as usage_percentage
  FROM public.storage_usage su
  WHERE su.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has enough storage space
CREATE OR REPLACE FUNCTION check_storage_quota(file_size BIGINT DEFAULT 0)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage BIGINT;
  quota_limit BIGINT := 1073741824; -- 1GB in bytes
BEGIN
  SELECT COALESCE(total_size, 0) INTO current_usage
  FROM public.storage_usage
  WHERE user_id = auth.uid();

  RETURN (current_usage + file_size) <= quota_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. SECURITY ENHANCEMENTS
-- ============================================

-- Policy: Prevent directory traversal attacks
CREATE POLICY "Prevent directory traversal" ON storage.objects
FOR ALL USING (
  name !~ '\.\./' -- No parent directory access
  AND name !~ '/\.\.' -- No relative paths
  AND name !~ '^/' -- No absolute paths
);

-- Policy: File name sanitization (basic)
CREATE POLICY "Safe file names" ON storage.objects
FOR ALL USING (
  name !~ '[<>:"|?*]' -- No special characters that could cause issues
  AND length(name) <= 255 -- Reasonable file name length
);

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- These advanced policies provide:
-- 1. Enhanced security and validation
-- 2. Usage tracking and quotas
-- 3. Audit logging
-- 4. Automatic cleanup
-- 5. Better organization

-- Remember to:
-- 1. Test all policies thoroughly
-- 2. Monitor storage usage and logs
-- 3. Adjust quotas as needed
-- 4. Set up automated cleanup schedules

SELECT 'Advanced storage policies setup completed!' as status;

-- ============================================
-- Supabase Storage Setup Script
-- Purpose: Create menu-photos bucket and policies
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check if bucket exists
SELECT 
  id, 
  name, 
  public, 
  created_at
FROM storage.buckets 
WHERE name = 'menu-photos';

-- If bucket doesn't exist, you need to create it via Dashboard:
-- Storage → New Bucket → Name: "menu-photos", Public: YES

-- ============================================
-- Step 2: Create Storage Policies (Optional)
-- ============================================

-- Note: If using SUPABASE_SERVICE_KEY, these policies are NOT needed
-- Service role bypasses all RLS policies

-- Policy 1: Allow public READ access
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'menu-photos'
);

-- Policy 2: Allow authenticated INSERT
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-photos'
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow authenticated UPDATE
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'menu-photos'
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated DELETE
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-photos'
  AND auth.role() = 'authenticated'
);

-- ============================================
-- Step 3: Verify policies
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE '%menu-photos%';

-- ============================================
-- Step 4: Test queries
-- ============================================

-- Check bucket configuration
SELECT 
  b.id,
  b.name,
  b.public,
  b.file_size_limit,
  b.allowed_mime_types,
  COUNT(o.id) as total_files
FROM storage.buckets b
LEFT JOIN storage.objects o ON o.bucket_id = b.id
WHERE b.name = 'menu-photos'
GROUP BY b.id, b.name, b.public, b.file_size_limit, b.allowed_mime_types;

-- List all files in bucket
SELECT 
  id,
  name,
  bucket_id,
  metadata->>'size' as size_bytes,
  metadata->>'mimetype' as mime_type,
  created_at,
  updated_at
FROM storage.objects
WHERE bucket_id = 'menu-photos'
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- Step 5: Check menu item photos in database
-- ============================================
SELECT 
  mip.id,
  mip.menu_item_id,
  mi.name as item_name,
  mip.url,
  mip.is_primary,
  mip.created_at
FROM "MenuItemPhoto" mip
JOIN "MenuItem" mi ON mi.id = mip.menu_item_id
ORDER BY mip.created_at DESC
LIMIT 10;

-- ============================================
-- Cleanup (if needed)
-- ============================================

-- Drop all policies (only if recreating)
-- DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- Delete all files from bucket (DANGEROUS - BE CAREFUL!)
-- DELETE FROM storage.objects WHERE bucket_id = 'menu-photos';

-- ============================================
-- Notes:
-- ============================================
-- 1. Bucket name MUST match: SUPABASE_BUCKET = 'menu-photos' in backend config
-- 2. Service role key bypasses all RLS, so policies are optional for backend
-- 3. Public bucket = YES allows direct URL access without signed URLs
-- 4. File path format: menu-items/{uuid}.{ext}
-- 5. Public URL format: https://{project}.supabase.co/storage/v1/object/public/menu-photos/{path}

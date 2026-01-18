#!/usr/bin/env node
/**
 * Supabase Storage Setup Script
 * Auto-creates menu-photos bucket with proper configuration
 * Run: node setup-supabase-storage.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const BUCKET_NAME = 'menu-photos';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function setupStorage() {
  log(colors.cyan, '\n🚀 Starting Supabase Storage Setup...\n');

  // 1. Validate environment variables
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    log(colors.red, '❌ Error: Missing Supabase credentials!');
    log(colors.yellow, 'Please add to .env file:');
    log(colors.yellow, '  SUPABASE_URL=https://xxx.supabase.co');
    log(colors.yellow, '  SUPABASE_SERVICE_KEY=eyJhbGc...');
    process.exit(1);
  }

  log(colors.green, '✅ Environment variables found');
  log(colors.blue, `   URL: ${SUPABASE_URL}`);
  log(colors.blue, `   Key: ${SUPABASE_SERVICE_KEY.substring(0, 20)}...`);

  // 2. Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  log(colors.green, '\n✅ Supabase client created\n');

  // 3. Check if bucket exists
  log(colors.cyan, '📦 Checking for existing bucket...');
  const { data: buckets, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    log(colors.red, `❌ Error listing buckets: ${listError.message}`);
    process.exit(1);
  }

  const existingBucket = buckets.find((b) => b.name === BUCKET_NAME);

  if (existingBucket) {
    log(colors.yellow, `⚠️  Bucket "${BUCKET_NAME}" already exists!`);
    log(colors.blue, `   ID: ${existingBucket.id}`);
    log(colors.blue, `   Public: ${existingBucket.public}`);
    log(colors.blue, `   Created: ${existingBucket.created_at}`);
  } else {
    // 4. Create bucket
    log(colors.cyan, `\n📦 Creating bucket "${BUCKET_NAME}"...`);

    const { data: newBucket, error: createError } =
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Allow public access to files
        fileSizeLimit: 5242880, // 5MB in bytes
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      });

    if (createError) {
      log(colors.red, `❌ Error creating bucket: ${createError.message}`);

      if (createError.message.includes('already exists')) {
        log(
          colors.yellow,
          '⚠️  Bucket might exist but not visible. Check Supabase Dashboard.',
        );
      }

      process.exit(1);
    }

    log(colors.green, `✅ Bucket "${BUCKET_NAME}" created successfully!`);
    log(colors.blue, `   ID: ${newBucket.name}`);
  }

  // 5. Test upload
  log(colors.cyan, '\n📸 Testing file upload...');

  const testFileName = `test-${Date.now()}.txt`;
  const testFilePath = `menu-items/${testFileName}`;
  const testContent = 'Test upload from setup script';

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(testFilePath, Buffer.from(testContent), {
      contentType: 'text/plain',
      upsert: false,
    });

  if (uploadError) {
    log(colors.red, `❌ Upload test failed: ${uploadError.message}`);
    log(colors.yellow, '\n💡 Next steps:');
    log(colors.yellow, '1. Go to https://app.supabase.com');
    log(colors.yellow, '2. Navigate to Storage → Buckets');
    log(colors.yellow, `3. Check if "${BUCKET_NAME}" bucket exists`);
    log(colors.yellow, '4. Verify "Public bucket" is enabled');
  } else {
    log(colors.green, '✅ Upload test successful!');
    log(colors.blue, `   Path: ${uploadData.path}`);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(testFilePath);

    log(colors.blue, `   URL: ${urlData.publicUrl}`);

    // Clean up test file
    log(colors.cyan, '\n🧹 Cleaning up test file...');
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([testFilePath]);

    if (deleteError) {
      log(
        colors.yellow,
        `⚠️  Could not delete test file: ${deleteError.message}`,
      );
    } else {
      log(colors.green, '✅ Test file deleted');
    }
  }

  // 6. List all files in bucket
  log(colors.cyan, '\n📁 Current files in bucket:');
  const { data: files, error: listFilesError } = await supabase.storage
    .from(BUCKET_NAME)
    .list('menu-items', {
      limit: 10,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (listFilesError) {
    log(colors.yellow, `⚠️  Could not list files: ${listFilesError.message}`);
  } else {
    if (files.length === 0) {
      log(colors.blue, '   (empty)');
    } else {
      files.forEach((file) => {
        log(
          colors.blue,
          `   - ${file.name} (${file.metadata?.size || 0} bytes)`,
        );
      });
    }
  }

  // 7. Summary
  log(colors.green, '\n✅ Setup completed successfully!\n');
  log(colors.cyan, '📝 Next steps:');
  log(
    colors.blue,
    '1. Verify bucket in Supabase Dashboard: https://app.supabase.com',
  );
  log(
    colors.blue,
    '2. Test upload from backend: POST /api/admin/menu/items/:id/photos',
  );
  log(colors.blue, '3. Check uploaded images in Storage → menu-photos');

  log(colors.cyan, '\n🔗 Useful commands:');
  log(colors.blue, '  npm run start:dev          # Start backend server');
  log(colors.blue, '  curl -X POST ... /photos   # Test photo upload');

  log(colors.reset, '');
}

// Run setup
setupStorage().catch((error) => {
  log(colors.red, `\n❌ Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});

import { Controller, Get, Post, Body } from '@nestjs/common';
import { supabase, SUPABASE_BUCKET } from '../config/supabase.config';

interface StorageTestResult {
  success: boolean;
  message: string;
  details?: any;
  error?: string;
}

@Controller('api/test')
export class StorageTestController {
  /**
   * Test Supabase connection and bucket access
   * GET /api/test/storage
   */
  @Get('storage')
  async testStorage(): Promise<StorageTestResult> {
    try {
      // 1. List all buckets
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();

      if (listError) {
        return {
          success: false,
          message: 'Failed to list buckets',
          error: listError.message,
        };
      }

      // 2. Check if menu-photos bucket exists
      const menuPhotosBucket = buckets?.find((b) => b.name === SUPABASE_BUCKET);

      if (!menuPhotosBucket) {
        return {
          success: false,
          message: `Bucket "${SUPABASE_BUCKET}" not found`,
          details: {
            availableBuckets: buckets?.map((b) => b.name) || [],
            instruction: 'Run: npm run storage:setup',
          },
        };
      }

      // 3. List files in bucket
      const { data: files, error: filesError } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .list('menu-items', { limit: 5 });

      if (filesError) {
        return {
          success: false,
          message: 'Bucket exists but cannot list files',
          error: filesError.message,
        };
      }

      return {
        success: true,
        message: 'Storage is configured correctly',
        details: {
          bucket: {
            name: menuPhotosBucket.name,
            public: menuPhotosBucket.public,
            created_at: menuPhotosBucket.created_at,
          },
          filesCount: files?.length || 0,
          sampleFiles: files?.slice(0, 3).map((f) => f.name) || [],
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Unexpected error',
        error: error.message,
      };
    }
  }

  /**
   * Test file upload
   * POST /api/test/storage/upload
   */
  @Post('storage/upload')
  async testUpload(@Body() body: { filename?: string }): Promise<StorageTestResult> {
    try {
      const testFileName = body.filename || `test-${Date.now()}.txt`;
      const testFilePath = `menu-items/${testFileName}`;
      const testContent = `Test upload at ${new Date().toISOString()}`;

      // Upload test file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(testFilePath, Buffer.from(testContent), {
          contentType: 'text/plain',
          upsert: false,
        });

      if (uploadError) {
        return {
          success: false,
          message: 'Upload failed',
          error: uploadError.message,
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(SUPABASE_BUCKET)
        .getPublicUrl(testFilePath);

      // Clean up (delete test file)
      await supabase.storage.from(SUPABASE_BUCKET).remove([testFilePath]);

      return {
        success: true,
        message: 'Upload test successful',
        details: {
          path: uploadData.path,
          url: urlData.publicUrl,
          note: 'Test file was automatically deleted',
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Unexpected error during upload',
        error: error.message,
      };
    }
  }

  /**
   * Get storage configuration info
   * GET /api/test/storage/config
   */
  @Get('storage/config')
  getConfig(): any {
    return {
      bucket: SUPABASE_BUCKET,
      supabaseUrl: process.env.SUPABASE_URL || 'NOT_SET',
      hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      endpoints: {
        test: 'GET /api/test/storage',
        upload: 'POST /api/test/storage/upload',
        config: 'GET /api/test/storage/config',
      },
    };
  }
}

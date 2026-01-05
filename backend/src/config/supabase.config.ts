import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_BUCKET = 'menu-photos';

let supabaseClient: SupabaseClient | null = null;

// Lazy initialization - only creates client when first accessed
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        '❌ Supabase credentials not configured!\n' +
        '📝 Please add SUPABASE_URL and SUPABASE_SERVICE_KEY to your .env file\n' +
        '🔗 Get them from: https://app.supabase.com → Your Project → Settings → API'
      );
    }

    console.log('✅ Supabase Storage connected successfully');
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  return supabaseClient;
}

// Export for backward compatibility (but use function instead)
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    return getSupabaseClient()[prop as keyof SupabaseClient];
  }
});

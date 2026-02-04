import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null;

// Build-safe lazy-loaded client
export const supabase = new Proxy({} as any, {
    get: (target, prop) => {
        if (!client) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
            const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

            // Only log warning if variables are missing AND we're not in build phase
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
                if (process.env.NEXT_PHASE !== 'phase-production-build') {
                    console.warn('⚠️ Supabase environment variables missing. Database calls will fail.');
                }
            }

            client = createClient(supabaseUrl, supabaseServiceRoleKey, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                },
            });
        }
        return (client as any)[prop];
    }
}) as SupabaseClient;

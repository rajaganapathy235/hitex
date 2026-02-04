import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'

// Build-safe client creation
export const supabase = (function () {
    // Only validate if we're not in build mode or if variables are provided
    const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
    const hasVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!hasVars && !isBuild) {
        console.warn('⚠️ Supabase environment variables are missing. Database operations will fail.')
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
})();

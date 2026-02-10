'use server'

import { createClient } from '@supabase/supabase-js'

export async function syncUserProfile(user: any) {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { error } = await supabaseAdmin
            .from('users')
            .upsert({
                id: user.id,
                email: user.email!,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                avatar_url: user.user_metadata?.avatar_url,
                role: 'client', // Default to client if missing
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' })

        if (error) {
            console.error('Admin sync error:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error: any) {
        console.error('Server action error:', error)
        return { success: false, error: error.message }
    }
}

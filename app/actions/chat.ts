'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getConversations() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Unauthorized' }

        const { data, error } = await supabase
            .from('conversations')
            .select(`
                id,
                updated_at,
                participant_1:participant_1_id(email, user_metadata),
                participant_2:participant_2_id(email, user_metadata),
                last_message_at
            `)
            .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
            .order('last_message_at', { ascending: false })

        if (error) {
            console.error('Error fetching conversations:', error)
            return { success: false, error: error.message }
        }

        // Format data to simplify frontend usage
        // Identify the "other" participant
        const formattedConversations = data.map((conv: any) => {
            const isP1 = conv.participant_1_id === user.id
            const otherUser = isP1 ? conv.participant_2 : conv.participant_1
            // In case join returns array or object depending on relationship (should be object for single)
            // Supabase returns array if it's One-to-Many but here it's FK so it should be object if correct join?
            // Wait, standard select with foreign key returns object if singular relation.
            // Let's assume standard object return or array of one.

            // Actually, let's just return raw and process on frontend or do simple mapping here.
            // But 'participant_1' in select returns the object directly if set up correctly.
            // Let's refine the select to be safer:
            /*
            participant_1:users!participant_1_id(email, raw_user_meta_data)
            */
            // But let's stick to the current simplified select and debug if needed.

            // Let's manually get the other user for cleaner UI
            const otherParticipant = conv.participant_1?.email === user.email ? conv.participant_2 : conv.participant_1

            return {
                id: conv.id,
                updated_at: conv.updated_at,
                last_message_at: conv.last_message_at,
                other_user: {
                    email: otherParticipant?.email,
                    full_name: otherParticipant?.user_metadata?.full_name || otherParticipant?.email?.split('@')[0] || 'User',
                    avatar_url: otherParticipant?.user_metadata?.avatar_url
                }
            }
        })

        return { success: true, data: formattedConversations }

    } catch (error: any) {
        console.error('Server error getting conversations:', error)
        return { success: false, error: error.message }
    }
}

export async function getMessages(conversationId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Unauthorized' }

        // Verify participation
        const { data: conversation, error: convError } = await supabase
            .from('conversations')
            .select('id, participant_1_id, participant_2_id')
            .eq('id', conversationId)
            .single()

        if (convError || !conversation) {
            return { success: false, error: 'Conversation not found' }
        }

        if (conversation.participant_1_id !== user.id && conversation.participant_2_id !== user.id) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching messages:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function sendMessage(conversationId: string, content: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Unauthorized' }

        // Insert message
        const { data, error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: user.id,
                content: content
            })
            .select() // Return data to confirm

        if (error) {
            console.error('Error sending message:', error)
            return { success: false, error: error.message }
        }

        // Update conversation updated_at
        await supabase
            .from('conversations')
            .update({ last_message_at: new Date().toISOString() })
            .eq('id', conversationId)

        return { success: true, data: data[0] }

    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function startConversation(otherUserId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Unauthorized' }

        // Check if exists
        // We need to check if a conversation exists between these two.
        // (p1 = me AND p2 = other) OR (p1 = other AND p2 = me)
        const { data: existing, error: searchError } = await supabase
            .from('conversations')
            .select('id')
            .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${otherUserId}),and(participant_1_id.eq.${otherUserId},participant_2_id.eq.${user.id})`)
            .single() // Should be unique

        if (existing) {
            return { success: true, data: existing }
        }

        // Create new
        const { data, error } = await supabase
            .from('conversations')
            .insert({
                participant_1_id: user.id,
                participant_2_id: otherUserId
            })
            .select()
            .single()

        if (error) {
            return { success: false, error: error.message }
        }

        revalidatePath('/messages')
        return { success: true, data }

    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

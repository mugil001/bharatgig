'use server';

import { createClient } from '@/lib/supabase/server';

export async function getConversations() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { data, error } = await supabase
        .from('conversations')
        .select(`
            *,
            participant_1:users!participant_1_id(id, full_name, avatar_url),
            participant_2:users!participant_2_id(id, full_name, avatar_url)
        `)
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

    if (error) {
        console.error('Error fetching conversations:', error);
        return { error: 'Failed to fetch conversations' };
    }

    return { conversations: data };
}

export async function sendMessage(recipientId: string, content: string, conversationId?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    let cid = conversationId;

    // If no conversation ID, check if one exists or create new
    if (!cid) {
        // Check existing
        const { data: existing } = await supabase
            .from('conversations')
            .select('id')
            .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${recipientId}),and(participant_1_id.eq.${recipientId},participant_2_id.eq.${user.id})`)
            .single();

        if (existing) {
            cid = existing.id;
        } else {
            // Create new conversation
            const { data: newConv, error: createError } = await supabase
                .from('conversations')
                .insert({
                    participant_1_id: user.id,
                    participant_2_id: recipientId,
                    last_message_at: new Date().toISOString()
                })
                .select()
                .single();

            if (createError) return { error: 'Failed to create conversation' };
            cid = newConv.id;
        }
    }

    // Insert Message
    const { error: msgError } = await supabase
        .from('messages')
        .insert({
            conversation_id: cid,
            sender_id: user.id,
            content
        });

    if (msgError) return { error: 'Failed to send message' };

    // Update conversation timestamp
    await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', cid);

    return { success: true, conversationId: cid };
}

export async function getMessages(conversationId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) return { error: 'Failed to fetch messages' };

    return { messages: data };
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const { orderCreationId, razorpayPaymentId, razorpaySignature, plan, cycle } = await request.json();

    const signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(orderCreationId + '|' + razorpayPaymentId)
        .digest('hex');

    if (signature !== razorpaySignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Signature is valid, update database
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Calculate period end based on cycle
    const startDate = new Date();
    const endDate = new Date();
    if (cycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
        endDate.setMonth(endDate.getMonth() + 1);
    }

    // Upsert subscription
    const { error } = await supabase
        .from('subscriptions')
        .upsert({
            user_id: user.id,
            plan: cycle, // Using 'cycle' for the 'plan' column as per instruction's internal decision
            status: 'active',
            current_period_start: startDate.toISOString(),
            current_period_end: endDate.toISOString(),
            razorpay_subscription_id: razorpayPaymentId, // Storing payment ID here for reference
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

    if (error) {
        console.error('Database Update Error:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Payment verified and subscription updated' });
}

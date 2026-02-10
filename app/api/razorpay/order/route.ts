import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
    const { plan, cycle, amount } = await request.json();

    if (!plan || !amount) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                plan,
                cycle,
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error) {
        console.error('Razorpay Order Creation Error:', error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}

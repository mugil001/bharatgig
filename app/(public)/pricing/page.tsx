'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, User, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [role, setRole] = useState<'freelancer' | 'client'>('freelancer');
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, [supabase]);

    const plans = {
        freelancer: {
            monthly: { price: '129', per: '/mo', total: '129' },
            yearly: { price: '108', per: '/mo', total: '1299', save: 'Save ₹249' },
            features: ['Verified Badge', 'Priority Support', '0% Commission Fees', 'Unlimited Proposals', 'Skills Assessment'],
        },
        client: {
            monthly: { price: '259', per: '/mo', total: '259' },
            yearly: { price: '216', per: '/mo', total: '2599', save: 'Save ₹509' },
            features: ['Advanced Talent Search', 'Dedicated Account Manager', 'Bulk Invoicing', 'Premium Job Posts', 'Team Collaboration'],
        }
    };

    const currentPlan = plans[role][billingCycle];

    const handlePlanClick = () => {
        if (user) {
            router.push(`/payments?plan=${role}&cycle=${billingCycle}`);
        } else {
            router.push(`/signup?plan=${role}&cycle=${billingCycle}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-zinc-900 font-sans selection:bg-blue-100">
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-zinc-900">Simple, transparent pricing.</h1>
                        <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                            Choose the perfect plan to accelerate your career or scale your business.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-6 mb-16">

                        {/* Role Switcher */}
                        <div className="bg-white p-1 rounded-full border border-gray-200 shadow-sm flex items-center">
                            <button
                                onClick={() => setRole('freelancer')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${role === 'freelancer'
                                    ? 'bg-zinc-900 text-white shadow-md'
                                    : 'text-zinc-500 hover:text-zinc-900'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    For Work (Freelancer)
                                </span>
                            </button>
                            <button
                                onClick={() => setRole('client')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${role === 'client'
                                    ? 'bg-zinc-900 text-white shadow-md'
                                    : 'text-zinc-500 hover:text-zinc-900'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    For Hiring (Client)
                                </span>
                            </button>
                        </div>

                        {/* Billing Switcher */}
                        <div className="flex items-center gap-4">
                            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-zinc-900' : 'text-zinc-500'}`}>Monthly</span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                className="w-12 h-6 bg-zinc-200 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${billingCycle === 'yearly' ? 'left-7' : 'left-1'}`} />
                            </button>
                            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-zinc-900' : 'text-zinc-500'}`}>
                                Yearly <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full ml-1 font-bold">SAVE 15%</span>
                            </span>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="max-w-md mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${role}-${billingCycle}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl relative overflow-hidden"
                            >
                                {billingCycle === 'yearly' && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                        BEST VALUE
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                                        {role === 'freelancer' ? 'Pro Freelancer' : 'Enterprise Growth'}
                                    </h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-bold text-zinc-900">₹{currentPlan.total}</span>
                                        <span className="text-zinc-500 font-medium">{billingCycle === 'monthly' ? '/mo' : '/year'}</span>
                                    </div>
                                    <p className="text-sm text-zinc-500 mt-2">
                                        {billingCycle === 'yearly' ? `Equivalent to ₹${currentPlan.price}/mo. Billed annually.` : 'Billed monthly. Cancel anytime.'}
                                    </p>
                                </div>

                                <Button
                                    className="w-full py-6 text-lg bg-zinc-900 text-white hover:bg-zinc-800 mb-8 rounded-xl shadow-lg shadow-zinc-900/10"
                                    onClick={handlePlanClick}
                                >
                                    {billingCycle === 'yearly' ? 'Get Yearly Plan' : 'Get Monthly Plan'}
                                </Button>

                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-zinc-900">Everything in Free, plus:</p>
                                    {plans[role].features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="text-zinc-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}

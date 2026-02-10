'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, MessageSquare, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
                // Auto-redirect based on role
                const role = user.user_metadata?.role;
                if (role === 'client') {
                    router.push('/dashboard/client');
                } else if (role === 'freelancer') {
                    router.push('/dashboard/freelancer');
                } else {
                    // Only stop loading if no role is found, so we can show the selection UI
                    setLoading(false);
                }
            }
        };
        checkUser();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--aurora-3)]" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-zinc-900 font-sans">
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-6 pt-20">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold mb-4 tracking-tight text-zinc-900">Welcome back, {user?.email}</h1>
                        <p className="text-zinc-500 text-lg">Choose your workspace to continue.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Freelancer Card */}
                        <div className="group relative bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                            onClick={() => router.push('/dashboard/freelancer')}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Work</h3>
                            <p className="text-zinc-500 mb-6">Find jobs, manage proposals, and track your earnings as a freelancer.</p>
                            <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                                Enter Workspace <TrendingUp className="w-4 h-4 ml-2" />
                            </div>
                        </div>

                        {/* Client Card */}
                        <div className="group relative bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                            onClick={() => router.push('/dashboard/client')}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Hire</h3>
                            <p className="text-zinc-500 mb-6">Post jobs, review proposals, and manage your team of freelancers.</p>
                            <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                                Enter Workspace <TrendingUp className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Button variant="ghost" onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}>
                            Sign Out
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

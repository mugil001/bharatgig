'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Sparkles, Briefcase } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { PasswordStrength } from '@/components/ui/password-strength';

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<'freelancer' | 'client' | null>(null);
    const [password, setPassword] = useState('');
    const router = useRouter();
    const supabase = createClient();

    async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!role) return;

        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        // Password is already in state, but ensuring it matches form data
        const formPassword = formData.get('password') as string;
        const fullName = formData.get('fullName') as string;

        const { error } = await supabase.auth.signUp({
            email,
            password: formPassword,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        });

        if (!error) {
            router.refresh();
            const plan = new URLSearchParams(window.location.search).get('plan');
            const cycle = new URLSearchParams(window.location.search).get('cycle');

            if (plan) {
                router.push(`/payments?plan=${plan}&cycle=${cycle || 'monthly'}`);
            } else {
                router.push('/dashboard');
            }
        } else {
            setLoading(false);
            // In a real app, show error toast here
            console.error(error);
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) setLoading(false);
    };

    return (
        <div className="w-full max-w-md space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold tracking-tight mb-2">Create Account</h1>
                <p className="text-muted-foreground">Join the BharatGig community today.</p>
            </motion.div>

            <form onSubmit={handleSignup} className="space-y-6">
                {/* Role Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <div
                        onClick={() => setRole('freelancer')}
                        className={`p-4 border rounded-xl cursor-pointer transition-all hover:border-primary/50 ${role === 'freelancer' ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-card'}`}
                    >
                        <Sparkles className={`w-5 h-5 mb-3 ${role === 'freelancer' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className={`font-semibold ${role === 'freelancer' ? 'text-foreground' : 'text-muted-foreground'}`}>Freelancer</div>
                        <div className="text-xs text-muted-foreground">I want to work</div>
                    </div>

                    <div
                        onClick={() => setRole('client')}
                        className={`p-4 border rounded-xl cursor-pointer transition-all hover:border-primary/50 ${role === 'client' ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-card'}`}
                    >
                        <Briefcase className={`w-5 h-5 mb-3 ${role === 'client' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className={`font-semibold ${role === 'client' ? 'text-foreground' : 'text-muted-foreground'}`}>Client</div>
                        <div className="text-xs text-muted-foreground">I want to hire</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <PasswordStrength password={password} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-4"
                >
                    <Button type="submit" className="w-full" size="lg" disabled={loading || !role}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Google
                    </Button>
                </motion.div>
            </form>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
}

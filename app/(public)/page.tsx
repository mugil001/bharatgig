'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle2, Star, Zap, Shield, Globe } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                                Unlock Your Potential with <br /> <span className="text-foreground">BharatGig</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                        >
                            India's premier marketplace for top-tier freelance talent and visionary businesses. Connect, collaborate, and create the future together.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row justify-center gap-4"
                        >
                            <Button size="lg" className="rounded-full px-8 text-lg" asChild>
                                <Link href="/signup">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full px-8 text-lg" asChild>
                                <Link href="/jobs">Find Work</Link>
                            </Button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
                        >
                            {[
                                { label: 'Freelancers', value: '50k+' },
                                { label: 'Completed Jobs', value: '120k+' },
                                { label: 'Satisfied Clients', value: '15k+' },
                                { label: 'Total Paid', value: '₹50Cr+' },
                            ].map((stat, i) => (
                                <div key={i} className="p-4 rounded-xl bg-card border shadow-sm">
                                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-muted/30" ref={targetRef}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Why Choose BharatGig?</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We provide the tools and security you need to focus on what you do best—delivering excellence.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Shield,
                                    title: 'Secure Payments',
                                    desc: 'Funds are held securely in escrow until work is approved. Get paid on time, every time.'
                                },
                                {
                                    icon: Zap,
                                    title: 'Fast Matches',
                                    desc: 'Our AI-driven matching system connects you with the perfect opportunities instantly.'
                                },
                                {
                                    icon: Globe,
                                    title: 'Global Reach',
                                    desc: 'Work with clients from around the world without leaving your home.'
                                },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    style={{ opacity, y }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categories Preview */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold mb-12 text-center">Popular Categories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Development', 'Design', 'Marketing', 'Writing', 'Admin Support', 'Customer Service', 'Data Science', 'Engineering'].map((cat, i) => (
                                <Link
                                    key={i}
                                    href={`/jobs?category=${cat.toLowerCase()}`}
                                    className="p-6 rounded-xl border bg-card hover:border-primary/50 hover:bg-muted/50 transition-colors text-center font-medium"
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-primary text-primary-foreground">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
                        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals and businesses already succeeding on BharatGig.
                        </p>
                        <Button size="lg" variant="secondary" className="rounded-full px-8 text-black" asChild>
                            <Link href="/signup">Join Now - It's Free</Link>
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

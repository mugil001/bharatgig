'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Visual Side (Left on Desktop) */}
            <div className="hidden lg:relative lg:block h-full w-full overflow-hidden bg-muted order-2 lg:order-1">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 h-full w-full"
                >
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                        alt="Workspace collaboration"
                        className="h-full w-full object-cover grayscale opacity-50"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
                <div className="absolute bottom-0 left-0 p-12 text-foreground z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-3xl font-bold mb-4"
                    >
                        "Empowering the future of work."
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-lg opacity-80"
                    >
                        Connect, collaborate, and grow with BharatGig.
                    </motion.p>
                </div>
            </div>

            {/* Form Side (Right on Desktop) */}
            <div className="flex items-center justify-center p-8 md:p-12 relative bg-background order-1 lg:order-2 overflow-y-auto">
                <Link href="/" className="absolute top-8 right-8 text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors flex items-center gap-2">
                    Back to Home <ArrowRight className="h-4 w-4" />
                </Link>
                {children}
            </div>
        </div>
    );
}

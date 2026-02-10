'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, DollarSign, Send, Search } from 'lucide-react';
import Link from 'next/link';

export default function FreelancerDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100 text-zinc-900">
            <Navbar />
            <main className="container mx-auto px-6 py-24">

                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Freelancer Workspace</h1>
                        <p className="text-zinc-500">Track your work and find new opportunities.</p>
                    </div>
                    <Button className="bg-zinc-900 text-white hover:bg-zinc-800" asChild>
                        <Link href="/jobs">
                            <Search className="w-4 h-4 mr-2" />
                            Find Work
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Total Earnings</CardTitle>
                            <DollarSign className="w-4 h-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-zinc-900">$1,250</div>
                            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Active Proposals</CardTitle>
                            <Send className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-zinc-900">8</div>
                            <p className="text-xs text-zinc-400 mt-1">3 viewed by clients</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Active Jobs</CardTitle>
                            <Briefcase className="w-4 h-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-zinc-900">2</div>
                            <p className="text-xs text-zinc-400 mt-1">Due this week</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recommended Jobs Mockup */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-zinc-900">Jobs for you</h3>
                        <Button variant="ghost" className="text-sm text-blue-600 hover:text-blue-700" asChild>
                            <Link href="/jobs">View All Matches</Link>
                        </Button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 group hover:border-blue-200 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">E-commerce UI/UX Design</h4>
                                        <p className="text-sm text-zinc-500 mt-1">Looking for an experienced designer to revamp our Shopify store...</p>
                                        <div className="flex gap-2 mt-3 text-xs text-zinc-400">
                                            <span className="bg-white px-2 py-1 rounded border border-gray-200">Fixed Price</span>
                                            <span className="bg-white px-2 py-1 rounded border border-gray-200">$500 - $1k</span>
                                            <span className="bg-white px-2 py-1 rounded border border-gray-200">Expert</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="bg-white">Apply</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}

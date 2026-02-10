'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Users, FileText, Plus, User } from 'lucide-react';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ClientDashboard() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchClientJobs = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('client_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setJobs(data || []);
            } catch (error) {
                console.error('Error fetching client jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100 text-zinc-900">
            <Navbar />
            <main className="container mx-auto px-6 py-24">

                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Client Workspace</h1>
                        <p className="text-zinc-500">Manage your postings and hires.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/dashboard/profile">
                            <Button variant="outline" className="border-zinc-200 hover:bg-gray-100">
                                <User className="w-4 h-4 mr-2" />
                                Company Profile
                            </Button>
                        </Link>
                        <Link href="/jobs/create">
                            <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
                                <Plus className="w-4 h-4 mr-2" />
                                Post a Job
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Active Jobs</CardTitle>
                            <Briefcase className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-zinc-900">{jobs.filter(j => j.status === 'open').length}</div>
                            <p className="text-xs text-zinc-400 mt-1">Open for proposals</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Hired Talent</CardTitle>
                            <Users className="w-4 h-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-zinc-900">0</div>
                            <p className="text-xs text-zinc-400 mt-1">Active contracts</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Total Spent</CardTitle>
                            <FileText className="w-4 h-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-zinc-900">$0</div>
                            <p className="text-xs text-zinc-400 mt-1">This month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Job Postings */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-zinc-900">Recent Job Postings</h3>
                        <Button variant="ghost" className="text-sm text-blue-600 hover:text-blue-700">View All</Button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {jobs.length === 0 ? (
                                <p className="text-center text-zinc-500 py-4">No jobs posted yet.</p>
                            ) : (
                                jobs.map((job) => (
                                    <div key={job.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 gap-4">
                                        <div>
                                            <h4 className="font-medium text-zinc-900">{job.title}</h4>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                Posted {new Date(job.created_at).toLocaleDateString()} • {job.budget_type}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-sm font-medium text-zinc-900">{job.proposals_count || 0} Proposals</p>
                                                <p className="text-xs text-green-600">Active</p>
                                            </div>
                                            <Link href={`/jobs/${job.id}`}>
                                                <Button variant="outline" size="sm" className="bg-white border-zinc-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                                                    Manage Job
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}

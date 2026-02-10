'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    MapPin, DollarSign, Clock, Briefcase, Globe,
    ArrowLeft, CheckCircle2, Share2, Bookmark, Building2, Calendar, Target
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function JobDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const supabase = createClient()
    const [job, setJob] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Extract id from params (can be string or string[])
    const id = typeof params.id === 'string' ? params.id : params.id?.[0]

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) {
                setError('Invalid job ID')
                setLoading(false)
                return
            }

            try {
                // Fetch job details including client profile via users
                // Using relaxed join syntax
                const { data, error } = await supabase
                    .from('jobs')
                    .select(`
                        *,
                        category:category_id(name),
                        client:client_id (
                           full_name,
                           client_profiles (
                             company_name,
                             industry
                           )
                        )
                    `)
                    .eq('id', id)
                    .single()

                if (error) {
                    console.error('Supabase error:', JSON.stringify(error, null, 2))
                    throw error
                }
                setJob(data)
            } catch (err: any) {
                console.error('Error fetching job:', err)
                setError(err.message || 'Failed to load job details. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchJob()
    }, [id])

    if (loading) return <JobSkeleton />
    if (error || !job) return <JobError message={error || 'Job not found'} />

    const clientData = job.client?.client_profiles?.[0] || job.client?.client_profiles || {}
    const companyName = clientData.company_name || 'Confidential Client'
    const location = clientData.location || 'Remote'
    const postedDate = new Date(job.created_at).toLocaleDateString(undefined, {
        day: 'numeric', month: 'long', year: 'numeric'
    })
    const budget = job.budget_min && job.budget_max
        ? `₹${job.budget_min.toLocaleString()} - ₹${job.budget_max.toLocaleString()}`
        : 'Negotiable'

    const categoryName = job.category?.name || 'General'

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100 text-zinc-900">
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-20">
                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/jobs" className="inline-flex items-center text-zinc-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Jobs
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Card */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-2xl font-bold font-mono text-blue-600 shadow-sm">
                                        {companyName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl font-bold text-zinc-900 leading-tight">{job.title}</h1>
                                            {categoryName && (
                                                <Badge variant="outline" className="text-zinc-500 bg-gray-50 border-gray-200">
                                                    {categoryName}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-zinc-500 text-sm">
                                            <span className="flex items-center gap-1.5 font-medium text-zinc-700">
                                                <Building2 className="w-4 h-4 text-blue-500" />
                                                {companyName}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                {location}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                Posted {postedDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Bookmark className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                                {job.skills?.map((skill: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-zinc-700 px-3 py-1 font-medium">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                Job Overview
                            </h2>
                            <div className="prose prose-zinc max-w-none text-zinc-600 whitespace-pre-wrap leading-relaxed">
                                {job.description}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg shadow-blue-900/5 lg:sticky lg:top-32">
                            <h3 className="text-lg font-bold text-zinc-900 mb-6">Job Details</h3>

                            <div className="space-y-5 mb-8">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Budget</p>
                                            <p className="font-bold text-zinc-900">{budget}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Briefcase className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Job Type</p>
                                            <p className="font-bold text-zinc-900 capitalize">{job.budget_type?.replace('_', ' ') || 'Fixed Price'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Experience</p>
                                            <p className="font-bold text-zinc-900 capitalize">{job.experience_level || 'Entry'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/jobs/${id}/apply`} className="block w-full">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl text-md shadow-blue-200 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    Apply Now
                                </Button>
                            </Link>

                            <p className="text-center text-xs text-zinc-400 mt-4">
                                You need to maintain a 90%+ profile completion to apply.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

function JobSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Skeleton className="h-64 w-full rounded-3xl mb-8" />
                        <Skeleton className="h-96 w-full rounded-3xl" />
                    </div>
                    <div>
                        <Skeleton className="h-80 w-full rounded-3xl" />
                    </div>
                </div>
            </main>
        </div>
    )
}

function JobError({ message }: { message: string }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center justify-center p-6 text-center">
            <Navbar />
            <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
                <Target className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Job Not Found</h2>
                <p className="text-zinc-500 mb-6">{message}</p>
                <Link href="/jobs">
                    <Button>Return to Jobs Board</Button>
                </Link>
            </div>
        </div>
    )
}

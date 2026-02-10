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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    MapPin, DollarSign, Clock, Briefcase, Globe,
    ArrowLeft, CheckCircle2, Share2, Bookmark, Building2, Calendar, Target,
    Send
} from 'lucide-react'
import { submitProposal } from '@/app/actions/proposals'
import { useFormStatus } from 'react-dom'

export default function JobApplicationPage() {
    const params = useParams()
    const router = useRouter()
    const supabase = createClient()
    const [job, setJob] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [submitResult, setSubmitResult] = useState<{ success?: boolean; error?: string } | null>(null)

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

    async function handleSubmission(formData: FormData) {
        // Automatically handled by 'action' prop in form but need to add jobId
        formData.append('jobId', id as string)

        const result: any = await submitProposal(formData)

        if (result.success) {
            setSubmitResult({ success: true })
            // Redirect after 2 seconds
            setTimeout(() => {
                router.push(`/jobs/${id}`)
            }, 2000)
        } else {
            setSubmitResult({ error: result.error })
        }
    }

    if (loading) return <ApplicationSkeleton />
    if (error || !job) return <ApplicationError message={error || 'Job not found'} />

    const clientData = job.client?.client_profiles?.[0] || job.client?.client_profiles || {}
    const companyName = clientData.company_name || 'Confidential Client'
    const budget = job.budget_min && job.budget_max
        ? `₹${job.budget_min.toLocaleString()} - ₹${job.budget_max.toLocaleString()}`
        : 'Negotiable'

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-100 text-zinc-900">
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-20">
                {/* Back Link */}
                <div className="mb-8">
                    <Link href={`/jobs/${id}`} className="inline-flex items-center text-zinc-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Job Details
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Application Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Submit Your Proposal</h1>
                            <p className="text-zinc-500 mb-8"> Applying for <span className="font-semibold text-blue-600">{job.title}</span> at {companyName}</p>

                            {submitResult?.success ? (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-green-800 mb-2">Proposal Submitted Successfully!</h3>
                                    <p className="text-green-600">Redirecting back to job details...</p>
                                </div>
                            ) : (
                                <form action={handleSubmission} className="space-y-6">
                                    {submitResult?.error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                                            {submitResult.error}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="proposedBudget" className="text-base font-semibold">Proposed Budget (₹)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                            <Input
                                                id="proposedBudget"
                                                name="proposedBudget"
                                                type="number"
                                                defaultValue={job.budget_min || ''}
                                                className="pl-8 py-6 text-lg"
                                                placeholder="Enter your bid amount"
                                                required
                                            />
                                        </div>
                                        <p className="text-sm text-zinc-500">Client's budget: {budget}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="proposedDuration" className="text-base font-semibold">How long will this take?</Label>
                                        <Input
                                            id="proposedDuration"
                                            name="proposedDuration"
                                            type="text"
                                            className="py-6 text-lg"
                                            placeholder="e.g. 2 weeks, 1 month"
                                            defaultValue={job.duration || ''}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="coverLetter" className="text-base font-semibold">Cover Letter</Label>
                                        <Textarea
                                            id="coverLetter"
                                            name="coverLetter"
                                            className="min-h-[200px] text-base resize-y p-4"
                                            placeholder="Describe why you are the best fit for this job..."
                                            required
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <SubmitButton />
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Job Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg shadow-blue-900/5 lg:sticky lg:top-32">
                            <h3 className="text-lg font-bold text-zinc-900 mb-6">Job Summary</h3>

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
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button
            disabled={pending}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-xl text-lg shadow-blue-200 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
            {pending ? 'Submitting Proposal...' : 'Submit Proposal'}
            {!pending && <Send className="w-5 h-5 ml-2" />}
        </Button>
    )
}

function ApplicationSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Skeleton className="h-12 w-3/4 rounded-xl mb-8" />
                        <Skeleton className="h-[600px] w-full rounded-3xl" />
                    </div>
                    <div>
                        <Skeleton className="h-80 w-full rounded-3xl" />
                    </div>
                </div>
            </main>
        </div>
    )
}

function ApplicationError({ message }: { message: string }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center justify-center p-6 text-center">
            <Navbar />
            <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
                <Target className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Error</h2>
                <p className="text-zinc-500 mb-6">{message}</p>
                <Link href="/jobs">
                    <Button>Return to Jobs Board</Button>
                </Link>
            </div>
        </div>
    )
}

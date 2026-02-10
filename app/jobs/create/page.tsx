'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { syncUserProfile } from '@/app/actions/user'
import { Briefcase, ArrowLeft, Sparkles, Zap, Shield, Rocket, ChevronRight } from 'lucide-react'

export default function CreateJobPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('job_categories').select('id, slug, name')
            if (data) setCategories(data)
        }
        fetchCategories()
    }, [])


    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        budget: '',
        duration: '',
        negotiable: false,
        skills: '',
        experienceLevel: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))
    }

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const createJob = async () => {
        try {
            setLoading(true)

            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            // Ensure user exists in public.users to prevent FK error using Server Action (bypasses RLS)
            const { success, error: userError } = await syncUserProfile({
                id: user.id,
                email: user.email,
                user_metadata: user.user_metadata
            })

            if (!success) {
                console.error('Error syncing user profile:', userError)
                // Continue anyway, maybe it exists? If fail, job insert will catch it.
            }


            // Find category ID or use null
            const categoryId = categories.find(c => c.slug === formData.category || c.name.toLowerCase() === formData.category)?.id

            const jobData: any = {
                title: formData.title,
                description: formData.description,
                budget_min: parseFloat(formData.budget) || 0,
                budget_max: parseFloat(formData.budget) || 0,
                budget_type: 'fixed',
                duration: formData.duration,
                experience_level: formData.experienceLevel === 'entry' ? 'beginner' : formData.experienceLevel,
                client_id: user.id,
                status: 'open',
                proposals_count: 0
            }

            if (categoryId) jobData.category_id = categoryId

            // Optional: Map negotiable status to description since column might be missing
            if (formData.negotiable) {
                jobData.description += '\n\n(Budget is negotiable)'
            }

            // REMOVED: jobData.category = formData.category
            // REMOVED: jobData.is_negotiable = formData.negotiable
            // REMOVED: jobData.skills = ...


            const { error } = await supabase
                .from('jobs')
                .insert(jobData)
                .select()
                .single()

            if (error) throw error

            router.push('/dashboard/client')
        } catch (error: any) {
            console.error('Error creating job:', error)
            alert(`Failed to create job: ${error.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white selection:bg-indigo-500/30">
            {/* Simple Header */}
            <div className="border-b border-slate-200/10 glass sticky top-0 z-50 backdrop-blur-md">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-slate-500 hover:text-indigo-500 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold">BharatGig</span>
                    </div>
                    <div className="w-24" /> {/* Spacer */}
                </div>
            </div>

            <div className="container mx-auto px-6 py-20 max-w-4xl">
                {/* Progress Bar */}
                <div className="flex items-center space-x-4 mb-16">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1 h-1.5 rounded-full relative bg-slate-100 dark:bg-slate-800">
                            <div
                                className={`absolute inset-0 bg-indigo-600 rounded-full transition-all duration-500 ${step >= s ? 'w-full' : 'w-0'}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {/* Left Column (Context) */}
                    <div className="animate-fade-in-up">
                        <h1 className="text-3xl font-bold mb-4">Post a Project</h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            High-fidelity projects attract elite talent. Describe your vision with clarity.
                        </p>

                        <div className="space-y-6">
                            {[
                                { t: 'Elite Vetting', d: 'Only the top 5% see your post.', i: Sparkles },
                                { t: 'Instant Matches', d: 'Get proposals within hours.', i: Zap },
                                { t: 'Secure Payments', d: 'Fully protected escrow system.', i: Shield },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-3">
                                    <div className="mt-1 w-5 h-5 text-indigo-500">
                                        <item.i className="w-full h-full" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{item.t}</p>
                                        <p className="text-xs text-slate-500">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column (Form) */}
                    <div className="md:col-span-2 glass-card p-10 rounded-3xl">
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-bold">Project Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g., Next.js Frontend for SaaS"
                                        className="h-12 bg-slate-500/5 border-slate-200/10 focus:ring-indigo-500 rounded-xl"
                                    />
                                    <p className="text-xs text-slate-500">Keep it short and professional.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-sm font-bold">Category</Label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full h-12 bg-slate-500/5 border border-slate-200/10 rounded-xl px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        <option value="development">Development & IT</option>
                                        <option value="design">Design & Creative</option>
                                        <option value="marketing">Sales & Marketing</option>
                                        <option value="writing">Writing & Translation</option>
                                        <option value="admin">Admin & Customer Support</option>
                                        <option value="finance">Finance & Accounting</option>
                                        <option value="engineering">Engineering & Architecture</option>
                                        <option value="legal">Legal</option>
                                        <option value="hr">HR & Training</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <Button onClick={nextStep} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl font-bold shadow-lg shadow-indigo-600/20 group">
                                    Continue
                                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-bold">Project Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the goals, requirements, and deliverables..."
                                        className="min-h-[150px] bg-slate-500/5 border-slate-200/10 focus:ring-indigo-500 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="skills" className="text-sm font-bold">Required Skills</Label>
                                        <Input
                                            id="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            placeholder="e.g. React, Node.js, Design"
                                            className="h-12 bg-slate-500/5 border-slate-200/10 focus:ring-indigo-500 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experienceLevel" className="text-sm font-bold">Experience Level</Label>
                                        <select
                                            id="experienceLevel"
                                            value={formData.experienceLevel}
                                            onChange={handleChange}
                                            className="w-full h-12 bg-slate-500/5 border border-slate-200/10 rounded-xl px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            <option value="" disabled>Select Level</option>
                                            <option value="entry">Entry Level</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="expert">Expert</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="budget" className="text-sm font-bold">Budget Estimate (₹)</Label>
                                        <Input
                                            id="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            placeholder="e.g. 50000"
                                            type="number"
                                            className="h-12 bg-slate-500/5 border-slate-200/10 focus:ring-indigo-500 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="duration" className="text-sm font-bold">Duration</Label>
                                        <select
                                            id="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full h-12 bg-slate-500/5 border border-slate-200/10 rounded-xl px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            <option value="" disabled>Select duration</option>
                                            <option value="less_1_month">Less than 1 month</option>
                                            <option value="1_3_months">1 - 3 months</option>
                                            <option value="3_6_months">3 - 6 months</option>
                                            <option value="more_6_months">More than 6 months</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="negotiable"
                                        checked={formData.negotiable}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                    />
                                    <Label htmlFor="negotiable" className="text-sm text-slate-600 dark:text-slate-400">Budget is negotiable based on experience</Label>
                                </div>

                                <div className="flex space-x-4">
                                    <Button variant="outline" onClick={prevStep} className="flex-1 h-12 border-slate-200/10 rounded-xl glass">
                                        Back
                                    </Button>
                                    <Button onClick={nextStep} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl font-bold">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Rocket className="w-10 h-10 text-indigo-600 animate-float" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Ready to Launch?</h2>
                                    <p className="text-slate-500">Your project will be sent to our elite network immediately.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-slate-500/5 space-y-1">
                                            <p className="text-xs text-slate-500 uppercase font-bold">Budget</p>
                                            <p className="font-bold text-lg">₹{formData.budget || '0'}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-500/5 space-y-1">
                                            <p className="text-xs text-slate-500 uppercase font-bold">Timeline</p>
                                            <p className="font-bold text-lg">{formData.duration ? formData.duration.replace(/_/g, ' ') : 'N/A'}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-500/5 space-y-1 col-span-2">
                                            <p className="text-xs text-slate-500 uppercase font-bold">Skills</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.skills.split(',').map((skill, i) => (
                                                    skill.trim() && <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">{skill.trim()}</span>
                                                ))}
                                                {!formData.skills && <span className="text-sm text-slate-400">No specific skills listed</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <Button variant="outline" onClick={prevStep} className="flex-1 h-12 border-slate-200/10 rounded-xl glass">
                                        Review
                                    </Button>
                                    <Button
                                        onClick={createJob}
                                        disabled={loading}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl font-bold shadow-xl shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Posting...' : 'Post Project Now'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

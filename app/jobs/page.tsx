'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet'
import {
    Briefcase, Search, MapPin, DollarSign, Clock, Filter,
    ArrowRight, Bookmark, ArrowUpRight, Zap, Globe, Code, PenTool, Layout, Megaphone, X
} from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function JobsPage() {
    const [activeCategory, setActiveCategory] = useState<string>('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    // Filter States
    const [jobTypes, setJobTypes] = useState<string[]>([])
    const [experienceLevels, setExperienceLevels] = useState<string[]>([])
    const [salaryRange, setSalaryRange] = useState([0, 200000]) // Default max 200k
    const [datePosted, setDatePosted] = useState('any')

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch jobs with categories (Simplified first to fix error)
                // Note: Join with client_profiles is complex via users. 
                // Let's first just get the active jobs to verify data flow.
                const { data, error } = await supabase
                    .from('jobs')
                    .select(`
                        id,
                        title,
                        description,
                        budget_min,
                        budget_max,
                        budget_type,
                        experience_level,
                        created_at,
                        skills,
                        category:category_id (
                            name
                        )
                    `)
                    .eq('status', 'open')
                    .order('created_at', { ascending: false })

                if (error) throw error

                // Transform data to match UI expected format
                const formattedJobs = data.map((job: any) => ({
                    id: job.id,
                    t: job.title,
                    c: job.client_profiles?.company_name || 'Confidential Client',
                    l: job.client_profiles?.location || 'Remote',
                    p: job.budget_min && job.budget_max
                        ? `₹${job.budget_min.toLocaleString()} - ₹${job.budget_max.toLocaleString()}`
                        : 'Negotiable',
                    d: new Date(job.created_at).toLocaleDateString(),
                    tags: job.skills || [], // Use skills array if available
                    category: job.job_categories?.name || 'General'
                }))

                setJobs(formattedJobs)
            } catch (err) {
                console.error('Error fetching jobs:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [])

    const displayedJobs = jobs.length > 0 ? jobs : [] // Use fetched jobs

    const filteredJobs = displayedJobs.filter(job => {
        const matchesCategory = activeCategory === 'All' || job.category === activeCategory
        const matchesSearch = job.t.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.c.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.tags && job.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        return matchesCategory && matchesSearch
    })

    const categories = [
        { n: 'All', i: Briefcase },
        { n: 'Engineering', i: Code },
        { n: 'Design', i: Layout },
        { n: 'Web3', i: Globe },
        { n: 'Writing', i: PenTool },
        { n: 'Marketing', i: Megaphone },
    ]

    return (
        <div className="min-h-screen bg-gray-50 text-zinc-900 font-sans selection:bg-blue-100">
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-xs font-mono tracking-widest uppercase text-blue-600 mb-4">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                            Live Feed
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900">Global Opportunities</h1>
                        <p className="text-zinc-500 max-w-xl text-lg">
                            Curated high-frequency roles for the neo-economy.
                            Verified contracts only.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="flex items-center gap-2 border-gray-200 text-zinc-700 hover:bg-gray-50 bg-white">
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                        <Button className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800">
                            <Zap className="w-4 h-4" />
                            Smart Match
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-12 group">
                    <div className="relative bg-white border border-gray-200 rounded-2xl p-2 flex items-center gap-4 shadow-sm group-focus-within:shadow-md transition-shadow">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-zinc-400">
                            <Search className="w-6 h-6" />
                        </div>
                        <Input
                            className="flex-1 h-12 bg-transparent border-none text-lg placeholder:text-zinc-400 text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Search by role, stack, or protocol..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="hidden md:flex items-center gap-2 pr-4">
                            <span className="text-xs text-zinc-400 border border-gray-200 rounded px-2 py-1 bg-gray-50">CMD + K</span>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide py-1">
                    {categories.map((c, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveCategory(c.n)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all whitespace-nowrap font-medium text-sm ${activeCategory === c.n
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                                : 'bg-white border-gray-200 text-zinc-600 hover:border-gray-300 hover:bg-gray-50 shadow-sm'
                                }`}
                        >
                            <c.i className={`w-4 h-4 ${activeCategory === c.n ? 'text-white' : 'text-zinc-500'} transition-colors`} />
                            <span>{c.n}</span>
                        </button>
                    ))}
                </div>

                {/* Job List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                            >
                                <Link href={`/jobs/${job.id}`} className="absolute inset-0 z-10" />
                                <div className="flex justify-between items-start mb-6 relative z-0">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl font-bold font-mono text-zinc-900 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            {job.c.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{job.t}</h3>
                                            <p className="text-zinc-500 flex items-center gap-2 text-sm mt-1">
                                                <span className="font-medium text-zinc-700">{job.c}</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                                                <MapPin className="w-3 h-3" />
                                                <span>{job.l}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-full border border-gray-100 bg-gray-50 text-zinc-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6 relative z-0">
                                    {job.tags.map((tag: any, j: any) => (
                                        <span key={j} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 border border-gray-100 text-zinc-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-5 border-t border-gray-50 text-sm relative z-0">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-zinc-900 font-semibold">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            <span>{job.p}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-zinc-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{job.d}</span>
                                        </div>
                                    </div>
                                    <button className="text-zinc-400 hover:text-zinc-900 transition-colors relative z-20">
                                        <Bookmark className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-zinc-500 bg-white rounded-3xl border border-gray-100 border-dashed">
                            <p className="text-lg">No jobs found matching your criteria.</p>
                            <Button
                                variant="link"
                                className="mt-2 text-blue-600"
                                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>

            </main>
            <Footer />
        </div>
    )
}

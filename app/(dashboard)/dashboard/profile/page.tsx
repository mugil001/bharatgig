'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Briefcase, User, Building, MapPin, Globe, Loader2, Save, CreditCard, Zap, Crown, Camera, Plus, X, FileText, Clock, Languages, Linkedin, Github, Link as LinkIcon, DollarSign, Twitter, Instagram } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client';
import { Textarea } from '@/components/ui/textarea'

export default function ProfilePage() {
    const [role, setRole] = useState<'freelancer' | 'client'>('freelancer')
    const [loading, setLoading] = useState(false)
    const [subscription, setSubscription] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [profileData, setProfileData] = useState<any>({})
    const supabase = createClient()

    useEffect(() => {
        const fetchProfileData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                // Fetch Subscription
                const { data: sub } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()
                setSubscription(sub)

                // Fetch Profile based on role (default to freelancer initially, or check existing)
                // For now, let's fetch both or toggle based on what exists
                const { data: clientProfile } = await supabase.from('client_profiles').select('*').eq('user_id', user.id).single()
                const { data: freelancerProfile } = await supabase.from('freelancer_profiles').select('*').eq('user_id', user.id).single()

                if (clientProfile && !freelancerProfile) setRole('client')

                // Load data into state based on current role view
                // Actually, let's separate standard state
            }
        }
        fetchProfileData()
    }, [])

    // Effect to load data when role changes or user loads
    useEffect(() => {
        if (!user) return

        const loadRoleData = async () => {
            const table = role === 'client' ? 'client_profiles' : 'freelancer_profiles'
            const { data, error } = await supabase.from(table).select('*').eq('user_id', user.id).single()

            if (data) {
                setProfileData(data)
            } else {
                setProfileData({}) // Reset if no profile found
            }
        }
        loadRoleData()
    }, [role, user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProfileData((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        if (!user) return
        setLoading(true)

        try {
            const table = role === 'client' ? 'client_profiles' : 'freelancer_profiles'

            // Basic fields mapping based on role
            const updateData = {
                user_id: user.id,
                updated_at: new Date().toISOString(),
                ...profileData
            }

            const { error } = await supabase
                .from(table)
                .upsert(updateData)

            if (error) throw error

            // Show success (using alert for now if no toast)
            alert('Profile saved successfully!')
        } catch (error: any) {
            console.error('Error saving profile:', error)
            alert('Error saving profile: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 text-zinc-900 font-sans">
            <Navbar />

            <main className="container mx-auto px-6 pt-24 pb-20 max-w-4xl">

                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4 tracking-tight text-zinc-900">Your Profile</h1>
                    <p className="text-zinc-600">Manage your diverse professional identities.</p>
                </div>

                {/* Subscription Badge */}
                {subscription && subscription.status === 'active' && (
                    <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200 text-yellow-800 p-4 rounded-xl mb-8 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-500 rounded-full p-1.5 text-white">
                                <Crown className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">Pro Plan ({subscription.plan})</p>
                                <p className="text-sm text-yellow-700">Active until {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="border-yellow-300 bg-white/50 text-yellow-900 hover:bg-white hover:text-yellow-950">
                            Manage Subscription
                        </Button>
                    </div>
                )}

                {/* Role Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1 rounded-full border border-gray-200 shadow-sm flex items-center">
                        <button
                            onClick={() => setRole('freelancer')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${role === 'freelancer'
                                ? 'bg-zinc-900 text-white shadow-md'
                                : 'text-zinc-500 hover:text-zinc-900'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Work (Freelancer)
                            </span>
                        </button>
                        <button
                            onClick={() => setRole('client')}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${role === 'client'
                                ? 'bg-zinc-900 text-white shadow-md'
                                : 'text-zinc-500 hover:text-zinc-900'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                Hire (Client)
                            </span>
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={role}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">

                            {/* Freelancer View */}
                            {role === 'freelancer' && (
                                <div className="space-y-8">
                                    {/* Profile Header Card */}
                                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                                        {/* Cover Banner */}
                                        <div className="h-40 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 relative group">
                                            <div className="absolute inset-0 pattern-grid opacity-10"></div>
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <Button variant="ghost" size="sm" className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-4 h-4 mr-2" /> Change Cover
                                            </Button>
                                        </div>

                                        {/* Avatar & Info */}
                                        <div className="px-8 pb-8">
                                            <div className="relative -mt-16 mb-6 flex flex-col md:flex-row justify-between items-end gap-6">
                                                <div className="flex items-end gap-6">
                                                    <div className="relative">
                                                        <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-xl">
                                                            <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center text-4xl font-bold text-zinc-400 overflow-hidden border border-zinc-200">
                                                                {user?.email?.charAt(0).toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                                                    </div>
                                                    <div className="pb-2">
                                                        <h2 className="text-3xl font-bold text-zinc-900">{user?.email?.split('@')[0]}</h2>
                                                        <p className="text-zinc-500 font-medium text-lg">{profileData.title || 'Add your professional title'}</p>
                                                        <div className="flex gap-2 mt-2">
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                                                <Globe className="w-3 h-3 mr-1" /> Remote
                                                            </span>
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                                                                Available
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button variant="outline" className="border-gray-300 text-zinc-700 hover:bg-gray-50">
                                                        View Public Profile
                                                    </Button>
                                                    <Button className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10" onClick={handleSave}>
                                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Stats/Quick Info */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-t border-gray-100 mt-8">
                                                <div className="text-center md:text-left">
                                                    <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Hourly Rate</span>
                                                    <span className="block text-2xl font-bold text-zinc-900">${profileData.hourly_rate || '0'}<span className="text-sm text-zinc-400 font-normal">/hr</span></span>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Experience</span>
                                                    <span className="block text-2xl font-bold text-zinc-900">{profileData.years_of_experience || '0'}<span className="text-sm text-zinc-400 font-normal"> years</span></span>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Earnings</span>
                                                    <span className="block text-2xl font-bold text-zinc-900">$0<span className="text-sm text-zinc-400 font-normal"> earned</span></span>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Job Success</span>
                                                    <span className="block text-2xl font-bold text-zinc-900">100%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Form Content */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Left Column: Essential Info */}
                                        <div className="lg:col-span-2 space-y-8">
                                            {/* Professional Details */}
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                                <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                                    <User className="w-5 h-5 text-blue-600" /> Professional Details
                                                </h3>
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-700 font-medium">Professional Title</Label>
                                                        <div className="relative">
                                                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                            <Input
                                                                name="title"
                                                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                                value={profileData.title || ''}
                                                                onChange={handleInputChange}
                                                                placeholder="e.g. Senior Full Stack Developer"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-700 font-medium">Professional Summary</Label>
                                                        <div className="relative">
                                                            <Textarea
                                                                name="bio"
                                                                className="min-h-[150px] bg-gray-50 border-gray-200 focus:bg-white transition-colors leading-relaxed"
                                                                value={profileData.bio || ''}
                                                                onChange={handleInputChange}
                                                                placeholder="Highlight your top skills, experience, and what makes you unique..."
                                                            />
                                                        </div>
                                                        <p className="text-xs text-zinc-400 text-right">0/500 characters</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Work Experience Section (Static Mock for improved look) */}
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                                        <Briefcase className="w-5 h-5 text-purple-600" /> Work Experience
                                                    </h3>
                                                    <Button variant="outline" size="sm" className="text-zinc-600 border-dashed border-gray-300 hover:border-blue-300 hover:text-blue-600">
                                                        <Plus className="w-4 h-4 mr-2" /> Add Position
                                                    </Button>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 group hover:border-blue-200 transition-colors">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-bold text-zinc-900">Senior Frontend Engineer</h4>
                                                                <p className="text-zinc-500 text-sm">TechCorp • 2021 - Present</p>
                                                            </div>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500">
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-zinc-600 text-sm mt-3 leading-relaxed">Led the migration to Next.js 14, improving site performance by 40%. Implemented a new design system using Tailwind CSS and Radix UI.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Portfolio Projects */}
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                                        <Globe className="w-5 h-5 text-indigo-600" /> Portfolio Projects
                                                    </h3>
                                                    <Button variant="outline" size="sm" className="text-zinc-600 border-dashed border-gray-300 hover:border-blue-300 hover:text-blue-600">
                                                        <Plus className="w-4 h-4 mr-2" /> Add Project
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="group relative aspect-video bg-zinc-100 rounded-xl overflow-hidden border border-gray-200 cursor-pointer">
                                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                                                            <div className="text-center">
                                                                <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                                                                    <Globe className="w-6 h-6 text-zinc-300" />
                                                                </div>
                                                                <span className="text-sm font-medium">E-commerce Platform</span>
                                                            </div>
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <Button size="sm" variant="secondary">Edit</Button>
                                                            <Button size="sm" variant="destructive">Delete</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Skills & Rates */}
                                        <div className="space-y-8">
                                            {/* Rate & Availability */}
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                                <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                                    <CreditCard className="w-5 h-5 text-green-600" /> Rates & Availability
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-700 font-medium">Hourly Rate ($)</Label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                            <Input
                                                                name="hourly_rate"
                                                                type="number"
                                                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                                                value={profileData.hourly_rate || ''}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-700 font-medium">Years of Experience</Label>
                                                        <div className="relative">
                                                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                            <Input
                                                                name="years_of_experience"
                                                                type="number"
                                                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                                                value={profileData.years_of_experience || ''}
                                                                onChange={handleInputChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 border-t border-gray-100">
                                                        <Label className="text-zinc-700 font-medium mb-3 block">English Proficiency</Label>
                                                        <div className="relative">
                                                            <Languages className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                            <select className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                                                                <option>Native or Bilingual</option>
                                                                <option>Fluent</option>
                                                                <option>Conversational</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Skills */}
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                                        <Zap className="w-5 h-5 text-yellow-500" /> Skills
                                                    </h3>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                                                        <Plus className="w-4 h-4 text-zinc-400" />
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Supabase', 'PostgreSQL'].map((skill) => (
                                                        <span key={skill} className="px-3 py-1.5 bg-zinc-50 text-zinc-700 rounded-lg text-sm font-medium border border-zinc-200 flex items-center gap-2 group hover:border-zinc-300 transition-colors cursor-default">
                                                            {skill}
                                                            <button className="hidden group-hover:block text-zinc-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Social Presence */}
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                                <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                                    <Globe className="w-5 h-5 text-blue-400" /> Social Presence
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-700 font-medium text-xs uppercase tracking-wider">LinkedIn</Label>
                                                        <div className="relative">
                                                            <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                            <Input
                                                                name="linkedin_url"
                                                                value={profileData.linkedin_url || ''}
                                                                onChange={handleInputChange}
                                                                className="pl-10 bg-gray-50 border-gray-200 text-sm"
                                                                placeholder="linkedin.com/in/username"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-700 font-medium text-xs uppercase tracking-wider">GitHub</Label>
                                                        <div className="relative">
                                                            <Github className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                            <Input
                                                                name="github_url"
                                                                value={profileData.github_url || ''}
                                                                onChange={handleInputChange}
                                                                className="pl-10 bg-gray-50 border-gray-200 text-sm"
                                                                placeholder="github.com/username"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-700 font-medium text-xs uppercase tracking-wider">Twitter / X</Label>
                                                        <div className="relative">
                                                            <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                            <Input
                                                                name="twitter_url"
                                                                value={profileData.twitter_url || ''}
                                                                onChange={handleInputChange}
                                                                className="pl-10 bg-gray-50 border-gray-200 text-sm"
                                                                placeholder="twitter.com/username"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-zinc-700 font-medium text-xs uppercase tracking-wider">Instagram</Label>
                                                        <div className="relative">
                                                            <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                            <Input
                                                                name="instagram_url"
                                                                value={profileData.instagram_url || ''}
                                                                onChange={handleInputChange}
                                                                className="pl-10 bg-gray-50 border-gray-200 text-sm"
                                                                placeholder="instagram.com/username"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                                        <Label className="text-zinc-700 font-medium text-xs uppercase tracking-wider">Website / Portfolio</Label>
                                                        <div className="relative">
                                                            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                            <Input
                                                                name="website_url"
                                                                value={profileData.website_url || ''}
                                                                onChange={handleInputChange}
                                                                className="pl-10 bg-gray-50 border-gray-200 text-sm"
                                                                placeholder="https://yourportfolio.com"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Client View */}
                            {role === 'client' && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                                        <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-3xl font-bold text-zinc-400">
                                            <Building className="w-10 h-10 text-zinc-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-zinc-900">{profileData.company_name || 'Your Company'}</h2>
                                            <p className="text-zinc-500">Client Profile</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-zinc-700">Company Name</Label>
                                            <Input
                                                name="company_name"
                                                className="bg-white border-gray-200 text-zinc-900 focus:ring-blue-500/20"
                                                value={profileData.company_name || ''}
                                                onChange={handleInputChange}
                                                placeholder="Tech Solutions Inc."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-700">Industry</Label>
                                            <Input
                                                name="industry"
                                                className="bg-white border-gray-200 text-zinc-900 focus:ring-blue-500/20"
                                                value={profileData.industry || ''}
                                                onChange={handleInputChange}
                                                placeholder="Software Development"
                                            />
                                        </div>
                                        <div className="col-span-full space-y-2">
                                            <Label className="text-zinc-700">Company Description</Label>
                                            <Textarea
                                                name="description"
                                                className="w-full min-h-[120px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                                                value={profileData.description || ''}
                                                onChange={handleInputChange}
                                                placeholder="Describe your company and what you do..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-700">Website</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    name="website"
                                                    className="pl-10 bg-white border-gray-200 text-zinc-900 focus:ring-blue-500/20"
                                                    value={profileData.website || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="https://example.com"
                                                />
                                            </div>
                                        </div>
                                        {/* 
                                        <div className="space-y-2">
                                            <Label className="text-zinc-700">Headquarters</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                                <Input name="location" className="pl-10 bg-white border-gray-200 text-zinc-900 focus:ring-blue-500/20" defaultValue="San Francisco, CA" />
                                            </div>
                                        </div> 
                                        */}
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                                        <Button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="bg-zinc-900 text-white hover:bg-zinc-800 min-w-[120px]"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </motion.div>
                </AnimatePresence>

            </main>
            <Footer />
        </div>
    )
}

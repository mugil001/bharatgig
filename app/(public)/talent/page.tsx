import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Users, Zap, Search, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { startConversation } from '@/app/actions/chat'
import { redirect } from 'next/navigation'

export default async function TalentPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch some freelancers (mock or real)
    // Ideally we join with profiles, but for now let's just use users who are NOT me
    const { data: users } = await supabase
        .from('users')
        .select('*')
        .neq('id', user?.id || '')
        .limit(6)

    // Server Action wrapper for the form
    async function contactFreelancer(formData: FormData) {
        'use server'
        const freelancerId = formData.get('freelancerId') as string
        if (freelancerId) {
            await startConversation(freelancerId)
            redirect('/messages')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 text-zinc-900 font-sans selection:bg-blue-100">
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-zinc-900">
                        Hire the top 1% of<br />global talent.
                    </h1>
                    <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto">
                        BharatGig connects you with vetted professionals ready to execute your vision. Zero friction, maximum output.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="bg-zinc-900 text-white hover:bg-zinc-800" asChild>
                            <Link href="/">Start Hiring</Link>
                        </Button>
                    </div>
                </div>

                {/* Featured Talent Grid - For Testing Messaging */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold mb-8 text-center text-zinc-900">Featured Talent</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {users && users.length > 0 ? (
                            users.map((u: any) => (
                                <div key={u.id} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-lg font-bold text-blue-600">
                                            {u.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">Available</Badge>
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-900 mb-1">{u.email?.split('@')[0]}</h3>
                                    <p className="text-sm text-zinc-500 mb-4">Full Stack Developer</p>

                                    <div className="flex gap-2">
                                        <form action={contactFreelancer} className="w-full">
                                            <input type="hidden" name="freelancerId" value={u.id} />
                                            <Button variant="outline" type="submit" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Message
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-3 text-center text-gray-400">No other users found to message. Creates users via Sign Up to test.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { t: 'Vetted Experts', d: 'Every freelancer passes a rigorous technical assessment.', i: ShieldCheck, c: 'text-blue-600' },
                        { t: 'Rapid Matching', d: 'AI-powered matching gets you proposals in minutes.', i: Zap, c: 'text-purple-600' },
                        { t: 'Global Pool', d: 'Access diverse talent from over 100+ countries.', i: Users, c: 'text-green-600' },
                    ].map((f, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <f.i className={`w-10 h-10 mb-6 ${f.c}`} />
                            <h3 className="text-xl font-bold mb-2 text-zinc-900">{f.t}</h3>
                            <p className="text-zinc-500">{f.d}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}

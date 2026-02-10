import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Trophy, Users, Globe, Zap, Shield, Target } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-100">
            <Navbar />

            <main className="pt-24 pb-20">
                {/* Hero Section */}
                <div className="container mx-auto px-6 mb-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge variant="secondary" className="mb-6 px-4 py-1 text-blue-700 bg-blue-50 border-blue-100">Our Mission</Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-zinc-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-zinc-900">
                            Empowering the future of work with trust and technology.
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-600 leading-relaxed max-w-3xl mx-auto">
                            BharatGig is more than a marketplace; it's a movement to democratize opportunity. We connect world-class Indian talent with global enterprises through a secure, transparent, and merit-based platform.
                        </p>
                    </div>
                </div>

                {/* Achievements Stats */}
                <div className="bg-zinc-50 py-20 border-y border-zinc-100">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="p-6">
                                <div className="text-4xl font-bold text-blue-600 mb-2">50k+</div>
                                <div className="text-zinc-600 font-medium">Vetted Freelancers</div>
                            </div>
                            <div className="p-6">
                                <div className="text-4xl font-bold text-blue-600 mb-2">₹50Cr+</div>
                                <div className="text-zinc-600 font-medium">Paid out to Talent</div>
                            </div>
                            <div className="p-6">
                                <div className="text-4xl font-bold text-blue-600 mb-2">120+</div>
                                <div className="text-zinc-600 font-medium">Countries Served</div>
                            </div>
                            <div className="p-6">
                                <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                                <div className="text-zinc-600 font-medium">Client Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="container mx-auto px-6 py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
                        <p className="text-zinc-500 max-w-2xl mx-auto">Comprehensive solutions for every stage of your business growth.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Talent Marketplace",
                                desc: "Access the top 1% of freelance talent across Engineering, Design, and Marketing. AI-matched to your specific project needs."
                            },
                            {
                                icon: Shield,
                                title: "Secure Escrow Payments",
                                desc: "Your funds are safe with us. We hold payments in escrow and release them only when you are 100% satisfied with the work delivered."
                            },
                            {
                                icon: Target,
                                title: "Enterprise Solutions",
                                desc: "Customized hiring pipelines, dedicated account managers, and compliance handling for large-scale teams and organizations."
                            },
                            {
                                icon: Zap,
                                title: "Rapid Hiring",
                                desc: "Hire in under 48 hours. Our pre-vetted talent pool allows you to skip the noise and start building immediately."
                            },
                            {
                                icon: Globe,
                                title: "Global Payments",
                                desc: "Pay seamlessly in INR, USD, or Crypto. We handle the currency conversion and tax compliance for you."
                            },
                            {
                                icon: CheckCircle2,
                                title: "Quality Guarantee",
                                desc: "If you're not satisfied with the trial period, you don't pay. We stand by the quality of our talent network."
                            }
                        ].map((service, i) => (
                            <div key={i} className="p-8 rounded-2xl border border-zinc-100 hover:border-blue-100 hover:shadow-lg transition-all bg-white group">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <service.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-zinc-900">{service.title}</h3>
                                <p className="text-zinc-600 leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Values / Details */}
                <div className="container mx-auto px-6 pb-20">
                    <div className="bg-zinc-900 rounded-3xl p-12 md:p-24 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 to-transparent"></div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to transform how you work?</h2>
                            <p className="text-xl text-zinc-300 mb-10">
                                Join thousands of forward-thinking companies and talented individuals building the future on BharatGig.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 text-lg px-8 rounded-full">
                                    Start Hiring
                                </Button>
                                <Button size="lg" variant="outline" className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800 hover:text-white text-lg px-8 rounded-full">
                                    Find Work
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    )
}

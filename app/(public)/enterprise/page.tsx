import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Building, Lock, BarChart } from 'lucide-react'

export default function EnterprisePage() {
    return (
        <div className="min-h-screen bg-gray-50 text-zinc-900 font-sans selection:bg-blue-100">
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
                    <div className="flex-1">
                        <div className="inline-block px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                            BharatGig Enterprise
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight mb-6 text-zinc-900">
                            Scale your workforce without limits.
                        </h1>
                        <p className="text-xl text-zinc-500 mb-8">
                            End-to-end talent management solution for Fortune 500s and high-growth startups. Compliance, payroll, and sourcing—handled.
                        </p>
                        <Button size="lg" className="bg-zinc-900 text-white hover:bg-zinc-800">
                            Contact Sales
                        </Button>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <Lock className="w-8 h-8 text-blue-600 mb-4" />
                            <h3 className="font-bold mb-2 text-zinc-900">SOC2 Compliant</h3>
                            <p className="text-sm text-zinc-500">Enterprise-grade security.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm translate-y-8">
                            <BarChart className="w-8 h-8 text-purple-600 mb-4" />
                            <h3 className="font-bold mb-2 text-zinc-900">Custom Reporting</h3>
                            <p className="text-sm text-zinc-500">Real-time team analytics.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

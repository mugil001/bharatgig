'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import {
    DollarSign,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    Download,
    Filter,
    Wallet
} from 'lucide-react'
import { format } from 'date-fns'

export default function PaymentsPage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [balance, setBalance] = useState({ available: 0, pending: 0 })
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setUser(user)

            // Fetch transactions
            const { data: txs, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (txs) setTransactions(txs)

            // Mock balance fetching (would normally come from a 'wallets' table or calculated)
            // For now, let's just use some dummy data or calculate from transactions
            const { data: profile } = await supabase
                .from(user.user_metadata.role === 'client' ? 'client_profiles' : 'freelancer_profiles')
                .select('total_spent, total_earnings') // basic stats
                .eq('user_id', user.id)
                .single()

            // This is a simplification as actual balance logic would be more complex
            setBalance({
                available: user.user_metadata.role === 'freelancer' ? (profile?.total_earnings || 0) : 0,
                pending: 0
            })

            setLoading(false)
        }

        fetchData()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700'
            case 'pending': return 'bg-yellow-100 text-yellow-700'
            case 'failed': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'escrow_deposit':
            case 'payment':
                return <ArrowUpRight className="w-4 h-4 text-red-500" />
            case 'escrow_release':
            case 'withdrawal':
            case 'refund':
                return <ArrowDownLeft className="w-4 h-4 text-green-500" />
            default:
                return <DollarSign className="w-4 h-4 text-blue-500" />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-zinc-900">
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900">Payments & Finance</h1>
                        <p className="text-zinc-500">Manage your earnings, expenses, and transaction history.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" /> Export
                        </Button>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                            <Wallet className="w-4 h-4" />
                            {user?.user_metadata?.role === 'client' ? 'Add Funds' : 'Withdraw Funds'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Available Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-zinc-900">₹{balance.available.toLocaleString()}</div>
                            <p className="text-xs text-zinc-400 mt-1">Available for withdrawal</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Pending Clearance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-zinc-900">₹{balance.pending.toLocaleString()}</div>
                            <p className="text-xs text-zinc-400 mt-1">In escrow or processing</p>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-100 shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100 uppercase tracking-wider">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold">Visa ending in 4242</p>
                                    <p className="text-xs text-blue-200">Expires 12/28</p>
                                </div>
                            </div>
                            <Button variant="secondary" size="sm" className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white border-0">
                                Manage Methods
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>Recent financial activity on your account</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-12 text-zinc-500">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <DollarSign className="w-8 h-8 text-zinc-300" />
                                </div>
                                <p>No transactions found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${tx.type.includes('release') || tx.type === 'withdrawal' ? 'bg-green-50' : 'bg-blue-50'}`}>
                                                {getTypeIcon(tx.type)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-zinc-900 capitalize">{tx.description || tx.type.replace('_', ' ')}</p>
                                                <p className="text-xs text-zinc-500">{format(new Date(tx.created_at), 'PPP')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${tx.type.includes('release') || tx.type === 'withdrawal' ? 'text-green-600' : 'text-zinc-900'}`}>
                                                {tx.type.includes('release') || tx.type === 'withdrawal' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                            </p>
                                            <Badge variant="outline" className={`mt-1 border-0 ${getStatusColor(tx.status)}`}>
                                                {tx.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}

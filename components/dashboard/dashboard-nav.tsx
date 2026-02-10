'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Briefcase,
    Home,
    Search,
    MessageSquare,
    FileText,
    CreditCard,
    User,
    LogOut,
    Bell,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'

export default function DashboardNav({ user }: { user: any }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/jobs', label: 'Browse Jobs', icon: Search },
        { href: '/proposals', label: 'My Proposals', icon: FileText },
        { href: '/messages', label: 'Messages', icon: MessageSquare },
        { href: '/payments', label: 'Payments', icon: CreditCard },
    ]

    return (
        <nav className="backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition"></div>
                            <Briefcase className="relative h-7 w-7 text-white bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:block">
                            BharatGig
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                        </Button>

                        <div className="hidden md:flex items-center space-x-3 border-l pl-3">
                            <Link href="/profile">
                                <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all">
                                    <AvatarImage src={user?.avatar_url} />
                                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                                        {user?.full_name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <div className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                )
                            })}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between px-4">
                                <Link href="/profile" className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage src={user?.avatar_url} />
                                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                            {user?.full_name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-gray-900">{user?.full_name}</span>
                                </Link>
                                <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

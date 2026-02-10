import Link from 'next/link';
import { Briefcase, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-blue-950 border-t border-blue-900 pt-16 pb-8 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="h-6 w-6 text-white" />
                            <span className="font-bold text-lg text-white">BharatGig</span>
                        </div>
                        <p className="text-sm text-blue-100 mb-4">
                            Empowering India's freelance economy. Connect, collaborate, and grow with top talent and businesses.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-blue-100 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-white">For Clients</h3>
                        <ul className="space-y-2 text-sm text-blue-100">
                            <li><Link href="#" className="hover:text-white transition-colors">How to Hire</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Talent Marketplace</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Project Catalog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Enterprise</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-white">For Talent</h3>
                        <ul className="space-y-2 text-sm text-blue-100">
                            <li><Link href="#" className="hover:text-white transition-colors">How to Find Work</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Direct Contracts</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Find Freelance Jobs</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-white">Resources</h3>
                        <ul className="space-y-2 text-sm text-blue-100">
                            <li><Link href="#" className="hover:text-white transition-colors">Help & Support</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Success Stories</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-200">
                    <p>&copy; {new Date().getFullYear()} BharatGig. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

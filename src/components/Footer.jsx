import { FaTiktok } from "react-icons/fa";
import { FiFilm, FiHeart } from "react-icons/fi";

export default function Footer() {
    return(
        <footer className="relative mt-20 border-t border-white/5 bg-slate-950">
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
                    {/* Brand Section */}
                    <div className="md:col-span-2 space-y-6">
                        <a href="/" className="flex items-center space-x-3 group">
                            <FiFilm className="text-3xl text-blue-500" />
                            <span className="text-2xl font-black tracking-tighter text-white">
                                NONTONYUK<span className="text-blue-500">21</span>
                            </span>
                        </a>
                        <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                            Your premier destination for high-quality cinematic experiences. Streaming the latest global hits with unmatched precision and speed.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a 
                                href="https://www.tiktok.com/@tyan.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-full bg-white/5 hover:bg-blue-500 hover:text-white transition-all duration-300 text-slate-400"
                            >
                                <FaTiktok size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Navigation</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-500">
                            <li><a href="/" className="hover:text-blue-500 transition-colors">Home</a></li>
                            <li><a href="/trending" className="hover:text-blue-500 transition-colors">Trending Now</a></li>
                            <li><a href="/latest" className="hover:text-blue-500 transition-colors">Latest Releases</a></li>
                            <li><a href="/popular" className="hover:text-blue-500 transition-colors">Popular Movies</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Support</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-500">
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                        © {new Date().getFullYear()} NontonYuk21. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-600">
                        <span>Made with</span>
                        <FiHeart className="text-red-500 fill-current" size={12} />
                        <span>by Tyan Dev</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
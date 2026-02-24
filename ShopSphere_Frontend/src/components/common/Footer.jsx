import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from "react-icons/fa";


const Footer = () => {
    const location = useLocation();
    const hideOnPaths = ['/delivery', '/vendor', '/vendordashboard', '/welcome', '/login', '/signup', '/account-verification', '/verify-otp'];

    if (hideOnPaths.some(path => location.pathname.startsWith(path))) {
        return null;
    }

    return (
        <footer className="relative overflow-hidden bg-gradient-to-br from-[#1e0533] via-[#2d1050] to-[#140025] text-white py-16">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/5 rounded-full blur-[150px]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">ShopSphere</h3>
                        <p className="text-purple-300/70 text-sm leading-relaxed">Your one-stop shop for everything you need. Quality products, best prices.</p>
                        <div className="flex space-x-3 mt-6">
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-orange-400 hover:text-white hover:border-orange-400 transition-all duration-300">
                                <FaFacebook size={16} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-orange-400 hover:text-white hover:border-orange-400 transition-all duration-300">
                                <FaTwitter size={16} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-orange-400 hover:text-white hover:border-orange-400 transition-all duration-300">
                                <FaInstagram size={16} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-orange-400 hover:text-white hover:border-orange-400 transition-all duration-300">
                                <FaLinkedin size={16} />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><a href="/" className="text-purple-300/70 text-sm hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500/50"></span>Home</a></li>
                            <li><a href="/shop" className="text-purple-300/70 text-sm hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500/50"></span>Shop</a></li>
                            <li><a href="/about" className="text-purple-300/70 text-sm hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500/50"></span>About Us</a></li>
                            <li><a href="/contact" className="text-purple-300/70 text-sm hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500/50"></span>Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 mb-6">Customer Service</h4>
                        <ul className="space-y-3">
                            <li><a href="/profile" className="text-purple-300/70 text-sm hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500/50"></span>My Account</a></li>
                            <li><a href="/orders" className="text-purple-300/70 text-sm hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500/50"></span>Order History</a></li>
                            <li><a href="/faq" className="text-purple-300/70 text-sm hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500/50"></span>FAQ</a></li>
                            <li><a href="/returns" className="text-purple-300/70 text-sm hover:text-orange-400 transition-colors duration-300 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500/50"></span>Returns</a></li>
                        </ul>
                    </div>
                    {location.pathname !== "/home" && (
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 mb-6">Newsletter</h4>
                            <p className="text-purple-300/70 text-sm mb-4">Subscribe to get the latest deals and offers.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-purple-400/50 focus:outline-none focus:border-orange-400/50 focus:ring-1 focus:ring-orange-400/20 transition-all"
                                />
                                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-purple-500 text-white text-sm font-bold hover:from-orange-600 hover:to-purple-700 transition-all shadow-lg shadow-orange-400/20">
                                    Go
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-purple-400/60 text-sm">&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
                    <p className="text-purple-400/60 text-sm flex items-center gap-1.5">
                        Made with <FaHeart className="text-orange-400 text-xs" /> by ShopSphere Team
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

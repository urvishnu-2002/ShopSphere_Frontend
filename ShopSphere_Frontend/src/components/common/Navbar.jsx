import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-sm' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
                        <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xl font-black tracking-tighter ${isScrolled ? 'text-slate-900' : 'text-slate-800'}`}>
                        Shop<span className="text-indigo-600">Sphere</span>
                    </span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {['New Arrivals', 'Categories', 'Deals', 'Account'].map((item) => (
                        <a key={item} href="#" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                            {item}
                        </a>
                    ))}
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-all relative">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 text-[10px] text-white flex items-center justify-center font-bold rounded-full border-2 border-white">
                            0
                        </span>
                    </button>
                    <button className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all shadow-md active:scale-95 ml-4">
                        <User className="w-4 h-4" />
                        Sign In
                    </button>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 md:hidden flex flex-col gap-4"
                    >
                        {['New Arrivals', 'Categories', 'Deals', 'Account'].map((item) => (
                            <a key={item} href="#" className="text-lg font-bold text-slate-800 hover:text-indigo-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all">
                                {item}
                            </a>
                        ))}
                        <hr className="border-slate-100 my-2" />
                        <button className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100">
                            <User className="w-5 h-5" />
                            Sign In Account
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

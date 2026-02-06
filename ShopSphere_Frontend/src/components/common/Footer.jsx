import React from 'react';
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 pt-20 pb-10 mt-20">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black text-white tracking-tighter">
                                Shop<span className="text-indigo-400">Sphere</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Designing the future of digital commerce. Join thousands of shoppers discovering premium lifestyle products every day.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-500 hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            {['New Season', 'Most Wanted', 'Our Collections', 'Gift Cards', 'Sustainability'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-400 hover:text-indigo-400 text-sm font-bold transition-all hover:translate-x-1 inline-block">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Support hub</h4>
                        <ul className="space-y-4">
                            {['Track Order', 'Return Policy', 'Shipping Info', 'Size Guide', 'Member FAQ'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-400 hover:text-indigo-400 text-sm font-bold transition-all hover:translate-x-1 inline-block">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Direct Contact</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 cursor-default">
                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tighter">Location</p>
                                    <p className="text-slate-400 text-sm font-medium mt-1 leading-snug">789 Studio Blvd, <br />Innovation City, DXB</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group cursor-pointer">
                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all flex-shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tighter">Email Support</p>
                                    <p className="text-slate-400 text-sm font-medium mt-1">hello@shopsphere.io</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        © 2024 SHOP SPHERE. CRAFTED FOR EXCELLENCE.
                    </p>
                    <div className="flex items-center gap-8">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((link) => (
                            <a key={link} href="#" className="text-slate-500 hover:text-slate-300 text-[10px] font-black uppercase tracking-tighter transition-colors">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

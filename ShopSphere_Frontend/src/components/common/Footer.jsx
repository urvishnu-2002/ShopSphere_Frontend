import React from "react";
import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaGithub,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaPaperPlane,
} from "react-icons/fa";

// ============================================
// FOOTER COMPONENT
// Premium, comprehensive, and modern footer
// ============================================
function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        shop: [
            { name: "Fresh Fruits", path: "/category/fruits" },
            { name: "Vegetables", path: "/category/vegetables" },
            { name: "Dairy & Eggs", path: "/category/dairy" },
            { name: "Snacks", path: "/category/snacks" },
            { name: "Offers", path: "/offers" },
        ],
        support: [
            { name: "Help Center", path: "/help" },
            { name: "Track Order", path: "/orders" },
            { name: "Shipping Policy", path: "/shipping" },
            { name: "Returns & Refunds", path: "/returns" },
            { name: "FAQs", path: "/faqs" },
        ],
        company: [
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/contact" },
            { name: "Careers", path: "/careers" },
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Terms of Service", path: "/terms" },
        ],
    };

    const socialLinks = [
        { icon: <FaFacebookF />, url: "#", color: "hover:bg-blue-600" },
        { icon: <FaTwitter />, url: "#", color: "hover:bg-sky-500" },
        { icon: <FaInstagram />, url: "#", color: "hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500" },
        { icon: <FaLinkedinIn />, url: "#", color: "hover:bg-blue-700" },
        { icon: <FaGithub />, url: "#", color: "hover:bg-gray-800" },
    ];

    return (
        <footer className="bg-[#0f172a] text-gray-300 pt-20 pb-10 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">

                    {/* Brand Section */}
                    <div className="lg:col-span-4 lg:pr-8">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                                S
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                ShopSphere
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                            ShopSphere is your premium destination for the freshest groceries and daily essentials.
                            We deliver quality, freshness, and happiness right to your doorstep with every order.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 text-sm group">
                                <div className="p-2.5 bg-gray-800/50 rounded-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                    <FaMapMarkerAlt />
                                </div>
                                <div className="pt-1">
                                    <p className="font-semibold text-white">Our Address</p>
                                    <p className="text-gray-400">123 Market Street, Suite 456, New York, NY 10001</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 text-sm group cursor-pointer">
                                <div className="p-2.5 bg-gray-800/50 rounded-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                    <FaPhoneAlt />
                                </div>
                                <div className="pt-1">
                                    <p className="font-semibold text-white">Call Us</p>
                                    <p className="text-gray-400 hover:text-emerald-400 transition-colors">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Link Groups */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                                Shop
                                <span className="absolute -bottom-1 left-0 w-8 h-1 bg-emerald-500 rounded-full" />
                            </h3>
                            <ul className="space-y-4">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-300 flex items-center text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                                Support
                                <span className="absolute -bottom-1 left-0 w-8 h-1 bg-emerald-500 rounded-full" />
                            </h3>
                            <ul className="space-y-4">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-300 flex items-center text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="lg:col-span-4">
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Follow Our Journey
                            <span className="absolute -bottom-1 left-0 w-8 h-1 bg-emerald-500 rounded-full" />
                        </h3>
                        <p className="text-gray-400 text-sm mb-8 max-w-sm">
                            Join our community and stay connected with the latest updates, healthy living tips, and exclusive behind-the-scenes content on our social platforms.
                        </p>

                        {/* Social Links */}
                        <div>
                            <p className="text-white font-semibold text-sm mb-4">Follow Us</p>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        className={`w-10 h-10 flex items-center justify-center bg-gray-800/50 rounded-xl text-gray-400 transition-all duration-500 ${social.color} hover:text-white hover:-translate-y-1 hover:shadow-xl`}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm order-2 md:order-1">
                        &copy; {currentYear} <span className="text-emerald-500 font-semibold px-1">ShopSphere</span> by Balaji. All rights reserved.
                    </p>

                    {/* Legal Links */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm order-1 md:order-2">
                        <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">Terms of Use</Link>
                        <Link to="/sitemap" className="text-gray-500 hover:text-white transition-colors">Sitemap</Link>
                    </div>

                    {/* Payment Placeholder */}
                    <div className="flex gap-4 items-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 order-3">
                        <div className="w-10 h-6 bg-gray-700 rounded" />
                        <div className="w-10 h-6 bg-gray-700 rounded" />
                        <div className="w-10 h-6 bg-gray-700 rounded" />
                        <div className="w-10 h-6 bg-gray-700 rounded" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

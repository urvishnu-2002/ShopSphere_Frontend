import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaHeart } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                S
                            </div>
                            <span className="text-2xl font-bold text-white">ShopSphere</span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Your one-stop destination for premium quality products. We believe in providing the best shopping experience with carefully curated items.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet-600 params-transition text-white transition-all duration-300 transform hover:-translate-y-1">
                                <FaFacebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 text-white transition-all duration-300 transform hover:-translate-y-1">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 text-white transition-all duration-300 transform hover:-translate-y-1">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 text-white transition-all duration-300 transform hover:-translate-y-1">
                                <FaLinkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="hover:text-violet-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 opacity-0 hover:opacity-100 transition-opacity"></span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-green-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 hover:opacity-100 transition-opacity"></span>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-green-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 hover:opacity-100 transition-opacity"></span>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="hover:text-green-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 hover:opacity-100 transition-opacity"></span>
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Customer Service</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/cart" className="hover:text-violet-500 transition-colors duration-300">Ordering & Payment</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-green-500 transition-colors duration-300">Shipping Policy</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-green-500 transition-colors duration-300">Returns & Refunds</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-green-500 transition-colors duration-300">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Contact Info</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <span className="text-violet-500 mt-1">📍</span>
                                <span>123 Shopping Avenue, Market City, ST 12345</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-violet-500">📞</span>
                                <span>+1 (234) 567-8900</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-violet-500">✉️</span>
                                <span>support@shopsphere.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {currentYear} ShopSphere. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Made with</span>
                        <FaHeart className="text-purple-500 animate-pulse" />
                        <span>by ShopSphere Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

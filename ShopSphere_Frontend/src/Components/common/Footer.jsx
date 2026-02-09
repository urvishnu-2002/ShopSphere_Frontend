import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from "react-icons/fa";


const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">ShopSphere</h3>
                        <p className="text-gray-400">Your one-stop shop for everything you need. Quality products, best prices.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/" className="hover:text-white">Home</a></li>
                            <li><a href="/shop" className="hover:text-white">Shop</a></li>
                            <li><a href="/about" className="hover:text-white">About Us</a></li>
                            <li><a href="/contact" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">Customer Service</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/profile" className="hover:text-white">My Account</a></li>
                            <li><a href="/orders" className="hover:text-white">Order History</a></li>
                            <li><a href="/faq" className="hover:text-white">FAQ</a></li>
                            <li><a href="/returns" className="hover:text-white">Returns</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
                        <div className="flex space-x-4">
                            {/* Add social icons here if needed */}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

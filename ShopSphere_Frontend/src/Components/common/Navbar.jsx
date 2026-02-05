import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    FaShoppingCart,
    FaHeart,
    FaUser,
    FaBars,
    FaTimes,
    FaSearch,
    FaSignOutAlt,
} from "react-icons/fa";

// ============================================
// NAVBAR COMPONENT
// ============================================
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    // ============================================
    // REDUX STATE - Cart & Wishlist
    // ============================================
    const cart = useSelector((state) => state.cart);
    const wishlist = useSelector((state) => state.wishlist);

    // Calculate counts using reduce for cart (sum of quantities) and length for wishlist
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const wishlistCount = wishlist.length;

    // Check login status
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // Navigation links configuration
    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Orders", path: "/orders" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    // Helper to check if link is active
    const isActive = (path) => location.pathname === path;

    // ============================================
    // HANDLERS
    // ============================================
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate("/");
        }
        setIsOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        navigate("/login");
        setIsOpen(false);
    };

    const closeMobileMenu = () => {
        setIsOpen(false);
    };

    // ============================================
    // RENDER
    // ============================================
    return (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-300"
                >
                    ShopSphere
                </Link>

                {/* Search Bar (Desktop) */}
                <form onSubmit={handleSearch} className="hidden md:flex relative w-80 group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white transition-all duration-300 hover:bg-white hover:shadow-sm"
                    />
                </form>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative text-sm font-medium transition-colors duration-300 hover:text-blue-600 group ${isActive(link.path) ? "text-blue-600" : "text-gray-600"
                                }`}
                        >
                            {link.name}
                            {/* Animated underline */}
                            <span
                                className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                                    }`}
                            ></span>
                        </Link>
                    ))}
                </div>

                {/* Icons & Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Wishlist Icon */}
                    <Link
                        to="/wishlist"
                        className="relative p-2.5 rounded-full hover:bg-red-50 transition-all duration-300 group"
                    >
                        <FaHeart className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${wishlistCount > 0 ? "text-red-500" : "text-gray-500 group-hover:text-red-500"
                            }`} />
                        {/* Wishlist Badge */}
                        <span
                            className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 ${wishlistCount > 0
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-0"
                                }`}
                        >
                            {wishlistCount > 99 ? "99+" : wishlistCount}
                        </span>
                    </Link>

                    {/* Cart Icon */}
                    <Link
                        to="/cart"
                        className="relative p-2.5 rounded-full hover:bg-blue-50 transition-all duration-300 group"
                    >
                        <FaShoppingCart className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${cartCount > 0 ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"
                            }`} />
                        {/* Cart Badge */}
                        <span
                            className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 ${cartCount > 0
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-0"
                                }`}
                        >
                            {cartCount > 99 ? "99+" : cartCount}
                        </span>
                    </Link>

                    {/* Auth Buttons */}
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all duration-300"
                            >
                                <FaUser className="w-3.5 h-3.5" />
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                                title="Logout"
                            >
                                <FaSignOutAlt className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-md hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                        >
                            <FaUser className="w-3.5 h-3.5" />
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden absolute top-20 left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-out origin-top ${isOpen
                        ? "opacity-100 scale-y-100 translate-y-0"
                        : "opacity-0 scale-y-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="px-4 py-6 space-y-4">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                    </form>

                    {/* Mobile Navigation Links */}
                    <div className="space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={closeMobileMenu}
                                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive(link.path)
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Wishlist & Cart */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <Link
                            to="/wishlist"
                            onClick={closeMobileMenu}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <FaHeart className="w-4 h-4" />
                            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                        </Link>
                        <Link
                            to="/cart"
                            onClick={closeMobileMenu}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 font-medium rounded-xl hover:bg-blue-100 transition-colors"
                        >
                            <FaShoppingCart className="w-4 h-4" />
                            Cart {cartCount > 0 && `(${cartCount})`}
                        </Link>
                    </div>

                    {/* Mobile Auth */}
                    {isLoggedIn ? (
                        <div className="space-y-2 pt-2">
                            <Link
                                to="/profile"
                                onClick={closeMobileMenu}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-white bg-blue-600 rounded-xl font-medium"
                            >
                                <FaUser className="w-4 h-4" />
                                My Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium hover:bg-red-100 transition-colors"
                            >
                                <FaSignOutAlt className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            onClick={closeMobileMenu}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 mt-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium shadow-lg"
                        >
                            <FaUser className="w-4 h-4" />
                            Login / Register
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

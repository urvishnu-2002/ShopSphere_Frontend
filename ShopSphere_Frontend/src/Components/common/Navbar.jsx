import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import {
    FaShoppingCart,
    FaHeart,
    FaUser,
    FaBars,
    FaTimes,
    FaSearch,
    FaChevronDown,
    FaSignOutAlt,
    FaBox,
} from "react-icons/fa";

// ============================================
// NAVBAR COMPONENT
// Premium, smooth, modern navigation bar
// ============================================
function Navbar() {
    // ============================================
    // STATE & HOOKS
    // ============================================
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Redux state
    const cartItems = useSelector((state) => state.cart);
    const wishlistItems = useSelector((state) => state.wishlist);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const wishlistCount = wishlistItems.length;

    // ============================================
    // NAVIGATION LINKS
    // ============================================
    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Orders", path: "/orders" },
        { name: "AboutUs", path: "/about" },
        { name: "ContactUs", path: "/contact" },
    ];

    // ============================================
    // EFFECTS
    // ============================================

    // Scroll effect for navbar shadow
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setProfileDropdownOpen(false);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ============================================
    // HANDLERS
    // ============================================
    const handleSearch = (e) => {
        e.preventDefault();
        // Form submit carries no additional logic - real-time search handles filtering
    };

    // Real-time search - update URL as user types
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Navigate to home page and update URL parameter
        if (value.trim()) {
            navigate(`/?search=${encodeURIComponent(value.trim())}`, { replace: true });
        } else {
            // If query is empty, show all products
            navigate('/', { replace: true });
        }
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery("");
        navigate('/', { replace: true });
    };

    const handleLogout = () => {
        logout();
        setProfileDropdownOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    // ============================================
    // RENDER
    // ============================================
    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-500 ease-out ${scrolled
                    ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-900/5"
                    : "bg-white/80 backdrop-blur-md"
                }`}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                    {/* ============================================
                        LOGO
                        ============================================ */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 group flex-shrink-0"
                        aria-label="ShopSphere Home"
                    >
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300 ease-out">
                                S
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300 hidden sm:block">
                            ShopSphere
                        </span>
                    </Link>

                    {/* ============================================
                        DESKTOP SEARCH BAR
                        ============================================ */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex items-center w-72"
                    >
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className={`w-full pl-11 pr-10 py-2.5 bg-gray-50 border-2 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition-all duration-300 ease-out outline-none ${searchFocused
                                        ? "border-emerald-500 bg-white shadow-lg shadow-emerald-500/10 ring-4 ring-emerald-500/10"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                                    }`}
                                aria-label="Search products"
                            />
                            <FaSearch
                                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${searchFocused ? "text-emerald-500" : "text-gray-400"
                                    }`}
                                size={14}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    aria-label="Clear search"
                                >
                                    <FaTimes size={12} />
                                </button>
                            )}
                        </div>
                    </form>

                    {/* ============================================
                        DESKTOP NAVIGATION
                        ============================================ */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-out group ${isActive(link.path)
                                        ? "text-emerald-600"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {link.name}
                                <span
                                    className={`absolute bottom-0.5 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300 ease-out ${isActive(link.path)
                                            ? "opacity-100 scale-x-100"
                                            : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                                        }`}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* ============================================
                        RIGHT SIDE ACTIONS
                        ============================================ */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Wishlist */}
                        <Link
                            to="/wishlist"
                            className={`relative p-2.5 rounded-xl transition-all duration-300 ease-out group ${isActive("/wishlist")
                                    ? "bg-red-50 text-red-500"
                                    : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                                }`}
                            aria-label={`Wishlist with ${wishlistCount} items`}
                        >
                            <FaHeart
                                size={18}
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-in zoom-in duration-200">
                                    {wishlistCount > 99 ? "99+" : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className={`relative p-2.5 rounded-xl transition-all duration-300 ease-out group ${isActive("/cart")
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                                }`}
                            aria-label={`Shopping cart with ${cartCount} items`}
                        >
                            <FaShoppingCart
                                size={18}
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-in zoom-in duration-200">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile / Login */}
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ease-out ${profileDropdownOpen
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                    aria-expanded={profileDropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                                        {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                                        {user.firstName || "User"}
                                    </span>
                                    <FaChevronDown
                                        size={10}
                                        className={`transition-transform duration-300 ${profileDropdownOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-gray-900/10 border border-gray-100 overflow-hidden transition-all duration-300 ease-out origin-top-right ${profileDropdownOpen
                                            ? "opacity-100 scale-100 translate-y-0"
                                            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                        }`}
                                >
                                    <div className="p-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.email || "user@example.com"}
                                        </p>
                                    </div>
                                    <div className="p-1">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                        >
                                            <FaUser size={14} className="text-gray-400" />
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                        >
                                            <FaBox size={14} className="text-gray-400" />
                                            My Orders
                                        </Link>
                                    </div>
                                    <div className="p-1 border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                        >
                                            <FaSignOutAlt size={14} />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ease-out"
                            >
                                <FaUser size={12} />
                                <span>Login</span>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
                            aria-label="Toggle menu"
                            aria-expanded={isOpen}
                        >
                            <div className="relative w-5 h-5 flex items-center justify-center">
                                {isOpen ? (
                                    <FaTimes size={20} className="animate-in spin-in-90 duration-300" />
                                ) : (
                                    <FaBars size={20} className="animate-in fade-in duration-300" />
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* ============================================
                MOBILE MENU
                ============================================ */}
            <div
                className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-all duration-500 ease-out overflow-hidden ${isOpen ? "max-h-[calc(100vh-80px)] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="p-4 space-y-2">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-11 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 outline-none"
                            />
                            <FaSearch
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                size={14}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    aria-label="Clear search"
                                >
                                    <FaTimes size={12} />
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Mobile Nav Links */}
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${isActive(link.path)
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-px bg-gray-100 my-3" />

                    {/* Mobile Quick Links */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <Link
                            to="/wishlist"
                            className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl text-gray-700 hover:bg-emerald-50 transition-all duration-300"
                        >
                            <span className="flex items-center gap-2">
                                <FaHeart className="text-red-400" /> Wishlist
                            </span>
                            {wishlistCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/cart"
                            className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl text-gray-700 hover:bg-emerald-50 transition-all duration-300"
                        >
                            <span className="flex items-center gap-2">
                                <FaShoppingCart className="text-emerald-500" /> Cart
                            </span>
                            {cartCount > 0 && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    <div className="h-px bg-gray-100 my-3" />

                    {/* Mobile Auth */}
                    {user ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                    {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-gray-900 truncate">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{user.email || "user@example.com"}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-1">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300"
                                >
                                    <FaUser className="text-gray-400" size={14} /> My Profile
                                </Link>
                                <Link
                                    to="/orders"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300"
                                >
                                    <FaBox className="text-gray-400" size={14} /> My Orders
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
                                >
                                    <FaSignOutAlt size={14} /> Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 w-full px-4 py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-all duration-300"
                        >
                            <FaUser size={14} />
                            Login / Register
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

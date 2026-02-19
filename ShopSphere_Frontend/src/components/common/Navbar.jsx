import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
    FaHome,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { clearCart } from "../../Store";

// ============================================
// NAVBAR COMPONENT
// Premium, smooth, modern navigation bar
// ============================================
function Navbar() {
    // ============================================
    // STATE & HOOKS
    // ============================================
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Redux state
    const cartItems = useSelector((state) => state.cart);
    const wishlistItems = useSelector((state) => state.wishlist);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const wishlistCount = wishlistItems.length;

    // Auth State
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for user in localStorage on mount
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user data", error);
                localStorage.removeItem("user");
            }
        }
    }, [location.pathname]); // Re-check on route change (e.g. after login/redirect)

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(clearCart());
        setUser(null);
        setProfileDropdownOpen(false);
        toast.success("Logged out successfully");
        navigate('/login');
    };

    // ============================================
    // NAVIGATION LINKS
    // ============================================
    const navLinks = [
        // { name: "Home", path: "/" },
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
            navigate(`/home?search=${encodeURIComponent(value.trim())}`, { replace: true });
        } else {
            // If query is empty, show all products
            navigate('/home', { replace: true });
        }
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery("");
        navigate('/home', { replace: true });
    };



    const isActive = (path) => location.pathname === path;

    // ============================================
    // RENDER
    // ============================================
    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-500 ease-out"
            role="navigation"
            aria-label="Main navigation"
        >
            {/* Background Layers - Using separate divs to prevent flickering/blinking */}
            <div
                className={`absolute inset-0 transition-opacity duration-500 ease-out bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#5b21b6] ${scrolled ? "opacity-0" : "opacity-100"
                    }`}
            />
            <div
                className={`absolute inset-0 transition-opacity duration-500 ease-out bg-[#1e1b4b]/95 backdrop-blur-xl shadow-lg shadow-violet-900/20 ${scrolled ? "opacity-100" : "opacity-0"
                    }`}
            />
            <div className="absolute inset-0 border-b border-white/5 pointer-events-none" />

            <div className="relative w-full px-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between gap-4">
                    {/* ============================================
                        LOGO
                        ============================================ */}
                    <Link
                        to="/home"
                        className="flex items-center gap-3 group flex-shrink-0"
                        aria-label="ShopSphere Home"
                    >
                        <img src="/s_logo.png" alt="ShopSphere Logo" className="w-15 h-15 object-contain transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-xl sm:text-2xl font-bold text-white tracking-wide group-hover:text-violet-200 transition-colors duration-300 hidden sm:block drop-shadow-md">
                            ShopSphere
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center flex-grow justify-end ml-8 gap-4">
                        <div className="flex items-center gap-4 w-full max-w-4xl">
                            <Link
                                to="/home"
                                className={`p-2.5 rounded-xl transition-all duration-300 ease-out group hover:bg-white/10 ${isActive("/home")
                                    ? "bg-white/10 text-violet-400"
                                    : "text-violet-200 hover:text-white"
                                    }`}
                                aria-label="Home"
                            >
                                <FaHome
                                    size={22}
                                    className={`transition-transform duration-300 group-hover:scale-110 drop-shadow-lg ${isActive("/home") ? "drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" : ""}`}
                                />
                            </Link>

                            <form
                                onSubmit={handleSearch}
                                className="flex-grow items-center"
                            >
                                <div className="relative w-full group">
                                    <div className={`absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300 ${searchFocused ? 'opacity-60' : ''}`} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        className={`relative w-full pl-11 pr-10 py-2.5 rounded-xl text-sm transition-all duration-300 ease-out outline-none ${searchFocused
                                            ? "bg-white/10 border-violet-400 text-white placeholder-violet-200 ring-2 ring-violet-500/30"
                                            : "bg-white/5 border-white/10 text-violet-100 placeholder-violet-300/60 hover:bg-white/10 hover:border-violet-500/30"
                                            } border backdrop-blur-sm`}
                                        aria-label="Search products"
                                    />
                                    <FaSearch
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${searchFocused ? "text-violet-300" : "text-violet-400/70"
                                            } z-10`}
                                        size={14}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-violet-300 hover:text-white transition-colors duration-200 z-10"
                                            aria-label="Clear search"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* ============================================
                        DESKTOP NAVIGATION
                        ============================================ */}
                    <div className="hidden lg:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-out group overflow-hidden ${isActive(link.path)
                                    ? "text-white"
                                    : "text-violet-200 hover:text-white"
                                    }`}
                            >
                                <span className={`absolute inset-0 bg-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg ${isActive(link.path) ? 'scale-x-100 bg-white/10' : ''}`} />
                                <span className="relative z-10">{link.name}</span>
                                <span
                                    className={`absolute bottom-1.5 left-4 right-4 h-0.5 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full transition-all duration-300 ease-out ${isActive(link.path)
                                        ? "opacity-100 scale-x-100 shadow-[0_0_8px_rgba(167,139,250,0.8)]"
                                        : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                                        }`}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* ============================================
                        RIGHT SIDE ACTIONS
                        ============================================ */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Wishlist */}
                        <Link
                            to="/wishlist"
                            className={`relative p-2.5 rounded-xl transition-all duration-300 ease-out group hover:bg-white/10 ${isActive("/wishlist")
                                ? "bg-white/10 text-rose-400"
                                : "text-violet-200 hover:text-rose-400"
                                }`}
                            aria-label={`Wishlist with ${wishlistCount} items`}
                        >
                            <FaHeart
                                size={18}
                                className={`transition-transform duration-300 group-hover:scale-110 drop-shadow-lg ${isActive("/wishlist") ? "drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]" : ""}`}
                            />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 animate-in zoom-in duration-200 ring-2 ring-[#2e1065]">
                                    {wishlistCount > 99 ? "99+" : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className={`relative p-2.5 rounded-xl transition-all duration-300 ease-out group hover:bg-white/10 ${isActive("/cart")
                                ? "bg-white/10 text-cyan-400"
                                : "text-violet-200 hover:text-cyan-400"
                                }`}
                            aria-label={`Shopping cart with ${cartCount} items`}
                        >
                            <FaShoppingCart
                                size={18}
                                className={`transition-transform duration-300 group-hover:scale-110 drop-shadow-lg ${isActive("/cart") ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""}`}
                            />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-in zoom-in duration-200 ring-2 ring-[#2e1065]">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile / Login */}
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className={`flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300 border border-transparent ${profileDropdownOpen
                                        ? "bg-white/10 border-white/10 text-white"
                                        : "hover:bg-white/5 text-violet-100 hover:text-white"
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/30 border border-white/20">
                                        <FaUser size={12} />
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start leading-tight">
                                        <span className="text-[10px] text-violet-300 font-medium uppercase tracking-wider">Hello</span>
                                        <span className="text-xs font-bold text-white max-w-[100px] truncate drop-shadow-sm">
                                            {user.username}
                                        </span>
                                    </div>
                                    <FaChevronDown
                                        size={10}
                                        className={`ml-1 transition-transform duration-300 text-violet-300 ${profileDropdownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-60 bg-[#1e1b4b]/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/50 border border-white/10 py-2 animate-in slide-in-from-top-2 duration-200 overflow-hidden transform origin-top-right ring-1 ring-white/5">
                                        <div className="px-5 py-4 border-b border-white/10 mb-1 bg-white/5">
                                            <p className="text-sm font-bold text-white truncate">{user.username}</p>
                                            <p className="text-xs text-violet-300 truncate">{user.email}</p>
                                        </div>

                                        <div className="px-2 py-2">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-violet-100 hover:bg-violet-600/50 hover:text-white rounded-xl transition-all"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            >
                                                <FaUser size={14} className="text-violet-300" />
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-violet-100 hover:bg-violet-600/50 hover:text-white rounded-xl transition-all"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            >
                                                <FaBox size={14} className="text-violet-300" />
                                                My Orders
                                            </Link>
                                        </div>

                                        <div className="border-t border-white/10 mt-1 p-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors text-left font-medium"
                                            >
                                                <FaSignOutAlt size={14} />
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className={`relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ease-out ${isActive("/login")
                                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/40"
                                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                    }`}
                                aria-label="Login"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2.5 text-violet-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
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

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-[72px] left-0 right-0 bg-[#1e1b4b]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl animate-in slide-in-from-top-2 duration-300 p-4">
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/home"
                                onClick={() => setIsOpen(false)}
                                className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${isActive("/home")
                                    ? "bg-violet-600/30 text-white border border-violet-500/50"
                                    : "text-violet-200 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <FaHome size={18} />
                                Home
                            </Link>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-4 py-3 rounded-xl font-medium transition-all ${isActive(link.path)
                                        ? "bg-violet-600/30 text-white border border-violet-500/50"
                                        : "text-violet-200 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-white/10 my-2" />
                            {!user && (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-3 rounded-xl font-bold text-center bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
                                >
                                    Login / Sign Up
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;

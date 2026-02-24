import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, clearWishlist, clearOrders, syncCart, syncWishlist } from "../../Store";
import { logout as apiLogout } from "../../api/axios";
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
    FaMicrophone,
} from "react-icons/fa";
import toast from "react-hot-toast";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart);
    const wishlistItems = useSelector((state) => state.wishlist);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const wishlistCount = wishlistItems.length;

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user data", error);
                localStorage.removeItem("user");
            }
        } else {
            setUser(null);
        }
        dispatch(syncCart());
        dispatch(syncWishlist());
    }, [location.pathname, dispatch]);

    const handleLogout = () => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const userEmail = JSON.parse(storedUser).email;
                if (userEmail) {
                    localStorage.removeItem(`cart_${userEmail}`);
                }
            }
        } catch { /* ignore */ }

        dispatch(clearCart());
        dispatch(clearWishlist());
        dispatch(clearOrders());
        apiLogout();
        localStorage.removeItem("user");
        localStorage.removeItem("selectedAddress");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setUser(null);
        setProfileDropdownOpen(false);
        toast.success("Logged out successfully");
        navigate('/login');
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setProfileDropdownOpen(false);

        // Sync search query from URL
        const params = new URLSearchParams(location.search);
        const q = params.get("search") || "";
        setSearchQuery(q);
    }, [location.pathname, location.search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.trim()) {
            navigate(`/home?search=${encodeURIComponent(value.trim())}`, { replace: true });
        } else {
            navigate('/home', { replace: true });
        }
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        navigate('/home', { replace: true });
    };

    const isActive = (path) => location.pathname === path;

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const toggleListening = () => {
        if (isListening) {
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Voice search is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsListening(true);
            toast.success("Listening...");
        };
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
                setSearchQuery(transcript);
                navigate(`/home?search=${encodeURIComponent(transcript)}`, { replace: true });
                toast.success(`Searched for: ${transcript}`);
            }
        };
        recognition.onerror = () => {
            setIsListening(false);
            toast.error("Voice search failed.");
        };
        recognition.start();
    };

    const hideOnPaths = ['/delivery', '/vendor', '/vendordashboard', '/welcome', '/login', '/signup', '/account-verification', '/verify-otp'];
    if (hideOnPaths.some(path => location.pathname.startsWith(path))) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-500 ease-out">
            <div className={`absolute inset-0 transition-all duration-500 ease-out bg-gradient-to-r from-[#fb923c] via-[#c084fc] to-[#a78bfa] ${scrolled ? "backdrop-blur-xl shadow-lg shadow-purple-900/20 bg-opacity-95" : ""}`} />
            <div className="absolute inset-0 border-b border-white/5 pointer-events-none" />

            <div className="relative w-full px-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between gap-4">
                    <Link to="/home" className="flex items-center gap-0 group flex-shrink-0">
                        <img src="/s_logo.png" alt="ShopSphere Logo" className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110 translate-y-0.5" />
                        <span className="-ml-6 text-xl sm:text-2xl font-bold text-white tracking-wide group-hover:text-orange-200 transition-colors duration-300 hidden sm:block drop-shadow-md">hopSphere</span>
                    </Link>

                    <div className="hidden md:flex items-center flex-grow justify-end ml-8 gap-4">
                        <div className="flex items-center gap-4 w-full max-w-4xl">
                            <Link to="/home" className={`p-2.5 rounded-xl transition-all duration-300 ease-out group ${isActive("/home") ? "bg-white/25 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)] ring-1 ring-white/30" : "text-white/80 hover:bg-white/10 hover:text-white"}`}>
                                <FaHome size={20} className={`transition-transform duration-300 group-hover:scale-110 ${isActive("/home") ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" : ""}`} />
                            </Link>

                            {/* Categories hover menu */}
                            <div className="relative group/cat">
                                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                                    <span>Categories</span>
                                    <FaChevronDown size={10} className="group-hover/cat:rotate-180 transition-transform duration-300" />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover/cat:opacity-100 group-hover/cat:translate-y-0 group-hover/cat:pointer-events-auto transition-all duration-300 z-50">
                                    <div className="bg-[#581c87]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 overflow-hidden">
                                        {[
                                            { id: "all", label: "All Products" },
                                            { id: "electronics", label: "Electronics" },
                                            { id: "sports_fitness", label: "Sports & Fitness" },
                                            { id: "fashion", label: "Fashion" },
                                            { id: "books", label: "Books" },
                                            { id: "home_kitchen", label: "Home & Kitchen" },
                                            { id: "grocery", label: "Groceries" },
                                            { id: "beauty_personal_care", label: "Beauty & Care" },
                                            { id: "toys_games", label: "Toys & Games" },
                                            { id: "automotive", label: "Automotive" },
                                        ].map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    if (cat.id === "all") navigate('/home');
                                                    else navigate(`/category/${cat.id}`);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-orange-100 hover:bg-white/10 hover:text-white rounded-xl transition-all"
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-full group">
                                <div className={`absolute inset-0 bg-gradient-to-r from-orange-400 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300 ${searchFocused ? 'opacity-60' : ''}`} />
                                <input
                                    type="text"
                                    placeholder="Search for products, brands and more..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className={`relative w-full pl-11 pr-24 py-2.5 rounded-xl text-sm transition-all duration-300 ease-out outline-none border font-medium ${searchFocused ? "bg-white border-white text-gray-900 ring-4 ring-orange-500/20" : "bg-white/20 border-white/20 text-white placeholder-white/70 hover:bg-white/30 hover:border-white/40"} backdrop-blur-md`}
                                />
                                <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${searchFocused ? "text-orange-500" : "text-white"} z-10`} size={16} />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                                    {searchQuery && (
                                        <button onClick={handleClearSearch} className="p-1.5 text-orange-300 hover:text-white">
                                            <FaTimes size={12} />
                                        </button>
                                    )}
                                    <button onClick={toggleListening} className={`p-1.5 rounded-lg ${isListening ? "text-red-500 bg-red-400/10 animate-pulse" : "text-white/80"}`}>
                                        <FaMicrophone size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link to="/wishlist" className={`relative p-2.5 rounded-xl transition-all duration-300 group hover:bg-white/10 ${isActive("/wishlist") ? "bg-white/10 text-rose-400" : "text-orange-100"}`}>
                            <FaHeart size={18} className="transition-transform group-hover:scale-110" />
                            {wishlistCount > 0 && <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
                        </Link>

                        <Link to="/cart" className={`relative p-2.5 rounded-xl transition-all duration-300 group hover:bg-white/10 ${isActive("/cart") ? "bg-white/10 text-orange-300" : "text-orange-100"}`}>
                            <FaShoppingCart size={18} className="transition-transform group-hover:scale-110" />
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
                        </Link>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/10 text-orange-100">
                                    <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-bold"><FaUser size={12} /></div>
                                    <div className="hidden sm:flex flex-col items-start leading-tight">
                                        <span className="text-[10px] font-medium uppercase">Hello</span>
                                        <span className="text-xs font-bold text-white uppercase">{user.username}</span>
                                    </div>
                                    <FaChevronDown size={10} className={`transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
                                </button>
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-60 bg-[#581c87] border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                                        <div className="px-5 py-4 border-b border-white/10"><p className="text-sm font-bold text-white">{user.username}</p><p className="text-xs text-orange-200">{user.email}</p></div>
                                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-orange-100 hover:bg-white/10">My Profile</Link>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-white/10 text-left">Log Out</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="px-6 py-2.5 bg-white/10 text-white rounded-xl font-bold text-sm border border-white/10">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

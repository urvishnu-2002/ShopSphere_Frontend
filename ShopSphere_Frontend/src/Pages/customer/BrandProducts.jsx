import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Tag, ArrowLeft } from "lucide-react";
import { fetchProducts, AddToCart, AddToWishlist, RemoveFromWishlist } from "../../Store";
import toast from "react-hot-toast";
import ProductCard from "../../Components/ProductCard";

const BRAND_ICONS = {
    TechNova: "💻",
    UrbanThread: "👗",
    ActivePulse: "🏋️",
    PageTurner: "📚",
    HomeEssentials: "🏠",
    FreshMart: "🛒",
    GlowUp: "✨",
    PlayWorld: "🎮",
    DrivePro: "🚗",
    ShopSphere: "🛍️",
};

const BRAND_COLORS = {
    TechNova: "from-blue-600 to-cyan-500",
    UrbanThread: "from-pink-500 to-rose-600",
    ActivePulse: "from-green-500 to-emerald-600",
    PageTurner: "from-amber-500 to-orange-600",
    HomeEssentials: "from-purple-500 to-violet-600",
    FreshMart: "from-lime-500 to-green-600",
    GlowUp: "from-fuchsia-500 to-pink-600",
    PlayWorld: "from-yellow-500 to-orange-500",
    DrivePro: "from-slate-600 to-slate-800",
    ShopSphere: "from-orange-400 to-purple-500",
};

const BrandProducts = () => {
    const { brand } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const allProducts = useSelector((state) => state.products.all || []);
    const isLoading = useSelector((state) => state.products.isLoading);
    const wishlist = useSelector((state) => state.wishlist);

    useEffect(() => {
        if (allProducts.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, allProducts.length]);

    // All products for this brand
    const brandProducts = allProducts.filter(
        (p) => p.brand?.toLowerCase() === brand?.toLowerCase()
    );

    // Unique categories within this brand
    const categories = [
        "all",
        ...new Set(brandProducts.map((p) => p.category).filter(Boolean)),
    ];

    // Filtered + sorted
    const filteredProducts = brandProducts.filter((item) => {
        const matchesCat =
            selectedCategory === "all" ||
            item.category?.toLowerCase() === selectedCategory?.toLowerCase();
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "price_low") return a.price - b.price;
        if (sortBy === "price_high") return b.price - a.price;
        if (sortBy === "rating")
            return (b.average_rating || 0) - (a.average_rating || 0);
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const handleWishlistClick = (item) => {
        if (!localStorage.getItem("accessToken")) {
            toast.error("Please login to manage wishlist");
            navigate("/login");
            return;
        }
        if (wishlist.some((w) => w.name === item.name)) {
            dispatch(RemoveFromWishlist(item));
            toast.success("Removed from wishlist");
        } else {
            dispatch(AddToWishlist(item));
            toast.success("Added to wishlist");
        }
    };

    const handleAddToCartClick = (item) => {
        if (!localStorage.getItem("accessToken")) {
            toast.error("Please login to add to cart");
            navigate("/login");
            return;
        }
        dispatch(AddToCart(item));
        toast.success("Added to cart");
    };

    const isInWishlist = (name) => wishlist.some((w) => w.name === name);

    const gradientClass = BRAND_COLORS[brand] || "from-orange-400 to-purple-500";
    const brandIcon = BRAND_ICONS[brand] || "🏷️";

    const formatCategory = (cat) =>
        cat.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" & ");

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-orange-400 font-bold animate-pulse">
                        Loading {brand} products...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">


            <main className="flex-grow pt-28 pb-20">
                {/* ── Hero Banner ── */}
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-10">
                    <div
                        className={`bg-gradient-to-r ${gradientClass} rounded-[40px] p-8 md:p-14 relative overflow-hidden shadow-2xl`}
                    >
                        {/* decorative circles */}
                        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10" />
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5" />

                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 text-xs font-black uppercase tracking-widest transition-all"
                        >
                            <ArrowLeft size={14} />
                            Back
                        </button>

                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
                            <div className="text-7xl md:text-8xl">{brandIcon}</div>
                            <div>
                                <p className="text-white/60 font-black text-[10px] uppercase tracking-[4px] mb-2">
                                    Brand Collection
                                </p>
                                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
                                    {brand}
                                </h1>
                                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-2">
                                    {brandProducts.length} Products Available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Filters ── */}
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-10">
                    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-white flex flex-col md:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <Search
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder={`Search ${brand} products...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-400 rounded-2xl outline-none font-bold text-sm transition-all shadow-inner"
                            />
                        </div>

                        {/* Category filter */}
                        {categories.length > 1 && (
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-400 rounded-2xl outline-none font-bold text-sm cursor-pointer shadow-inner appearance-none pr-12"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat === "all" ? "All Categories" : formatCategory(cat)}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                            </div>
                        )}

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-400 rounded-2xl outline-none font-bold text-sm cursor-pointer shadow-inner appearance-none pr-12"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_low">Price: Low → High</option>
                                <option value="price_high">Price: High → Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <ChevronDown
                                size={14}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Products Grid ── */}
                <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                    {sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            <AnimatePresence>
                                {sortedProducts.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <ProductCard
                                            item={item}
                                            navigate={navigate}
                                            handleWishlistClick={handleWishlistClick}
                                            handleAddToCartClick={handleAddToCartClick}
                                            isInWishlist={isInWishlist}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[48px] border-2 border-dashed border-slate-200">
                            <div className="text-6xl mb-6">{brandIcon}</div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3 italic uppercase">
                                No Products Found
                            </h3>
                            <p className="text-slate-400 text-sm font-medium mb-8">
                                No {brand} products match your current filters.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("all");
                                }}
                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>


        </div>
    );
};

export default BrandProducts;

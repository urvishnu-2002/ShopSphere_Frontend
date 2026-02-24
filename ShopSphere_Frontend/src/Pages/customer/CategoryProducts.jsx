import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, SlidersHorizontal, X, ChevronDown, ChevronUp,
    Tag, DollarSign, Store, ArrowLeft
} from "lucide-react";
import { fetchProducts, AddToCart, AddToWishlist, RemoveFromWishlist } from "../../Store";
import toast from "react-hot-toast";
import ProductCard from "../../Components/ProductCard";

const CATEGORIES = [
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
    { id: "services", label: "Services" },
    { id: "other", label: "Other" },
];

const PRICE_RANGES = [
    { id: "all", label: "Any Price" },
    { id: "0-500", label: "Under ₹500", min: 0, max: 500 },
    { id: "500-2000", label: "₹500 – ₹2,000", min: 500, max: 2000 },
    { id: "2000-5000", label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
    { id: "5000-15000", label: "₹5,000 – ₹15,000", min: 5000, max: 15000 },
    { id: "15000+", label: "Above ₹15,000", min: 15000, max: Infinity },
];

function FilterSection({ title, icon: Icon, children, defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 px-1 group">
                <span className="flex items-center gap-2.5 text-sm font-black text-gray-800 uppercase tracking-wider">
                    <Icon size={14} className="text-orange-400" />
                    {title}
                </span>
                {open
                    ? <ChevronUp size={14} className="text-gray-400 group-hover:text-orange-400 transition-colors" />
                    : <ChevronDown size={14} className="text-gray-400 group-hover:text-orange-400 transition-colors" />
                }
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 space-y-1">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const CategoryProducts = () => {
    const { category: urlCategory } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || "all");
    const [selectedPriceRange, setSelectedPriceRange] = useState("all");
    const [selectedBrand, setSelectedBrand] = useState("all");
    const drawerRef = useRef(null);

    const allProducts = useSelector((state) => state.products.all || []);
    const isLoading = useSelector((state) => state.products.isLoading);
    const wishlist = useSelector((state) => state.wishlist);

    useEffect(() => {
        if (allProducts.length === 0) dispatch(fetchProducts());
    }, [dispatch, allProducts.length]);

    // Sync category from URL param
    useEffect(() => {
        setSelectedCategory(urlCategory || "all");
        setSelectedBrand("all");
    }, [urlCategory]);

    // Close drawer on outside click
    useEffect(() => {
        const handler = (e) => {
            if (filterOpen && drawerRef.current && !drawerRef.current.contains(e.target))
                setFilterOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [filterOpen]);

    // Available brands for the currently selected category
    const availableBrands = useMemo(() => {
        const pool = selectedCategory === "all"
            ? allProducts
            : allProducts.filter(p => p.category?.toLowerCase() === selectedCategory);
        return ["all", ...new Set(pool.map(p => p.brand).filter(Boolean))];
    }, [allProducts, selectedCategory]);

    const activeFilterCount = [
        selectedPriceRange !== "all" ? 1 : 0,
        selectedBrand !== "all" ? 1 : 0,
        selectedCategory !== urlCategory && selectedCategory !== "all" ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    // Filtering
    const sortedProducts = useMemo(() => {
        const priceRange = PRICE_RANGES.find(p => p.id === selectedPriceRange);
        return allProducts.filter((item) => {
            const matchCat = selectedCategory === "all" || item.category?.toLowerCase() === selectedCategory;
            const matchBrand = selectedBrand === "all" || item.brand === selectedBrand;
            const matchPrice = !priceRange || priceRange.id === "all"
                ? true : item.price >= priceRange.min && item.price <= priceRange.max;
            const matchSearch = !searchQuery
                ? true
                : item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.brand?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchBrand && matchPrice && matchSearch;
        });
    }, [allProducts, selectedCategory, selectedPriceRange, selectedBrand, searchQuery]);

    const displayTitle = selectedCategory === "all"
        ? "All Products"
        : CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory
            .split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const resetFilters = () => {
        setSelectedPriceRange("all");
        setSelectedBrand("all");
    };

    const handleWishlistClick = (item) => {
        if (!localStorage.getItem("accessToken")) {
            toast.error("Please login"); navigate("/login"); return;
        }
        if (wishlist.some(w => w.name === item.name)) {
            dispatch(RemoveFromWishlist(item)); toast.success("Removed from wishlist");
        } else {
            dispatch(AddToWishlist(item)); toast.success("Added to wishlist");
        }
    };

    const handleAddToCartClick = (item) => {
        if (!localStorage.getItem("accessToken")) {
            toast.error("Please login"); navigate("/login"); return;
        }
        dispatch(AddToCart(item));
        toast.success("Added to cart");
    };

    const isInWishlist = (itemName) => wishlist.some(w => w.name === itemName);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-orange-400 font-bold animate-pulse">Loading {displayTitle}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">


            <main className="flex-grow pt-28 pb-20">

                {/* Page Header */}
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-10">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-orange-400 uppercase tracking-widest transition-colors mb-1"
                                >
                                    <ArrowLeft size={13} /> Back
                                </button>
                                <p className="text-orange-400 font-black tracking-widest text-[10px] uppercase italic">Explore Collection</p>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{displayTitle}</h1>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{sortedProducts.length} Items Available</p>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-400 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-orange-400 rounded-2xl outline-none font-bold text-sm transition-all w-64 shadow-inner"
                                    />
                                </div>

                                <button
                                    onClick={() => setFilterOpen(true)}
                                    className="relative flex items-center gap-2.5 px-5 py-3.5 bg-slate-900 hover:bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg"
                                >
                                    <SlidersHorizontal size={15} />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <motion.span
                                            key={activeFilterCount}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-orange-400 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md"
                                        >
                                            {activeFilterCount}
                                        </motion.span>
                                    )}
                                </button>

                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={resetFilters}
                                        className="flex items-center gap-1.5 px-4 py-3.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-red-100"
                                    >
                                        <X size={13} /> Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter chips */}
                        {(selectedPriceRange !== "all" || selectedBrand !== "all") && (
                            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-slate-100">
                                {selectedPriceRange !== "all" && (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-600 rounded-full text-xs font-black uppercase tracking-wide">
                                        <DollarSign size={10} />
                                        {PRICE_RANGES.find(p => p.id === selectedPriceRange)?.label}
                                        <button onClick={() => setSelectedPriceRange("all")} className="ml-1 hover:text-purple-800"><X size={10} /></button>
                                    </span>
                                )}
                                {selectedBrand !== "all" && (
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-black uppercase tracking-wide">
                                        <Store size={10} />
                                        {selectedBrand}
                                        <button onClick={() => setSelectedBrand("all")} className="ml-1 hover:text-gray-800"><X size={10} /></button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="max-w-[1600px] mx-auto px-6 md:px-12">
                    {sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {sortedProducts.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    item={item}
                                    navigate={navigate}
                                    handleWishlistClick={handleWishlistClick}
                                    handleAddToCartClick={handleAddToCartClick}
                                    isInWishlist={isInWishlist}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[48px] border-2 border-dashed border-slate-200 shadow-inner">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                                <Search className="text-slate-300" size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3 italic">NO PRODUCTS FOUND</h3>
                            <p className="text-slate-400 text-sm font-medium">Try broadening your filters or exploring other categories</p>
                            <div className="flex gap-3 justify-center mt-8">
                                <button
                                    onClick={resetFilters}
                                    className="px-8 py-4 bg-orange-400 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all"
                                >
                                    Clear Filters
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-slate-900/10"
                                >
                                    All Products
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>



            {/* ══ FILTER DRAWER ══════════════════════════════════════════════════ */}
            <AnimatePresence>
                {filterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                            onClick={() => setFilterOpen(false)}
                        />
                        <motion.div
                            ref={drawerRef}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[340px] max-w-[95vw] bg-white shadow-2xl z-[201] flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-400 to-purple-500">
                                <div className="flex items-center gap-3">
                                    <SlidersHorizontal size={18} className="text-white" />
                                    <span className="text-white font-black uppercase tracking-widest text-sm">Filters</span>
                                    {activeFilterCount > 0 && (
                                        <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-black rounded-full">
                                            {activeFilterCount} active
                                        </span>
                                    )}
                                </div>
                                <button onClick={() => setFilterOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/40 text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto px-6 py-2">

                                {/* Price */}
                                <FilterSection title="Price Range" icon={DollarSign}>
                                    {PRICE_RANGES.map((range) => (
                                        <button
                                            key={range.id}
                                            onClick={() => setSelectedPriceRange(range.id)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between ${selectedPriceRange === range.id
                                                ? "bg-gradient-to-r from-orange-50 to-purple-50 text-orange-600 border border-orange-200"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                }`}
                                        >
                                            {range.label}
                                            {selectedPriceRange === range.id && <div className="w-2 h-2 rounded-full bg-orange-400" />}
                                        </button>
                                    ))}
                                </FilterSection>

                                {/* Category */}
                                <FilterSection title="Category" icon={Tag}>
                                    <div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto pr-1">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    setSelectedCategory(cat.id);
                                                    setSelectedBrand("all");
                                                    if (cat.id !== "all") navigate(`/category/${cat.id}`);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between ${selectedCategory === cat.id
                                                    ? "bg-gradient-to-r from-orange-50 to-purple-50 text-orange-600 border border-orange-200"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                    }`}
                                            >
                                                {cat.label}
                                                {selectedCategory === cat.id && <div className="w-2 h-2 rounded-full bg-orange-400" />}
                                            </button>
                                        ))}
                                    </div>
                                </FilterSection>

                                {/* Brand */}
                                <FilterSection title="Brand" icon={Store}>
                                    {availableBrands.length <= 1 ? (
                                        <p className="text-gray-400 text-xs font-medium px-4 py-2">No brands for this selection</p>
                                    ) : (
                                        <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto pr-1">
                                            {availableBrands.map((brand) => (
                                                <button
                                                    key={brand}
                                                    onClick={() => setSelectedBrand(brand)}
                                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between ${selectedBrand === brand
                                                        ? "bg-gradient-to-r from-orange-50 to-purple-50 text-orange-600 border border-orange-200"
                                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                        }`}
                                                >
                                                    {brand === "all" ? "All Brands" : brand}
                                                    {selectedBrand === brand && <div className="w-2 h-2 rounded-full bg-orange-400" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </FilterSection>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex gap-3">
                                <button
                                    onClick={resetFilters}
                                    className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-black text-xs uppercase tracking-widest hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                    Reset All
                                </button>
                                <button
                                    onClick={() => { setFilterOpen(false); }}
                                    className="flex-grow py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-400 to-purple-500 text-white font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-orange-400/20 transition-all"
                                >
                                    Show {sortedProducts.length} Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryProducts;

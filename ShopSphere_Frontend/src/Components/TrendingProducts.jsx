import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaShoppingBag, FaFire, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getTrendingProducts } from "../api/axios";

const RANK_COLORS = [
    { bg: "from-yellow-400 via-amber-500 to-orange-600", shadow: "shadow-amber-500/40", label: "🏆" },
    { bg: "from-gray-300 via-gray-400 to-gray-500", shadow: "shadow-gray-400/40", label: "🥈" },
    { bg: "from-amber-600 via-amber-700 to-amber-800", shadow: "shadow-amber-700/40", label: "🥉" },
];

function getImageUrl(item) {
    const images = item.images || item.gallery || [];
    if (images.length > 0) {
        const img = images[0];
        let imgPath = typeof img === "string" ? img : (img.image || img.url);
        if (!imgPath) return "/placeholder.jpg";
        if (imgPath.startsWith("http")) return imgPath;
        if (imgPath.startsWith("/")) return `http://127.0.0.1:8000${imgPath}`;
        return `http://127.0.0.1:8000/${imgPath}`;
    }
    return item.image || "/placeholder.jpg";
}

function SkeletonCard() {
    return (
        <div className="flex-shrink-0 w-[200px] md:w-[220px] h-[300px] rounded-2xl bg-gray-100 overflow-hidden animate-pulse">
            <div className="h-[50%] bg-gray-200" />
            <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded-full w-full" />
                <div className="h-2.5 bg-gray-200 rounded-full w-2/3" />
                <div className="flex justify-between items-center pt-2">
                    <div className="h-5 bg-gray-200 rounded-full w-16" />
                    <div className="h-8 w-8 bg-gray-200 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export default function TrendingProducts({
    navigate,
    handleWishlistClick,
    handleAddToCartClick,
    isInWishlist,
}) {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setIsLoading(true);
                const data = await getTrendingProducts();
                // Show most searched products regardless of average rating (user wants most searched)
                const filteredData = data || [];
                setTrendingProducts(filteredData);
            } catch (err) {
                console.error("Failed to fetch trending products:", err);
                setError("Could not load trending products");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrending();
    }, []);

    const updateScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener("scroll", updateScrollButtons);
            updateScrollButtons();
            return () => el.removeEventListener("scroll", updateScrollButtons);
        }
    }, [trendingProducts]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -240 : 240,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (trendingProducts.length <= 4) return;
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 20) {
                    scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
                }
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [trendingProducts]);

    if (error || (!isLoading && trendingProducts.length === 0)) return null;

    return (
        <section className="relative py-10 overflow-hidden" id="trending-section">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 overflow-hidden">
                <div className="absolute top-6 left-[10%] w-52 h-52 bg-orange-400/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-6 right-[10%] w-64 h-64 bg-purple-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: "2s" }} />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                        backgroundSize: "50px 50px"
                    }}
                />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center gap-4">
                        {/* Fire badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 backdrop-blur-xl">
                            <FaFire className="text-orange-400 animate-pulse" size={11} />
                            <span className="text-orange-400 font-black text-[9px] tracking-[0.25em] uppercase">
                                Hot Right Now
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Trending
                            <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-purple-500 bg-clip-text text-transparent"> Products</span>
                        </h2>
                    </div>

                    {/* Scroll Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className={`p-2 rounded-xl border transition-all duration-300 ${canScrollLeft
                                ? "border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                                : "border-white/5 text-white/20 cursor-not-allowed"
                                }`}
                        >
                            <FaChevronLeft size={11} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className={`p-2 rounded-xl border transition-all duration-300 ${canScrollRight
                                ? "border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                                : "border-white/5 text-white/20 cursor-not-allowed"
                                }`}
                        >
                            <FaChevronRight size={11} />
                        </button>
                    </div>
                </motion.div>

                {/* Carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        : trendingProducts.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className="flex-shrink-0 w-[200px] md:w-[220px] group"
                                style={{ scrollSnapAlign: "start" }}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div
                                    className="relative h-[300px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.04]"
                                    onClick={() => navigate(`/product/${item.id}`)}
                                >
                                    {/* Card bg */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl z-0" />

                                    {/* Rank Badge */}
                                    {index < 3 ? (
                                        <div
                                            className={`absolute top-3 left-3 z-20 w-8 h-8 rounded-lg bg-gradient-to-br ${RANK_COLORS[index].bg} ${RANK_COLORS[index].shadow} shadow-md flex items-center justify-center`}
                                        >
                                            <span className="text-sm">{RANK_COLORS[index].label}</span>
                                        </div>
                                    ) : (
                                        <div className="absolute top-3 left-3 z-20 w-8 h-8 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                                            <span className="text-white/70 font-black text-[11px]">#{index + 1}</span>
                                        </div>
                                    )}

                                    {/* Trending badge */}
                                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500/80 to-red-500/80 backdrop-blur-xl">
                                        <FaFire className="text-yellow-300" size={8} />
                                        <span className="text-white text-[8px] font-black tracking-wider">TRENDING</span>
                                    </div>

                                    {/* Product Image */}
                                    <div className="relative z-10 h-[50%] flex items-center justify-center p-4 overflow-hidden">
                                        <motion.img
                                            src={getImageUrl(item)}
                                            alt={item.name}
                                            className="max-h-full max-w-full object-contain drop-shadow-xl"
                                            animate={hoveredId === item.id ? { scale: 1.08, rotate: 1 } : { scale: 1, rotate: 0 }}
                                            transition={{ duration: 0.35, ease: "easeOut" }}
                                        />
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-orange-400/20 blur-xl rounded-full" />
                                    </div>

                                    {/* Product Info */}
                                    <div className="relative z-10 px-3.5 pb-3.5 pt-1 flex flex-col flex-1">
                                        <span className="text-orange-400 text-[8px] font-black tracking-[0.2em] uppercase mb-1">
                                            {item.category || "Product"}
                                        </span>

                                        <h3 className="text-white font-bold text-sm leading-snug line-clamp-1 group-hover:text-orange-300 transition-colors">
                                            {item.name}
                                        </h3>

                                        {/* Rating Section */}
                                        <div className="flex items-center gap-2 mt-1.5 mb-2">
                                            <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/10 backdrop-blur-md">
                                                <span className="text-[9px] font-black text-orange-400">
                                                    {Number(item.average_rating || 0).toFixed(1)}
                                                </span>
                                                <FaStar className="text-[8px] text-yellow-400 mb-0.5 shadow-yellow-500/50" />
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`text-[8px] ${i < Math.floor(item.average_rating || 0) ? "text-yellow-400" : "text-white/10"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-[10px] line-clamp-1 mt-0.5 mb-3 leading-relaxed">
                                            {item.description}
                                        </p>

                                        {/* Price & Actions */}
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-[8px] font-bold uppercase tracking-wider">Price</span>
                                                <span className="text-white font-black text-base">
                                                    ₹{parseFloat(item.price).toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleWishlistClick(item);
                                                    }}
                                                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-rose-500/50 transition-all duration-300 group/wish"
                                                >
                                                    <FaHeart
                                                        size={11}
                                                        className={
                                                            isInWishlist(item.name)
                                                                ? "text-rose-500"
                                                                : "text-gray-500 group-hover/wish:text-rose-400"
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCartClick(item);
                                                    }}
                                                    className="p-2 rounded-xl bg-gradient-to-r from-orange-400 to-purple-500 text-white hover:from-orange-500 hover:to-purple-500 transition-all duration-300 shadow-md shadow-orange-400/25 active:scale-95"
                                                >
                                                    <FaShoppingBag size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover glow */}
                                    <AnimatePresence>
                                        {hoveredId === item.id && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-orange-500/20 to-transparent z-0"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                </div>

                {/* Stats Bar */}
                {!isLoading && trendingProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-8"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                {trendingProducts.length} Trending Items
                            </span>
                        </div>
                        <div className="h-3 w-px bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-1.5">
                            <FaFire className="text-orange-400" size={10} />
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                Updated in Real-time
                            </span>
                        </div>
                        <div className="h-3 w-px bg-white/10 hidden md:block" />
                        <div className="flex items-center gap-1.5">
                            <FaStar className="text-yellow-400" size={10} />
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                Based on Reviews & Ratings
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

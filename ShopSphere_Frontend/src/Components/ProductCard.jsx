import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaShoppingBag, FaStar } from "react-icons/fa";

export default function ProductCard({
    item,
    navigate,
    handleWishlistClick,
    handleAddToCartClick,
    isInWishlist,
}) {
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // Prepare gallery from item.images or item.gallery
    const gallery = (item.images || item.gallery || []).map(img => {
        let imgPath = typeof img === 'string' ? img : (img.image || img.url);
        if (!imgPath) return "/public/placeholder.jpg";
        if (imgPath.startsWith('http')) return imgPath;
        if (imgPath.startsWith('/')) return `http://localhost:8000${imgPath}`;
        return `http://localhost:8000/${imgPath}`;
    });

    // Fallback image
    const displayImage = gallery.length > 0 ? gallery[currentImgIndex] : (item.image || "/public/placeholder.jpg");

    useEffect(() => {
        if (gallery.length > 1) {
            const interval = setInterval(() => {
                setCurrentImgIndex((prev) => (prev + 1) % gallery.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [gallery.length]);

    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group bg-white rounded-3xl shadow-lg cursor-pointer h-full flex flex-col"
            onClick={() => navigate(`/product/${item.id}`)}
        >
            <div className="relative h-64 overflow-hidden rounded-t-3xl bg-gray-50">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={displayImage}
                        src={displayImage}
                        className="w-full h-full object-contain p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    />
                </AnimatePresence>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistClick(item);
                    }}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md z-10 hover:bg-white transition-all"
                >
                    <FaHeart
                        className={isInWishlist(item.name) ? "text-red-500" : "text-gray-400"}
                    />
                </button>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                    {/* Product Name */}
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-400 transition-colors line-clamp-1">
                        {item.name}
                    </h3>

                    {/* Rating Section */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                            <span className="text-[11px] font-black text-orange-400">
                                {Number(item.average_rating || 0).toFixed(1)}
                            </span>
                            <FaStar className="text-[10px] text-yellow-400 mb-0.5" />
                        </div>

                        <div className="flex gap-0.5 ml-1">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`text-[10px] ${i < Math.floor(item.average_rating || 0) ? "text-yellow-400" : "text-gray-200"}`}
                                />
                            ))}
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mt-3">{item.description}</p>

                    {/* Brand Badge - visible below description */}
                    {item.brand && (
                        <div className="mt-3">
                            <span
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-500 border border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
                                onClick={(e) => { e.stopPropagation(); navigate(`/brand/${item.brand}`); }}
                            >
                                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                                {item.brand}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Price</span>
                        <span className="font-black text-xl text-gray-900">₹{parseFloat(item.price).toFixed(2)}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCartClick(item);
                        }}
                        className="bg-gradient-to-r from-orange-400 to-purple-500 text-white p-4 rounded-2xl hover:from-orange-600 hover:to-purple-700 transition-all shadow-lg active:scale-95"
                    >
                        <FaShoppingBag />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
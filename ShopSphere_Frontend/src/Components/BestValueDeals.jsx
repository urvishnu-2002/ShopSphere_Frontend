import React, { useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BestValueDeals = () => {
    const navigate = useNavigate();
    const allProducts = useSelector((state) => state.products.all || []);
    const scrollRef = useRef(null);

    const displayDeals = useMemo(() => {
        if (!allProducts.length) return [];

        // 1. Group products by category
        const categorized = {};
        allProducts.forEach(p => {
            const cat = p.category || 'other';
            if (!categorized[cat]) categorized[cat] = [];
            categorized[cat].push(p);
        });

        // 2. Diversified selection strategy (max 8 products for a perfect grid)
        const selected = [];
        const usedIds = new Set();
        const categories = Object.keys(categorized);

        // Loop through categories to ensure each cat gets representation first
        let catIndex = 0;
        // Increase pool to 12 for better horizontal scrolling feel
        while (selected.length < 12 && usedIds.size < allProducts.length) {
            const currentCat = categories[catIndex % categories.length];
            const productsInCat = categorized[currentCat];

            // Find a product in this category that hasn't been used
            const nextProduct = productsInCat.find(p => !usedIds.has(p.id));

            if (nextProduct) {
                selected.push(nextProduct);
                usedIds.add(nextProduct.id);
            }

            catIndex++;
            // Safety break if we've cycled through all categories and can't find more products
            if (catIndex > 200) break;
        }

        return selected.map((p, idx) => {
            // Robust image URL resolution
            const gallery = (p.images || p.gallery || []).map(img => {
                let imgPath = typeof img === 'string' ? img : (img.image || img.url);
                if (!imgPath) return null;
                if (imgPath.startsWith('http')) return imgPath;
                if (imgPath.startsWith('/')) return `http://127.0.0.1:8000${imgPath}`;
                return `http://127.0.0.1:8000/${imgPath}`;
            }).filter(Boolean);

            const displayImage = gallery.length > 0
                ? gallery[0]
                : (p.image && !p.image.includes('placeholder')
                    ? p.image.replace('localhost', '127.0.0.1')
                    : `/Fashion/${(idx % 11) + 1}.jpg`);

            return {
                id: p.id,
                title: p.name,
                discount: p.discount_percentage ? `${p.discount_percentage}% Off` : "Min. 50% Off",
                image: displayImage,
                category: p.category_display || p.category,
                vendor: p.vendor_name || "Premium Store"
            };
        });
    }, [allProducts]);


    const handleViewAllDeals = () => {
        navigate("/offer-zone");
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (displayDeals.length === 0) return null;

    return (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-8">
            <div className="bg-gradient-to-br from-[#e0f1ff] via-[#f0f9ff] to-[#e4f2ff] rounded-[40px] p-6 md:p-10 shadow-xl border border-blue-100/50 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full blur-[60px] -mr-24 -mt-24" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full blur-[60px] -ml-24 -mb-24" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="space-y-0.5">
                        <p className="text-blue-500 font-bold tracking-widest text-[9px] uppercase">Flash Sale</p>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                            Deal of the Day
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleViewAllDeals}
                            className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg active:scale-95 group"
                        >
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="relative z-10 flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {displayDeals.map((deal) => (
                        <motion.div
                            key={deal.id}
                            whileHover={{ y: -6 }}
                            onClick={() => handleProductClick(deal.id)}
                            className="flex-shrink-0 w-[220px] md:w-[260px] bg-white rounded-[28px] overflow-hidden shadow-lg shadow-blue-900/5 group border border-white hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col snap-start"
                        >
                            <div className="relative h-48 bg-[#f8fbff] flex items-center justify-center p-4 overflow-hidden">
                                <img
                                    src={deal.image}
                                    alt={deal.title}
                                    className="max-h-full max-w-full object-contain transition-all duration-700 group-hover:scale-110 drop-shadow-xl"
                                />
                                <div className="absolute top-3 left-3 z-20">
                                    <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                                        {deal.category}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 via-transparent to-transparent group-hover:from-blue-500/5 transition-colors duration-500" />
                            </div>
                            <div className="p-5 space-y-1.5 flex-grow flex flex-col">
                                <p className="text-blue-500 font-bold text-[9px] uppercase tracking-tight">{deal.vendor}</p>
                                <h3 className="text-slate-800 font-bold text-xs tracking-tight leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 h-8">
                                    {deal.title}
                                </h3>
                                <div className="mt-auto pt-3 flex items-center justify-between">
                                    <p className="text-slate-900 font-black text-lg">
                                        {deal.discount}
                                    </p>
                                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestValueDeals;

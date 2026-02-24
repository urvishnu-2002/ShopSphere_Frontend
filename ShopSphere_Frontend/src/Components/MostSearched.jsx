import React, { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MostSearched = () => {
    const navigate = useNavigate();
    const allProducts = useSelector((state) => state.products.all || []);
    const scrollRef = useRef(null);

    const products = useMemo(() => {
        if (!allProducts.length) return [];

        const freqMap = JSON.parse(localStorage.getItem('recentSearchFreq') || "{}");
        const searchedTerms = Object.keys(freqMap);

        let filteredPool = [...allProducts];

        // If user has local history, filter and weight by frequency
        if (searchedTerms.length > 0) {
            filteredPool = allProducts.map(p => {
                const searchString = `${p.name} ${p.category} ${p.category_display} ${p.description}`.toLowerCase();

                // Calculate personal relevance score: Sum of frequencies of matching terms
                let personalScore = 0;
                searchedTerms.forEach(term => {
                    if (searchString.includes(term)) {
                        personalScore += freqMap[term];
                    }
                });

                return { ...p, personalScore };
            }).filter(p => p.personalScore > 0);

            // If we found personal matches, sort by personal interest (personalScore) 
            // breaking ties with global popularity (search_count)
            if (filteredPool.length > 0) {
                filteredPool.sort((a, b) => {
                    if (b.personalScore !== a.personalScore) {
                        return b.personalScore - a.personalScore;
                    }
                    return (b.search_count || 0) - (a.search_count || 0);
                });
            } else {
                // Fallback to global trends if no keywords match current catalog
                filteredPool = [...allProducts].sort((a, b) => (b.search_count || 0) - (a.search_count || 0));
            }
        } else {
            // Global trends for users with no history
            filteredPool.sort((a, b) => (b.search_count || 0) - (a.search_count || 0));
        }

        return filteredPool
            .slice(0, 12)
            .map((p, idx) => {
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
                    price: p.price,
                    image: displayImage,
                    category: p.category_display || p.category,
                    vendor: p.vendor_name || "Premium Store",
                    searches: p.search_count || 0
                };
            });
    }, [allProducts]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (products.length === 0) return null;

    return (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-8">
            <div className="bg-gradient-to-br from-[#f5f3ff] via-[#fdf2ff] to-[#f5f3ff] rounded-[40px] p-6 md:p-10 shadow-xl border border-purple-100/50 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/10 rounded-full blur-[60px] -mr-24 -mt-24" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/10 rounded-full blur-[60px] -ml-24 -mb-24" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <Flame size={14} className="text-purple-500 fill-purple-500" />
                            <p className="text-purple-500 font-bold tracking-widest text-[9px] uppercase">
                                {Object.keys(JSON.parse(localStorage.getItem('recentSearchFreq') || "{}")).length > 0 ? "For You" : "Trending Now"}
                            </p>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                            {Object.keys(JSON.parse(localStorage.getItem('recentSearchFreq') || "{}")).length > 0 ? "Related to Your Searches" : "Most Searched Products"}
                        </h2>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="relative z-10 flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -6 }}
                            onClick={() => handleProductClick(item.id)}
                            className="flex-shrink-0 w-[220px] md:w-[260px] bg-white rounded-[28px] overflow-hidden shadow-lg shadow-purple-900/5 group border border-white hover:border-purple-200 transition-all duration-300 cursor-pointer flex flex-col snap-start"
                        >
                            <div className="relative h-48 bg-[#fafaff] flex items-center justify-center p-4 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="max-h-full max-w-full object-contain transition-all duration-700 group-hover:scale-110 drop-shadow-xl"
                                />
                                <div className="absolute top-3 left-3 z-20">
                                    <span className="bg-purple-600/90 backdrop-blur-sm text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/0 via-transparent to-transparent group-hover:from-purple-500/5 transition-colors duration-500" />
                            </div>
                            <div className="p-5 space-y-1.5 flex-grow flex flex-col">
                                <p className="text-purple-500 font-bold text-[9px] uppercase tracking-tight">{item.vendor}</p>
                                <h3 className="text-slate-800 font-bold text-xs tracking-tight leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 h-8">
                                    {item.title}
                                </h3>
                                <div className="mt-auto pt-3 flex items-center justify-between">
                                    <p className="text-slate-900 font-black text-lg">
                                        ₹{item.price}
                                    </p>
                                    <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
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

export default MostSearched;

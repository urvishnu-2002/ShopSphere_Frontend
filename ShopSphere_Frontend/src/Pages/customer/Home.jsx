import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  DollarSign,
  Store,
} from "lucide-react";
import { fetchProducts, AddToCart, AddToWishlist, RemoveFromWishlist } from "../../Store";
import { getProducts } from "../../api/axios";
import toast from "react-hot-toast";
import ProductCard from "../../Components/ProductCard";
import TrendingProducts from "../../Components/TrendingProducts";
import BestValueDeals from "../../Components/BestValueDeals";
import MostSearched from "../../Components/MostSearched";
import DiscoverySection from "../../Components/DiscoverySection";
import Newsletter from "../../Components/Newsletter";

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

const BANNERS = [
  {
    id: 1,
    title: "The Ultimate Future Collection",
    subtitle: "Season 2024",
    description: "Experience the next generation of premium tech and lifestyle products. Designed for those who dare to lead.",
    image: "/banner1.png",
    cta: "Explore Future",
    color: "from-orange-400 to-purple-500"
  },
  {
    id: 2,
    title: "Elegance in Every Detail",
    subtitle: "Luxury Minimalist",
    description: "Discover a curated collection of minimalist essentials that redefine modern sophistication and timeless style.",
    image: "/banner2.png",
    cta: "View Collection",
    color: "from-purple-600 to-orange-500"
  },
  {
    id: 3,
    title: "Active Life Redefined",
    subtitle: "High Performance",
    description: "Gear up with our high-performance athletic collection. Engineered for maximum comfort and peak athletic ability.",
    image: "/banner3.png",
    cta: "Get Started",
    color: "from-orange-400 to-purple-500"
  }
];

// Collapsible section inside filter panel
function FilterSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-1 group"
      >
        <span className="flex items-center gap-2.5 text-sm font-black text-gray-800 uppercase tracking-wider">
          <Icon size={14} className="text-orange-400" />
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} className="text-gray-400 group-hover:text-orange-400 transition-colors" />
        ) : (
          <ChevronDown size={14} className="text-gray-400 group-hover:text-orange-400 transition-colors" />
        )}
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

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlSearchQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const drawerRef = useRef(null);

  // ── Redux ─────────────────────────────────────────────────────────────────────
  const allProducts = useSelector((state) => state.products.all || []);
  const isLoading = useSelector((state) => state.products.isLoading);
  const wishlist = useSelector((state) => state.wishlist);

  // Fetch the full product catalog once on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Background search count tracking & local frequency history
  useEffect(() => {
    const term = urlSearchQuery?.trim().toLowerCase();
    if (term && term.length > 2) {
      // 1. Backend tracking
      getProducts({ search: term });

      // 2. Local frequency tracking for personal relevance
      const history = JSON.parse(localStorage.getItem('recentSearchFreq') || "{}");
      history[term] = (history[term] || 0) + 1;
      localStorage.setItem('recentSearchFreq', JSON.stringify(history));
    }
  }, [urlSearchQuery]);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Banner auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

  // Derived brands from allProducts
  const availableBrands = useMemo(() => {
    const pool = selectedCategory === "all"
      ? allProducts
      : allProducts.filter(p => p.category?.toLowerCase() === selectedCategory);
    return ["all", ...new Set(pool.map(p => p.brand).filter(Boolean))];
  }, [allProducts, selectedCategory]);

  // Active filter count (for badge)
  const activeFilterCount = [
    selectedCategory !== "all" ? 1 : 0,
    selectedPriceRange !== "all" ? 1 : 0,
    selectedBrand !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Filtering + sorting pipeline
  const filteredProducts = useMemo(() => {
    const priceRange = PRICE_RANGES.find(p => p.id === selectedPriceRange);
    return allProducts.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category?.toLowerCase() === selectedCategory;
      const matchBrand = selectedBrand === "all" || item.brand === selectedBrand;
      const matchPrice = !priceRange || priceRange.id === "all"
        ? true
        : item.price >= priceRange.min && item.price <= priceRange.max;
      const matchSearch = !searchQuery
        ? true
        : item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category_display && item.category_display.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchBrand && matchPrice && matchSearch;
    });
  }, [allProducts, selectedCategory, selectedPriceRange, selectedBrand, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setSelectedBrand("all");
    setCurrentPage(1);
  };

  const handleWishlistClick = (item) => {
    if (!localStorage.getItem("accessToken")) {
      toast.error("Please login to manage your wishlist");
      navigate("/login"); return;
    }
    if (wishlist.some(w => w.name === item.name)) {
      dispatch(RemoveFromWishlist(item));
      toast.success("Removed from wishlist");
    } else {
      dispatch(AddToWishlist(item));
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCartClick = (item) => {
    if (!localStorage.getItem("accessToken")) {
      toast.error("Please login to add items to your cart");
      navigate("/login"); return;
    }
    dispatch(AddToCart(item));
    toast.success("Added to cart");
  };

  const isInWishlist = (itemName) => wishlist.some(w => w.name === itemName);
  const paginate = (page) => {
    setCurrentPage(page);
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-orange-400 font-bold animate-pulse">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  const banner = BANNERS[currentBanner];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff]">

      {/* ── HERO CAROUSEL ─────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[400px] md:h-[550px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-24 lg:px-32">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-3xl"
              >
                <p className="text-orange-400 font-black tracking-[0.3em] uppercase text-xs mb-4">{banner.subtitle}</p>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">{banner.title}</h1>
                <p className="text-gray-300 text-base md:text-lg mb-8 max-w-xl leading-relaxed">{banner.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
                  className={`group w-fit px-10 py-4 bg-gradient-to-r ${banner.color} text-white font-black rounded-2xl flex items-center gap-3 shadow-xl transition-all duration-300`}
                >
                  {banner.cta} <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Banner progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3 p-3 bg-black/20 backdrop-blur-xl rounded-full border border-white/10">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-1.5 rounded-full transition-all duration-700 ${currentBanner === idx ? "w-10 bg-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]" : "w-1.5 bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </section>

      {/* ── TRENDING ──────────────────────────────────────────────────────────── */}
      <TrendingProducts
        navigate={navigate}
        handleWishlistClick={handleWishlistClick}
        handleAddToCartClick={handleAddToCartClick}
        isInWishlist={isInWishlist}
      />

      {/* ── BEST VALUE DEALS ─────────────────────────────────────────────────── */}
      <BestValueDeals />

      {/* ── MOST SEARCHED ─────────────────────────────────────────────────── */}
      <MostSearched />

      {/* ── PRODUCTS SECTION ──────────────────────────────────────────────────── */}
      <section id="products-section" className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-1">
            <p className="text-orange-400 font-black tracking-widest text-xs uppercase">Curated Just for You</p>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">FEATURED PRODUCTS</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-400 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setCurrentPage(1);

                  // Update URL so it's globally synced
                  if (val.trim()) {
                    navigate(`/home?search=${encodeURIComponent(val.trim())}`, { replace: true });
                  } else {
                    navigate('/home', { replace: true });
                  }
                }}
                className="pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/5 transition-all w-64"
              />
            </div>

            {/* Filter button */}
            <button
              onClick={() => setFilterOpen(true)}
              className="relative flex items-center gap-2.5 px-5 py-3 bg-gray-900 hover:bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-gray-900/10 hover:shadow-orange-500/20"
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

            {/* Clear filters (only when active) */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-red-100"
              >
                <X size={13} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory !== "all" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase tracking-wide">
                <Tag size={10} />
                {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                <button onClick={() => { setSelectedCategory("all"); setSelectedBrand("all"); setCurrentPage(1); }}
                  className="ml-1 hover:text-orange-800"><X size={10} /></button>
              </span>
            )}
            {selectedPriceRange !== "all" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-600 rounded-full text-xs font-black uppercase tracking-wide">
                <DollarSign size={10} />
                {PRICE_RANGES.find(p => p.id === selectedPriceRange)?.label}
                <button onClick={() => { setSelectedPriceRange("all"); setCurrentPage(1); }}
                  className="ml-1 hover:text-purple-800"><X size={10} /></button>
              </span>
            )}
            {selectedBrand !== "all" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-black uppercase tracking-wide">
                <Store size={10} />
                {selectedBrand}
                <button onClick={() => { setSelectedBrand("all"); setCurrentPage(1); }}
                  className="ml-1 hover:text-gray-800"><X size={10} /></button>
              </span>
            )}
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentProducts.map((item) => (
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

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={resetFilters}
              className="px-8 py-3 bg-orange-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-20 gap-3 flex-wrap">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`w-12 h-12 rounded-xl font-black text-sm transition-all duration-500 ${currentPage === i + 1
                  ? "bg-gradient-to-r from-orange-400 to-purple-500 text-white shadow-xl scale-110"
                  : "bg-white text-gray-400 border border-gray-100 hover:border-orange-200 hover:text-orange-400"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── DISCOVERY & NEWSLETTER ────────────────────────────────────────────── */}
      <DiscoverySection />
      <Newsletter />

      {/* ══ FILTER DRAWER OVERLAY ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {filterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
              onClick={() => setFilterOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[340px] max-w-[95vw] bg-white shadow-2xl z-[201] flex flex-col"
            >
              {/* Drawer header */}
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
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/40 text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable filter body */}
              <div className="flex-1 overflow-y-auto px-6 py-2">

                {/* ── PRICE ─────────────────────────────────────────────── */}
                <FilterSection title="Price Range" icon={DollarSign}>
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => { setSelectedPriceRange(range.id); setCurrentPage(1); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between group ${selectedPriceRange === range.id
                        ? "bg-gradient-to-r from-orange-50 to-purple-50 text-orange-600 border border-orange-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      {range.label}
                      {selectedPriceRange === range.id && (
                        <motion.div
                          layoutId="price-dot"
                          className="w-2 h-2 rounded-full bg-orange-400"
                        />
                      )}
                    </button>
                  ))}
                </FilterSection>

                {/* ── CATEGORY ──────────────────────────────────────────── */}
                <FilterSection title="Category" icon={Tag}>
                  <div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto pr-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSelectedBrand("all"); // reset brand when category changes
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between ${selectedCategory === cat.id
                          ? "bg-gradient-to-r from-orange-50 to-purple-50 text-orange-600 border border-orange-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                      >
                        {cat.label}
                        {selectedCategory === cat.id && (
                          <motion.div
                            layoutId="cat-dot"
                            className="w-2 h-2 rounded-full bg-orange-400"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                {/* ── BRAND ─────────────────────────────────────────────── */}
                <FilterSection title="Brand" icon={Store}>
                  {availableBrands.length <= 1 ? (
                    <p className="text-gray-400 text-xs font-medium px-4 py-2">No brands available for this selection</p>
                  ) : (
                    <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto pr-1">
                      {availableBrands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => { setSelectedBrand(brand); setCurrentPage(1); }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between ${selectedBrand === brand
                            ? "bg-gradient-to-r from-orange-50 to-purple-50 text-orange-600 border border-orange-200"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                          {brand === "all" ? "All Brands" : brand}
                          {selectedBrand === brand && (
                            <motion.div
                              layoutId="brand-dot"
                              className="w-2 h-2 rounded-full bg-orange-400"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </FilterSection>
              </div>

              {/* Drawer footer actions */}
              <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-black text-xs uppercase tracking-widest hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  Reset All
                </button>
                <button
                  onClick={() => {
                    setFilterOpen(false);
                    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-2 flex-grow py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-400 to-purple-500 text-white font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-orange-400/20 transition-all"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddToCart, AddToWishlist, RemoveFromWishlist } from "../../Store";
import { FaHeart, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// ============================================
// CONFIGURATION
// ============================================
const CATEGORIES = [
  { id: "all", label: "All", key: null },
  { id: "electronics", label: "Electronics", key: "fruit" },
  { id: "sports", label: "Sports", key: "veg" },
  { id: "books", label: "Books", key: "milk" },
  { id: "fashion", label: "Fashion", key: "snacks" },
  { id: "accessories", label: "Accessories", key: "chocolates" },
];

const BANNERS = [
  {
    id: 1,
    title: "Next-Gen Electronics",
    subtitle: "Premium Gadgets 2024",
    description: "Upgrade your lifestyle with the latest tech innovations and high-performance devices.",
    image: "Banner1.jpg",
    cta: "Shop Technology",
    color: "from-blue-600 to-indigo-700"
  },
  {
    id: 2,
    title: "Eco-Friendly Living",
    subtitle: "Organic & Fresh",
    description: "Discover a healthier choice with our handpicked collection of fresh, organic essentials.",
    image: "Banner2.jpg",
    cta: "Browse Organic",
    color: "from-emerald-600 to-teal-700"
  },
  {
    id: 3,
    title: "The Fashion Edit",
    subtitle: "New Season Styles",
    description: "Define your look with our exclusive collection of trendy apparel and accessories.",
    image: "Banner3.jpg",
    cta: "Explore Fashion",
    color: "from-violet-600 to-rose-700"
  }
];

function Home() {
  // ============================================
  // REDUX STATE & HOOKS
  // ============================================
  const products = useSelector((state) => state.products);
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const location = useLocation();

  // ============================================
  // LOCAL STATE
  // ============================================
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const categoryRefs = useRef({});

  // ============================================
  // BANNER CAROUSEL LOGIC
  // ============================================
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  // ============================================
  // PRODUCT FILTERING LOGIC
  // ============================================
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    const allProducts = [
      ...products.fruit,
      ...products.veg,
      ...products.milk,
      ...products.snacks,
      ...products.chocolates,
    ];

    let result = [];

    if (activeCategory === "all") {
      result = allProducts;
    } else {
      const categoryConfig = CATEGORIES.find((c) => c.id === activeCategory);
      if (categoryConfig && categoryConfig.key) {
        result = products[categoryConfig.key] || [];
      }
    }

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery)
      );
    }

    setIsAnimating(true);
    const animTimer = setTimeout(() => {
      setFilteredProducts(result);
      setIsAnimating(false);
    }, 200);

    return () => clearTimeout(animTimer);
  }, [location.search, products, activeCategory]);

  const handleCategoryChange = (categoryId) => {
    if (categoryId !== activeCategory) {
      setActiveCategory(categoryId);
    }
  };

  const isInWishlist = (itemName) => {
    return wishlist.some((item) => item.name === itemName);
  };

  const handleWishlistClick = (item) => {
    if (isInWishlist(item.name)) {
      dispatch(RemoveFromWishlist(item));
    } else {
      dispatch(AddToWishlist(item));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* ============================================
          HERO BANNER SECTION (CAROUSEL)
          ============================================ */}
      <section className="pt-8 px-4 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-[1440px] mx-auto h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden lg:rounded-[48px] shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={BANNERS[currentBanner].image}
                alt={BANNERS[currentBanner].title}
                className="w-full h-full object-cover origin-center"
              />

              {/* Content */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-20 lg:px-32">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/80 font-bold tracking-widest uppercase text-sm mb-4"
                >
                  {BANNERS[currentBanner].subtitle}
                </motion.p>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 max-w-2xl leading-tight"
                >
                  {BANNERS[currentBanner].title}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-200 text-lg md:text-xl mb-10 max-w-xl"
                >
                  {BANNERS[currentBanner].description}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={() => {
                      document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`px-8 py-4 bg-gradient-to-r ${BANNERS[currentBanner].color} text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-black/20`}
                  >
                    {BANNERS[currentBanner].cta}
                    <ArrowRight size={20} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-10 right-8 md:right-20 z-30 flex items-center gap-4">
            <button
              onClick={prevBanner}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextBanner}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-10 left-8 md:left-20 z-30 flex gap-2">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`h-2 transition-all duration-300 rounded-full ${idx === currentBanner ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CATEGORY FILTER SECTION
          ============================================ */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 sm:gap-3 p-1 bg-gray-100/80 rounded-full">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  ref={(el) => (categoryRefs.current[category.id] = el)}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition-all duration-300 ease-out
                    ${activeCategory === category.id
                      ? "text-white shadow-lg shadow-green-500/25"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
                    }
                  `}
                >
                  <span
                    className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-300 ease-out
                      ${activeCategory === category.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                      }
                    `}
                  ></span>
                  <span className="relative z-10">{category.label}</span>
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-300 ease-out
                      ${activeCategory === category.id
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0"
                      }
                    `}
                  ></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PRODUCTS SECTION
          ============================================ */}
      <section id="products-section" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {activeCategory === "all"
                ? "All Products"
                : CATEGORIES.find((c) => c.id === activeCategory)?.label || "Products"}
            </h2>
            <p className="text-gray-500 text-lg">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 transition-all duration-300 ease-out ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100 h-48 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlistClick(item);
                        }}
                        className={`p-2.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${isInWishlist(item.name)
                          ? "bg-red-50 shadow-red-200/50"
                          : "bg-white hover:bg-gray-50 shadow-gray-200/50"
                          }`}
                      >
                        <FaHeart
                          size={20}
                          className={`transition-colors duration-300 ${isInWishlist(item.name) ? "text-red-500" : "text-gray-300 group-hover:text-gray-400"
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 mb-4 line-clamp-2 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(AddToCart(item));
                        }}
                        className="group/btn relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></span>
                        <span className="relative">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaShoppingBag className="text-4xl text-gray-300" />
                </div>
                <p className="text-2xl text-gray-500 mb-4">No products found</p>
                <p className="text-gray-400 mb-6">Try a different category or search term</p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    window.history.pushState({}, "", "/");
                  }}
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
                >
                  <span>View all products</span>
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddToCart, AddToWishlist, RemoveFromWishlist } from "../../Store";
import { FaHeart, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useLocation } from "react-router-dom";

// ============================================
// CATEGORY CONFIGURATION
// ============================================
const CATEGORIES = [
  { id: "all", label: "All", key: null },
  { id: "electronics", label: "Electronics", key: "fruit" },
  { id: "sports", label: "Sports", key: "veg" },
  { id: "books", label: "Books", key: "milk" },
  { id: "fashion", label: "Fashion", key: "snacks" },
  { id: "accessories", label: "Accessories", key: "chocolates" },
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
  const [heroVisible, setHeroVisible] = useState(false);
  const categoryRefs = useRef({});

  // ============================================
  // HERO BANNER ANIMATION ON MOUNT
  // ============================================
  useEffect(() => {
    // Trigger hero fade-in animation on page load
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ============================================
  // PRODUCT FILTERING LOGIC
  // ============================================
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    // Combine all products from all categories
    const allProducts = [
      ...products.fruit,
      ...products.veg,
      ...products.milk,
      ...products.snacks,
      ...products.chocolates,
    ];

    let result = [];

    // Filter by category first
    if (activeCategory === "all") {
      result = allProducts;
    } else {
      const categoryConfig = CATEGORIES.find((c) => c.id === activeCategory);
      if (categoryConfig && categoryConfig.key) {
        result = products[categoryConfig.key] || [];
      }
    }

    // Then filter by search query if present
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery)
      );
    }

    // Animate product transitions
    setIsAnimating(true);
    const animTimer = setTimeout(() => {
      setFilteredProducts(result);
      setIsAnimating(false);
    }, 200);

    return () => clearTimeout(animTimer);
  }, [location.search, products, activeCategory]);

  // ============================================
  // CATEGORY CHANGE HANDLER
  // ============================================
  const handleCategoryChange = (categoryId) => {
    if (categoryId !== activeCategory) {
      setActiveCategory(categoryId);
    }
  };

  // ============================================
  // WISHLIST HELPERS
  // ============================================
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

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* ============================================
          HERO BANNER SECTION
          ============================================ */}
      <section
        className={`relative overflow-hidden transition-all duration-1000 ease-out ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        {/* Hero Background with Soft Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-50 via-40% to-yellow-100 opacity-80"></div>

        {/* Decorative Floating Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="text-center">
            {/* Main Heading with Gradient Text */}
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 transition-all duration-700 delay-200 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
            >
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
                Discover Premium
              </span>
              <br />
              <span className="text-gray-800">Products for You</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-400 ${heroVisible ? "opacity-70 translate-y-0" : "opacity-0 translate-y-6"
                }`}
            >
              Explore our curated collection of high-quality products
              <br className="hidden sm:block" />
              delivered fresh to your doorstep with care and precision.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-500 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
            >
              {/* Primary CTA Button */}
              <button
                onClick={() => {
                  document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 ease-out overflow-hidden"
              >
                {/* Button Shine Effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <FaShoppingBag className="text-xl" />
                <span className="relative">Shop Now</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              {/* Secondary CTA Button */}
              <button className="group inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold text-lg px-8 py-4 rounded-full border-2 border-gray-200 hover:border-green-300 hover:bg-white shadow-md hover:shadow-lg transform hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 ease-out">
                <span>View Collections</span>
                <FaArrowRight className="text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </button>
            </div>

            {/* Trust Badges */}
            <div
              className={`mt-12 flex flex-wrap justify-center gap-6 sm:gap-10 text-gray-500 text-sm transition-all duration-700 delay-700 ${heroVisible ? "opacity-60 translate-y-0" : "opacity-0 translate-y-6"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></span>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></span>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="url(#wave-gradient)" fillOpacity="0.1" />
            <defs>
              <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="0">
                <stop stopColor="#22c55e" />
                <stop offset="1" stopColor="#eab308" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* ============================================
          CATEGORY FILTER SECTION
          ============================================ */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
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
                  {/* Active Background Pill */}
                  <span
                    className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-300 ease-out
                      ${activeCategory === category.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                      }
                    `}
                  ></span>

                  {/* Category Label */}
                  <span className="relative z-10">{category.label}</span>

                  {/* Animated Underline for Active State */}
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
          {/* Section Header */}
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

          {/* Products Grid with Smooth Transitions */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 transition-all duration-300 ease-out ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100 h-48 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                    {/* Wishlist Button - Moved AFTER overlay and added z-10 */}
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
                          className={`transition-colors duration-300 ${isInWishlist(item.name) ? "text-red-500" : "text-gray-300 group-hover:text-gray-400" // Fixed group-hover text color logic
                            }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 mb-4 line-clamp-2 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {/* Price and Add to Cart */}
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
              /* Empty State */
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

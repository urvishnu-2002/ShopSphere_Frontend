import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddToCart, AddToWishlist, RemoveFromWishlist, fetchProducts } from "../../Store";
import { FaHeart, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

// CONFIGURATION

const CATEGORIES = [
  { id: "all", label: "All", key: null },
  { id: "electronics", label: "Electronics", key: "electronics" },
  { id: "fashion", label: "Fashion", key: "fashion" },
  { id: "home_kitchen", label: "Home & Kitchen", key: "home_kitchen" },
  { id: "grocery", label: "Groceries", key: "grocery" },
  { id: "beauty", label: "Beauty", key: "beauty_personal_care" },
  { id: "sports", label: "Sports", key: "sports" },
  { id: "books", label: "Books", key: "books" },
  { id: "other", label: "Other", key: "other" },
];

const BANNERS = [
  {
    id: 1,
    title: "Next-Gen Electronics",
    subtitle: "Premium Gadgets 2024",
    description: "Upgrade your lifestyle with the latest tech innovations and high-performance devices.",
    image: "banner2.png",
    cta: "Shop Technology",
    color: "from-blue-600 to-indigo-700"
  },
  {
    id: 2,
    title: "The Fashion Edit",
    subtitle: "New Season Styles",
    description: "Define your look with our exclusive collection of trendy apparel and accessories.",
    image: "banner3.png",
    cta: "Explore Fashion",
    color: "from-violet-600 to-rose-700"
  },
  {
    id: 3,
    title: "Exclusive Collection",
    subtitle: "New Arrivals",
    description: "Experience premium quality and style with our latest exclusive collection.",
    image: "banner4.png",
    cta: "Shop Now",
    color: "from-emerald-600 to-teal-700"
  }
];

// Product Card Component with Automatic Image Slider
const ProductCard = ({ item, navigate, handleWishlistClick, handleAddToCartClick, isInWishlist }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (item.gallery && item.gallery.length > 1) {
      const interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % item.gallery.length);
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [item.gallery]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col h-full"
      onClick={() => navigate(`/product/${encodeURIComponent(item.name)}`)}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-64 overflow-hidden rounded-t-3xl bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImgIndex}
            src={item.gallery && item.gallery.length > 0 ? item.gallery[currentImgIndex] : item.image}
            alt={item.name}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.5 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* NEW BADGE */}
        {item.isNew && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-emerald-200">
              New
            </span>
          </div>
        )}

        {/* WISHLIST BUTTON */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistClick(item);
            }}
            className={`p-2.5 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${isInWishlist(item.name)
                ? "bg-red-50 text-red-500"
                : "bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500"
              }`}
          >
            <FaHeart size={16} />
          </button>
        </div>

        {/* GALLERY DOTS */}
        {item.gallery && item.gallery.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
            {item.gallery.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentImgIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">{item.category}</span>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-violet-600 transition-colors">
            {item.name}
          </h3>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-gray-900">₹{item.price}</span>
            <span className="text-[10px] text-gray-400 line-through">₹{Number(item.price) + 500}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCartClick(item);
            }}
            className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-violet-600 transition-all duration-300 shadow-lg shadow-gray-200 active:scale-90"
          >
            <FaShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {

  // REDUX STATE & HOOKS
  const products = useSelector((state) => state.products);
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // FETCH PRODUCTS ON MOUNT
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // LOCAL STATE
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const categoryRefs = useRef({});

  // Safety check: Ensure index is always valid
  const bannerIndex = currentBanner % BANNERS.length;
  const banner = BANNERS[bannerIndex] || BANNERS[0];

  // BANNER CAROUSEL LOGIC
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentBanner]);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  // PRODUCT FILTERING LOGIC
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    const allProducts = [
      ...(products.electronics || []),
      ...(products.sports || []),
      ...(products.fashion || []),
      ...(products.books || []),
      ...(products.home_kitchen || []),
      ...(products.grocery || []),
      ...(products.beauty_personal_care || []),
      ...(products.toys_games || []),
      ...(products.automotive || []),
      ...(products.services || []),
      ...(products.other || []),
    ];

    let result = [];

    if (searchQuery) {
      result = allProducts.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery)
      );
    } else {
      if (activeCategory === "all") {
        result = allProducts;
      } else {
        const categoryConfig = CATEGORIES.find((c) => c.id === activeCategory);
        if (categoryConfig && categoryConfig.key) {
          result = products[categoryConfig.key] || [];
        }
      }
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
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Please login to add items to your wishlist");
      navigate("/login");
      return;
    }

    if (isInWishlist(item.name)) {
      dispatch(RemoveFromWishlist(item));
      toast.success("Removed from wishlist");
    } else {
      dispatch(AddToWishlist(item));
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCartClick = (item) => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Please login to add items to your cart");
      navigate("/login");
      return;
    }
    dispatch(AddToCart(item));
    toast.success("Added to cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* CATEGORY FILTER SECTION */}
      <section className="bg-white/60 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 sm:gap-3 p-1 bg-gray-100/80 rounded-full">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  ref={(el) => (categoryRefs.current[category.id] = el)}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition-all duration-300 ease-out
                    ${activeCategory === category.id
                      ? "text-white shadow-lg shadow-violet-500/25"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
                    }
                  `}
                >
                  <span
                    className={`absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-300 ease-out
                        ${activeCategory === category.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                      }
                      `}
                  ></span>
                  <span className="relative z-10">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HERO BANNER SECTION */}
      <section className="w-full">
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-20 lg:px-32">
                <p className="text-white/80 font-bold tracking-widest uppercase text-sm mb-4">{banner.subtitle}</p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 max-w-2xl">{banner.title}</h1>
                <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-xl">{banner.description}</p>
                <button
                  onClick={() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })}
                  className={`w-fit px-8 py-4 bg-gradient-to-r ${banner.color} text-white font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform`}
                >
                  {banner.cta}
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-10 right-8 md:right-20 z-30 flex gap-4">
            <button onClick={prevBanner} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"><ChevronLeft size={24} /></button>
            <button onClick={nextBanner} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"><ChevronRight size={24} /></button>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products-section" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {activeCategory === "all" ? "All Products" : CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item, index) => (
                <ProductCard
                  key={`${item.id}-${index}`}
                  item={item}
                  navigate={navigate}
                  handleWishlistClick={handleWishlistClick}
                  handleAddToCartClick={handleAddToCartClick}
                  isInWishlist={isInWishlist}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <FaShoppingBag className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-2xl text-gray-500 mb-2">No products found</p>
                <button onClick={() => setActiveCategory("all")} className="text-violet-600 font-medium">View all products</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

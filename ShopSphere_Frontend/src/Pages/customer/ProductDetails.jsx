import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaPlus,
    FaMinus,
    FaShoppingCart,
    FaBolt,
    FaHeart,
    FaTruck,
    FaUndo,
    FaMapMarkerAlt,
    FaChevronLeft
} from "react-icons/fa";
import { AddToCart, AddToWishlist, RemoveFromWishlist } from "../../Store";

// Mock Rating Component
const Rating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<FaStar key={i} className="text-yellow-400" />);
        } else if (i - 0.5 <= rating) {
            stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
        } else {
            stars.push(<FaRegStar key={i} className="text-gray-300" />);
        }
    }
    return <div className="flex gap-1 items-center">{stars} <span className="text-sm font-bold text-gray-500 ml-2">{rating}</span></div>;
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get products from Redux to find the selected one
    const allProductsInCategories = useSelector((state) => state.products);
    const wishlist = useSelector((state) => state.wishlist);

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);

    // Find product logic
    useEffect(() => {
        // In a real app, you'd fetch by ID. 
        // Here we search across categories. Since 'id' might be the product name in this setup.
        let foundProduct = null;
        Object.values(allProductsInCategories).forEach(categoryProducts => {
            const match = categoryProducts.find(p => encodeURIComponent(p.name) === id || p.name === id);
            if (match) foundProduct = match;
        });

        if (foundProduct) {
            // Augment with details requested by user if they don't exist
            const augmentedProduct = {
                ...foundProduct,
                oldPrice: foundProduct.oldPrice || foundProduct.price + 20, // Mocked
                rating: foundProduct.rating || 4.5, // Mocked
                // Ensure we have an array of images. If only one exists, we repeat it with different hints or use placeholders
                images: foundProduct.images || [
                    foundProduct.image,
                    foundProduct.image, // Just repeating the same image for gallery demonstration
                    foundProduct.image,
                    foundProduct.image
                ]
            };
            setProduct(augmentedProduct);
            setMainImage(augmentedProduct.images[0]);
        }
    }, [id, allProductsInCategories]);

    const isInWishlist = (itemName) => {
        return wishlist.some((item) => item.name === itemName);
    };

    const handleWishlistToggle = () => {
        if (isInWishlist(product.name)) {
            dispatch(RemoveFromWishlist(product));
        } else {
            dispatch(AddToWishlist(product));
        }
    };

    const handleAddToCart = () => {
        dispatch(AddToCart({ ...product, quantity }));
        // Optional: show a toast or feedback
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition-all group"
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md border border-gray-100 transition-all">
                        <FaChevronLeft size={16} />
                    </div>
                    Back to products
                </button>

                {/* Main Content Card */}
                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col lg:flex-row">

                    {/* LEFT SECTION: IMAGE GALLERY */}
                    <div className="w-full lg:w-[55%] p-6 lg:p-12 flex flex-col-reverse lg:flex-row gap-6">
                        {/* Vertical Thumbnails */}
                        <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setMainImage(img);
                                        setSelectedImgIndex(idx);
                                    }}
                                    className={`relative flex-shrink-0 w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImgIndex === idx ? "border-blue-600 scale-105 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image Container */}
                        <div className="flex-1 relative aspect-square bg-[#FCFBFA] rounded-[32px] overflow-hidden group">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={mainImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </AnimatePresence>

                            {/* Hot Badge */}
                            <div className="absolute top-6 left-6 px-4 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-[2px] rounded-full shadow-lg shadow-red-500/20">
                                Best Seller
                            </div>

                            {/* Wishlist Button Overlay */}
                            <button
                                onClick={handleWishlistToggle}
                                className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isInWishlist(product.name) ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"
                                    }`}
                            >
                                <FaHeart size={20} className={isInWishlist(product.name) ? "animate-bounce" : ""} />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT SECTION: PRODUCT INFO */}
                    <div className="w-full lg:w-[45%] p-8 lg:p-14 lg:border-l border-gray-100 flex flex-col justify-between">
                        <div>
                            {/* Brand / Category */}
                            <p className="text-blue-600 text-[12px] font-black uppercase tracking-[3px] mb-3">Premium Collection</p>

                            {/* Name */}
                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                                {product.name}
                            </h1>

                            {/* Ratings */}
                            <div className="flex items-center gap-4 mb-8">
                                <Rating rating={product.rating} />
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                <span className="text-sm font-bold text-gray-400">128 Reviews</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-end gap-5 mb-8">
                                <p className="text-5xl font-black text-gray-900 tracking-tighter">
                                    ₹{product.price.toFixed(2)}
                                </p>
                                <p className="text-2xl font-bold text-gray-300 line-through mb-1.5">
                                    ₹{product.oldPrice.toFixed(2)}
                                </p>
                                <div className="px-3 py-1 bg-green-100 text-green-600 text-[11px] font-black uppercase tracking-[1px] rounded-lg mb-2">
                                    Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-10">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-4">Product Description</h4>
                                <p className="text-gray-500 text-lg leading-relaxed font-medium lg:max-w-sm">
                                    {product.description}
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-6 mb-12">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px]">Quantity</h4>
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-1.5 shadow-inner">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-blue-600 transition-all font-bold"
                                    >
                                        <FaMinus size={12} />
                                    </button>
                                    <span className="w-12 text-center text-lg font-black text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-blue-600 transition-all font-bold"
                                    >
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-5 bg-white border-2 border-gray-900 text-gray-900 rounded-[24px] font-black text-lg transition-all hover:bg-gray-50 flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                                >
                                    <FaShoppingCart size={18} /> Add to Cart
                                </button>
                                <button
                                    className="flex-1 py-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[24px] font-black text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <FaBolt size={18} /> Buy it Now
                                </button>
                            </div>
                        </div>

                        {/* DELIVERY INFO SECTION */}
                        <div className="border-t border-gray-100 pt-8 mt-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FaTruck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 mb-0.5">Free Delivery</p>
                                        <p className="text-[12px] text-gray-500 font-medium">For orders over ₹500</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FaUndo size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 mb-0.5">30 Days Return</p>
                                        <p className="text-[12px] text-gray-500 font-medium">Easy return & exchange</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pincode Tracker UI Only */}
                            <div className="mt-8 relative max-w-sm">
                                <input
                                    type="text"
                                    placeholder="Enter your pincode"
                                    className="w-full pl-5 pr-32 py-4 bg-gray-50 border border-gray-200 rounded-[20px] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                                <button className="absolute right-2 top-2 bottom-2 px-6 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[1px] hover:bg-black transition-colors">
                                    Check
                                </button>
                                <div className="absolute left-0 -top-6 flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-[1px]">
                                    <FaMapMarkerAlt size={10} /> Check Delivery Availability
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

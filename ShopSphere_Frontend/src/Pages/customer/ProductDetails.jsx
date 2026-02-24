import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaStar, FaStarHalfAlt, FaRegStar, FaPlus, FaMinus, FaShoppingCart, FaBolt, FaHeart, FaTruck, FaUndo, FaMapMarkerAlt, FaChevronLeft, FaUser, FaArrowRight
} from "react-icons/fa";
import { AddToCart, AddToWishlist, RemoveFromWishlist, fetchProducts } from "../../Store";
import { getProductDetail } from "../../api/axios";
import toast from "react-hot-toast";
import ProductCard from "../../Components/ProductCard";

// Mock Rating Component
const Rating = ({ rating }) => {
    const stars = [];
    const val = Number(rating) || 0;
    const fullStars = Math.floor(val);
    const hasHalfStar = (val % 1) !== 0;

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(<FaStar key={i} className="text-yellow-400" />);
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
        } else {
            stars.push(<FaRegStar key={i} className="text-gray-300" />);
        }
    }
    return <div className="flex gap-1 items-center">{stars} <span className="text-sm font-bold text-gray-500 ml-2">{val.toFixed(1)}</span></div>;
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const allProducts = useSelector((state) => state.products.all);
    const wishlist = useSelector((state) => state.wishlist);

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const normalizeImagePath = (path) => {
        if (!path) return "/public/placeholder.jpg";
        if (path.startsWith('http')) return path;
        const base = "http://127.0.0.1:8000";
        if (path.startsWith('/')) return `${base}${path}`;
        return `${base}/${path}`;
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // First try to find in Redux
                const decodedId = decodeURIComponent(id);
                let foundProduct = allProducts?.find(p => p.name === decodedId || String(p.id) === decodedId);

                // Then fetch full details and reviews from API
                const productId = foundProduct?.id || decodedId;
                if (!productId || isNaN(productId)) return;

                const data = await getProductDetail(productId);

                if (data.product) {
                    const prod = data.product;
                    const normalizedImages = (prod.images || []).map(img => normalizeImagePath(img.image));

                    setProduct({
                        ...prod,
                        price: Number(prod.price),
                        oldPrice: Number(prod.price) * 1.2,
                        images: normalizedImages.length > 0 ? normalizedImages : ["/public/placeholder.jpg"]
                    });
                    setMainImage(normalizedImages[0] || "/public/placeholder.jpg");
                }

                if (data.reviews && data.reviews.length > 0) {
                    setReviews(data.reviews.map(r => ({
                        ...r,
                        name: r.reviewer_name || r.username || "Anonymous",
                        avatar: (r.reviewer_name || r.username || "A").substring(0, 2).toUpperCase(),
                        date: new Date(r.created_at).toLocaleDateString(),
                        image: r.pictures ? normalizeImagePath(r.pictures) : null
                    })));
                } else if (data.user_review) {
                    const r = data.user_review;
                    setReviews([{
                        ...r,
                        name: r.reviewer_name || r.username || "Anonymous",
                        avatar: (r.reviewer_name || r.username || "A").substring(0, 2).toUpperCase(),
                        date: new Date(r.created_at).toLocaleDateString(),
                        image: r.pictures ? normalizeImagePath(r.pictures) : null
                    }]);
                } else {
                    setReviews([]);
                }

                // Related Products Logic
                if (data.product?.category && allProducts?.length > 0) {
                    const currentCategory = data.product.category.toLowerCase();
                    const related = allProducts.filter(p =>
                        p.category?.toLowerCase() === currentCategory &&
                        p.id !== data.product.id
                    ).slice(0, 4); // Show top 4 related
                    setRelatedProducts(related);
                }
            } catch (err) {
                console.error("Error fetching product details:", err);
            }
        };

        fetchDetails();
    }, [id, allProducts]);

    useEffect(() => {
        if (!allProducts || allProducts.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, allProducts]);

    const isInWishlist = (itemName) => {
        return wishlist.some((item) => item.name === itemName);
    };

    const handleWishlistToggle = () => {
        const user = localStorage.getItem("accessToken");
        if (!user) {
            toast.error("Please login to manage your wishlist");
            navigate("/login");
            return;
        }

        if (isInWishlist(product.name)) {
            dispatch(RemoveFromWishlist(product));
            toast.success("Removed from wishlist");
        } else {
            dispatch(AddToWishlist(product));
            toast.success("Added to wishlist");
        }
    };

    const handleAddToCart = () => {
        const user = localStorage.getItem("accessToken");
        if (!user) {
            toast.error("Please login to add items to your cart");
            navigate("/login");
            return;
        }
        dispatch(AddToCart({ ...product, quantity }));
        toast.success("Added to cart");
    };

    const handleRelatedWishlist = (item) => {
        const user = localStorage.getItem("accessToken");
        if (!user) {
            toast.error("Please login to manage your wishlist");
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

    const handleRelatedAddToCart = (item) => {
        const user = localStorage.getItem("accessToken");
        if (!user) {
            toast.error("Please login to add items to your cart");
            navigate("/login");
            return;
        }
        dispatch(AddToCart(item));
        toast.success("Added to cart");
    };

    const handleBuyNow = () => {
        const user = localStorage.getItem("accessToken");
        if (!user) {
            toast.error("Please login to proceed with your purchase");
            navigate("/login");
            return;
        }

        // Add to cart first
        dispatch(AddToCart({ ...product, quantity }));

        // Check if an address is already selected
        const storedAddress = localStorage.getItem("selectedAddress");
        if (!storedAddress) {
            toast.error("Please select a delivery address in the cart first");
            navigate("/cart"); // Go to cart where address selection happens
            return;
        }

        navigate("/checkout");
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-orange-400 font-bold transition-all group"
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md border border-gray-100 transition-all">
                        <FaChevronLeft size={16} />
                    </div>
                    Back to products
                </button>

                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
                    {/* LEFT SECTION: IMAGE GALLERY */}
                    <div className="w-full lg:w-[55%] p-6 lg:p-12 flex flex-col-reverse lg:flex-row gap-6">
                        <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setMainImage(img);
                                        setSelectedImgIndex(idx);
                                    }}
                                    className={`relative flex-shrink-0 w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selectedImgIndex === idx ? "border-orange-400 scale-105 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

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
                            <div className="absolute top-6 left-6 px-4 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-[2px] rounded-full shadow-lg shadow-red-500/20">
                                Best Seller
                            </div>
                            <button
                                onClick={handleWishlistToggle}
                                className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isInWishlist(product.name) ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"
                                    }`}
                            >
                                <FaHeart size={20} className={isInWishlist(product.name) ? "animate-bounce" : ""} />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT SECTION: INFO */}
                    <div className="w-full lg:w-[45%] p-8 lg:p-14 lg:border-l border-gray-100 flex flex-col justify-between">
                        <div>
                            <p className="text-orange-400 text-[14px] font-black uppercase tracking-[4px] mb-2">{product.brand}</p>
                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <Rating rating={product.average_rating || 0} />
                                <span className="text-gray-400 font-bold">Based on {product.review_count || 0} reviews</span>
                            </div>
                            <div className="flex items-end gap-5 mb-8">
                                <p className="text-5xl font-black text-gray-900 tracking-tighter">
                                    ₹{product.price.toFixed(2)}
                                </p>
                                <p className="text-2xl font-bold text-gray-300 line-through mb-1.5">
                                    ₹{product.oldPrice.toFixed(2)}
                                </p>
                                <div className="px-3 py-1 bg-purple-100 text-purple-600 text-[11px] font-black uppercase tracking-[1px] rounded-lg mb-2">
                                    Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                                </div>
                            </div>
                            <div className="mb-10">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-4">Product Description</h4>
                                <p className="text-gray-500 text-lg leading-relaxed font-medium lg:max-w-sm">
                                    <span className="font-bold text-gray-900 block mb-2">Brand: {product.brand}</span>
                                    {product.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-6 mb-12">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px]">Quantity</h4>
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-1.5 shadow-inner">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-orange-400 transition-all font-bold"
                                    >
                                        <FaMinus size={12} />
                                    </button>
                                    <span className="w-12 text-center text-lg font-black text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-orange-400 transition-all font-bold"
                                    >
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-5 bg-white border-2 border-gray-900 text-gray-900 rounded-[24px] font-black text-lg transition-all hover:bg-gray-50 flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                                >
                                    <FaShoppingCart size={18} /> Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 py-5 bg-gradient-to-br from-orange-400 to-purple-500 text-white rounded-[24px] font-black text-lg shadow-xl shadow-orange-400/20 hover:shadow-orange-400/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <FaBolt size={18} /> Buy it Now
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8 mt-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FaTruck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 mb-0.5">Free Delivery</p>
                                        <p className="text-[12px] text-gray-500 font-medium">For orders over ₹500</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FaUndo size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 mb-0.5">30 Days Return</p>
                                        <p className="text-[12px] text-gray-500 font-medium">Easy return & exchange</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <div className="mt-12 bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 p-8 lg:p-14">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Customer Reviews</h2>
                            <div className="flex items-center gap-4">
                                <Rating rating={product.average_rating || 0} />
                                <span className="text-gray-400 font-bold">Based on {product.review_count || 0} reviews</span>
                            </div>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {reviews.length > 0 ? reviews.map((review, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 hover:border-orange-200 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-purple-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">
                                            {review.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900">{review.name}</h4>
                                            <p className="text-[11px] text-gray-400 font-black uppercase tracking-[1px]">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400 text-sm">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <FaStar key={i} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 font-medium leading-relaxed mb-4">
                                    "{review.comment}"
                                </p>
                                {review.image && (
                                    <div className="mt-4 rounded-2xl overflow-hidden h-32 w-32 border border-gray-200 shadow-sm">
                                        <img src={review.image} alt="Review" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </motion.div>
                        )) : (
                            <div className="col-span-2 text-center py-12">
                                <p className="text-gray-400 font-bold">No reviews yet. Be the first to review!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RELATED PRODUCTS SECTION */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-end justify-between mb-10 px-4 md:px-0">
                            <div className="space-y-2">
                                <p className="text-orange-400 font-black tracking-widest text-xs uppercase">More like this</p>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight">RELATED PRODUCTS</h3>
                            </div>
                            <button
                                onClick={() => navigate("/home")}
                                className="text-orange-400 font-bold hover:text-purple-600 transition-colors flex items-center gap-2 group"
                            >
                                View all <FaArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    item={item}
                                    navigate={navigate}
                                    handleWishlistClick={handleRelatedWishlist}
                                    handleAddToCartClick={handleRelatedAddToCart}
                                    isInWishlist={isInWishlist}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>



        </div>
    );
};

export default ProductDetails;

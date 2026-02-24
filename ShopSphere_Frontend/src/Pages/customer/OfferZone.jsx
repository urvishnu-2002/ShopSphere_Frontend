import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { fetchProducts } from "../../Store";

const OfferZone = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fashionProducts = useSelector((state) => state.products.fashion || []);
    const isLoading = useSelector((state) => state.products.isLoading);

    React.useEffect(() => {
        if (fashionProducts.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, fashionProducts.length]);

    const cart = useSelector((state) => state.cart || []);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Custom Header - Blue Header from Screenshot */}
            <header className="bg-[#2874f0] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <FaArrowLeft size={18} />
                    </button>
                    <h1 className="text-xl font-medium tracking-tight">Offer Zone</h1>
                </div>
                <div className="flex items-center gap-6">
                    <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <FaSearch size={18} />
                    </button>
                    <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
                        <FaShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#2874f0] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-4">
                {/* Sub-header */}
                <div className="px-4 py-2 border-b border-gray-200 bg-white">
                    <h2 className="text-sm font-semibold text-gray-800">
                        Best Value Deals on Fashion ({fashionProducts.length} Results)
                    </h2>
                </div>

                {/* Product Grid - Vertical Alignment as per screenshot */}
                <div className="grid grid-cols-2 gap-[1px] bg-gray-200">
                    {fashionProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="bg-white p-6 flex flex-col items-center cursor-pointer hover:shadow-inner transition-all group"
                        >
                            <div className="aspect-square w-full max-w-[200px] mb-4 flex items-center justify-center overflow-hidden">
                                <img
                                    src={product.image || "/Fashion/1.jpg"}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="text-sm text-gray-700 text-center font-medium line-clamp-1 w-full mb-1">
                                {product.name}
                            </h3>
                            <p className="text-[#26a541] text-sm font-semibold text-center">
                                {product.discount_percentage ? `Min. ${product.discount_percentage}% Off` : "Min. 50% Off"}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {fashionProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <p className="text-lg font-medium">No fashion deals available at the moment.</p>
                        <button
                            onClick={() => navigate("/home")}
                            className="mt-4 px-6 py-2 bg-[#2874f0] text-white rounded-md font-medium"
                        >
                            Return Home
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OfferZone;

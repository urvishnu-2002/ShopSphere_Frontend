import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DecrCart, IncrCart, RemoveFromCart, setCart } from "../../Store";
import { fetchCart, formatImageUrl, removeFromCart, updateCartQuantity } from "../../api/axios";
import toast from "react-hot-toast";
import {
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaReceipt,
} from "react-icons/fa";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartObjects = useSelector((state) => state.cart || []);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await fetchCart();
        if (cartData && cartData.items) {
          const formattedItems = cartData.items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: parseFloat(item.product.price),
            description: item.product.description,
            image: item.product.images && item.product.images.length > 0 ? formatImageUrl(item.product.images[0].image) : "/placeholder.jpg",
            quantity: item.quantity
          }));
          dispatch(setCart(formattedItems));
        }
      } catch (error) {
        console.error("Failed to load cart in Cart page:", error);
      }
    };

    loadCart();
  }, [dispatch]);

  const subtotal = cartObjects.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18; // 18% GST example
  const deliveryCharges = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const totalAmount = subtotal + tax + deliveryCharges;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Cart Items Area */}
          <div className="flex-grow lg:w-2/3">
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                <span className="bg-violet-600 text-white p-3 rounded-2xl shadow-lg shadow-violet-500/20">
                  🛒
                </span>{" "}
                Shopping Cart
              </h1>
              <span className="text-gray-400 font-bold bg-white px-5 py-2 rounded-full border border-gray-100 shadow-sm">
                {cartObjects.length} Items Selected
              </span>
            </div>

            {cartObjects && cartObjects.length > 0 ? (
              <div className="space-y-6">
                {cartObjects.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                  >
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-gray-50 rounded-[24px] overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-500 border border-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium mb-4 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="text-2xl font-black text-violet-600 flex items-center justify-center md:justify-start gap-2">
                        <span className="text-sm text-gray-400 font-bold">Price:</span> ₹{item.price}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-5 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                      <button
                        onClick={async () => {
                          try {
                            await updateCartQuantity(item.id, 'decrease');
                            dispatch(DecrCart(item));
                          } catch (err) {
                            toast.error(err.message || "Failed to update quantity");
                          }
                        }}
                        className="bg-white hover:bg-red-50 text-red-500 w-10 h-10 rounded-xl transition-all shadow-sm border border-gray-100 flex items-center justify-center font-black text-lg"
                        disabled={item.quantity <= 0}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="text-lg font-black text-gray-900 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={async () => {
                          try {
                            await updateCartQuantity(item.id, 'increase');
                            dispatch(IncrCart(item));
                          } catch (err) {
                            toast.error(err.message || "Failed to update quantity");
                          }
                        }}
                        className="bg-white hover:bg-purple-50 text-purple-500 w-10 h-10 rounded-xl transition-all shadow-sm border border-gray-100 flex items-center justify-center font-black text-lg"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[120px]">
                      <div className="text-xl font-black text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            await removeFromCart(item.id);
                            dispatch(RemoveFromCart(item));
                            toast.success("Removed from cart");
                          } catch (err) {
                            toast.error(err.message || "Failed to remove item");
                          }
                        }}
                        className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
                      >
                        <FaTrashAlt size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[40px] p-16 shadow-sm border border-gray-100 text-center">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8">
                  <FaReceipt size={64} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                  Your cart is empty 🏜️
                </h2>
                <p className="text-gray-400 mb-10 text-lg font-medium">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <button
                  onClick={() => navigate("/home")}
                  className="bg-gradient-to-br from-violet-600 to-purple-800 hover:from-violet-700 hover:to-purple-900 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-violet-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 mx-auto"
                >
                  Start Exploring Products <FaArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:w-[400px] flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">
                  Order Summary
                </h2>

                <div className="space-y-5 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold uppercase text-[11px] tracking-[1.5px]">
                      Subtotal
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-purple-500">
                    <span className="font-bold uppercase text-[11px] tracking-[1.5px]">
                      Shipping Fee
                    </span>
                    <span className="text-lg font-bold">
                      {deliveryCharges === 0 ? "FREE" : `₹${deliveryCharges.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold uppercase text-[11px] tracking-[1.5px]">
                      Estimated Tax (18%)
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-5 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-gray-900 font-black text-lg">Total</span>
                    <div className="text-right">
                      <div className="text-3xl font-black text-violet-600 leading-tight">
                        ₹{totalAmount.toFixed(2)}
                      </div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                        Including All Taxes
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  disabled={cartObjects.length === 0}
                  onClick={() => navigate("/checkout")}
                  className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${cartObjects.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-br from-violet-600 to-purple-800 text-white shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-1 active:scale-[0.98]"
                    }`}
                >
                  Checkout Now <FaArrowRight size={18} />
                </button>
              </div>

              {/* Trust Badge Card */}
              <div className="bg-gray-900 rounded-[32px] p-6 text-white shadow-xl shadow-gray-200">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-violet-400">
                    <FaShieldAlt size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-base mb-0.5">Safe & Secure Payment</h4>
                    <p className="text-gray-400 text-xs font-bold leading-relaxed">
                      100% Protection with ShopSphere Secure Checkout.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-[32px] p-6 border border-purple-50">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-500 shadow-sm">
                    <FaTruck size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-purple-900 text-base mb-0.5">Free Delivery</h4>
                    <p className="text-purple-700/60 text-xs font-bold leading-relaxed">
                      Orders above ₹1,000 qualify for free express delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;


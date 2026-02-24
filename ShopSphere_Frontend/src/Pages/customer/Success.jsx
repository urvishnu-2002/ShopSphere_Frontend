import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../../Store";
import { CheckCircle, ShoppingBag, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function Success() {
  const [order, setOrder] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("orderSuccess");
    if (data) {
      const parsedData = JSON.parse(data);
      setOrder(parsedData);
      // Clear the cart in Redux
      dispatch(clearCart());
      toast.success("Order confirmed! Thank you for shopping with us.", {
        id: "order-success-toast",
      });
    }
  }, [dispatch]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff]">
        <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4 animate-pulse"></div>
        <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest">No recent order</h2>
        <Link to="/" className="mt-6 text-orange-400 font-black hover:underline flex items-center gap-2">
          Return to Store <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white max-w-2xl w-full rounded-[48px] shadow-2xl shadow-gray-200/50 p-10 md:p-14 relative overflow-hidden text-center"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-purple-500 to-purple-600"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60"></div>

        <div className="relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-orange-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <CheckCircle className="text-orange-400 text-5xl" size={48} />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-gray-900 tracking-tight mb-4"
          >
            Order Confirmed! 🎉
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 font-bold text-lg max-w-md mx-auto leading-relaxed"
          >
            Your payment was successful and your order has been placed. We're getting it ready for you!
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 p-6 bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] rounded-[32px] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] block mb-1">Transaction Identity</span>
              <span className="text-sm font-black text-orange-400 font-mono">{order.transactionId}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] block mb-1 text-left md:text-right">Total Amount Paid</span>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate(`/track-order/${order.order_id || order.transactionId}`)}
              className="px-10 py-5 bg-gradient-to-r from-orange-400 to-purple-500 text-white font-black rounded-2xl shadow-xl shadow-orange-400/30 hover:shadow-orange-400/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
            >
              Track Your Order
              <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-10 py-5 bg-white text-gray-900 font-black rounded-2xl border-2 border-gray-100 hover:bg-gradient-to-br from-[#fff5f5] via-[#fef3f2] to-[#f3e8ff] transition-all flex items-center justify-center gap-3"
            >
              Back to Shopping
              <ExternalLink size={18} className="text-gray-400" />
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 text-[10px] text-gray-300 font-black uppercase tracking-[2px]"
          >
            A confirmation email has been sent to your inbox.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default Success;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Receipt,
  Calendar,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  AlertCircle,
  Truck,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchOrders } from "../../Store";

function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, isLoading, error } = useSelector((state) => state.order);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchOrders());
  }, [dispatch, navigate]);

  const toggleExpand = (transactionId) => {
    setExpandedOrder(expandedOrder === transactionId ? null : transactionId);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-500 font-black uppercase tracking-widest text-[10px] animate-pulse">
          Retrieving Orders...
        </p>
      </div>
    );
  }

  if (error) {
    const errorMessage = typeof error === 'string'
      ? error
      : error?.detail || error?.message || "Something went wrong. Please login again.";

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-100">
          <AlertCircle size={32} />
        
        </div>
        <h2 className="text-xl font-black text-gray-900">Oops! Something went wrong</h2>
        <p className="text-gray-400 font-bold text-center mt-2 max-w-xs">{errorMessage}</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-8 px-8 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-95"
        >
          Return to Login
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[40px] flex items-center justify-center mb-8 border border-gray-100">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">No Orders Found</h2>
        <p className="text-gray-400 font-bold text-center mt-3 max-w-sm leading-relaxed">
          Your order history is currently empty. Start shopping to fill it with amazing products!
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-10 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl"
        >
          Explore Shop <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
              <Receipt size={28} />
            </div>
            Order History
          </h1>
          <p className="text-gray-400 font-bold mt-2 ml-1">Managing {orders.length} orders across your history.</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={order.id || index}
            className="group bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-200/40 hover:border-blue-100"
          >
            {/* Order Header */}
            <div
              onClick={() => toggleExpand(order.id)}
              className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:bg-blue-50 transition-colors">
                  <Package size={28} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <p className="font-black text-gray-900 text-lg uppercase tracking-tight">
                      {order.transaction_id || `ORD-${order.id}`}
                    </p>
                    <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      PAID
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 font-bold flex items-center gap-2 uppercase tracking-widest">
                    <Calendar size={12} className="text-gray-300" />
                    {new Date(order.order_date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-t-0 pt-4 sm:pt-0">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[2px] mb-0.5">Grand Total</p>
                  <p className="text-2xl font-black text-blue-600 tracking-tighter">
                    ₹{order.totalAmount?.toFixed(2)}
                  </p>
                </div>

                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${expandedOrder === order.id ? "bg-gray-900 text-white rotate-180" : "bg-gray-50 text-gray-400"}`}>
                  <ChevronDown size={22} />
                </div>
              </div>
            </div>

            {/* Order Details */}
            <AnimatePresence>
              {expandedOrder === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="border-t border-gray-50 px-8 py-10 bg-gray-50/20">
                    <div className="flex items-center gap-3 mb-6">
                      <Truck size={16} className="text-blue-500" />
                      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[3px]">
                        Package Contents
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-white rounded-3xl p-5 border border-gray-100 shadow-sm transition-all hover:border-blue-100 group/item"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xs font-black text-gray-500 border border-gray-100 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:border-blue-600 transition-all">
                              {item.quantity}×
                            </div>
                            <div>
                              <span className="font-bold text-gray-800 text-sm block mb-0.5">
                                {item.product_name}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                Unit Price: ₹{Number(item.price).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <span className="font-black text-gray-900">
                            ₹{(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                          <AlertCircle size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1">Payment Info</p>
                          <p className="text-xs text-gray-400 font-medium">Method: {order.payment_mode}</p>
                          <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]">ID: {order.transaction_id || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full md:w-auto">
                        <button
                          className="flex-1 md:flex-none px-6 py-3 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
                        >
                          Need Help?
                        </button>
                        <button
                          className="flex-1 md:flex-none px-8 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                        >
                          Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Orders;

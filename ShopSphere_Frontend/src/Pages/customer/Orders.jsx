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
          <div className="absolute inset-0 border-4 border-violet-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
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
          className="mt-8 px-8 py-3 bg-violet-600 text-white font-black rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all active:scale-95"
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
            <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/20">
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
            className="group bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-200/40 hover:border-violet-100"
          >
            {/* Order Header */}
            <div
              onClick={() => toggleExpand(order.id)}
              className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-violet-600 shadow-inner group-hover:bg-violet-50 transition-colors">
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
                    <span className={`text-[9px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full border flex items-center gap-1.5 ${order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                      order.status === 'shipping' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        order.status === 'confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                      {order.status === 'pending' ? 'Wait' : order.status}
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
                  <p className="text-2xl font-black text-violet-600 tracking-tighter">
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
                      <Truck size={16} className="text-violet-500" />
                      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[3px]">
                        Package Contents
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {order.items?.map((item, idx) => {
                        const getStatusColor = (status) => {
                          switch (status) {
                            case 'waiting': return 'text-amber-500 bg-amber-50 border-amber-100';
                            case 'confirmed': return 'text-blue-500 bg-blue-50 border-blue-100';
                            case 'shipped': return 'text-purple-500 bg-purple-50 border-purple-100';
                            case 'out_for_delivery': return 'text-orange-500 bg-orange-50 border-orange-100';
                            case 'delivered': return 'text-green-500 bg-green-50 border-green-100';
                            case 'cancelled': return 'text-red-500 bg-red-50 border-red-100';
                            default: return 'text-gray-500 bg-gray-50 border-gray-100';
                          }
                        };

                        const getStatusLabel = (status) => {
                          switch (status) {
                            case 'waiting': return 'Wait';
                            case 'confirmed': return 'Order Confirmed';
                            case 'shipped': return 'Shipped';
                            case 'out_for_delivery': return 'Out for Delivery';
                            case 'delivered': return 'Delivered';
                            case 'cancelled': return 'Cancelled';
                            default: return status || 'Processing';
                          }
                        };

                        return (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-3xl p-5 border border-gray-100 shadow-sm transition-all hover:border-blue-100 group/item gap-4"
                          >
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xs font-black text-gray-500 border border-gray-100 group-hover/item:bg-violet-600 group-hover/item:text-white group-hover/item:border-violet-600 transition-all shrink-0">
                                {item.quantity}×
                              </div>
                              <div>
                                <span className="font-bold text-gray-800 text-sm block mb-0.5">
                                  {item.product_name}
                                </span>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    Price: ₹{Number(item.product_price || item.price).toFixed(2)}
                                  </span>
                                  <span className={`text-[9px] font-black uppercase tracking-[1px] px-2 py-0.5 rounded-full border ${getStatusColor(item.vendor_status)}`}>
                                    {getStatusLabel(item.vendor_status)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <span className="font-black text-gray-900 self-end sm:self-center">
                              ₹{(Number(item.product_price || item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Tracking History - Timeline View */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-8">
                        <Truck size={16} className="text-violet-500" />
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[3px]">
                          Order Journey
                        </h3>
                      </div>

                      <div className="space-y-8 relative ml-4">
                        {/* Vertical line connector */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                        {order.tracking_history && order.tracking_history.length > 0 ? (
                          order.tracking_history.map((track, tidx) => (
                            <div key={tidx} className="relative pl-10 group/status">
                              {/* Connector dot */}
                              <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white z-10 transition-all duration-500 ${tidx === 0 ? 'border-violet-600 scale-125 shadow-lg shadow-violet-200' : 'border-gray-200 group-hover/status:border-violet-400'}`}></div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${tidx === 0 ? 'text-violet-600' : 'text-gray-900 font-bold'}`}>
                                  {track.status === 'pending' ? 'Wait' :
                                    track.status === 'confirmed' ? 'Order Confirmed' :
                                      track.status === 'shipping' ? 'In Transit' :
                                        track.status.charAt(0).toUpperCase() + track.status.slice(1)}
                                </span>
                                <span className="text-[9px] font-bold text-gray-400">
                                  {new Date(track.timestamp).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 max-w-lg leading-relaxed">
                                {track.notes}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="pl-10 text-xs text-gray-400 font-bold italic">
                            Initial status: Processing order details...
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                          <AlertCircle size={18} className="text-violet-600" />
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

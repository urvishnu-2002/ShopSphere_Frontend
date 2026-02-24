import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Package,
    Warehouse,
    Ship,
    Truck,
    Box,
    ArrowLeft,
    Calendar,
    Clock
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import { fetchOrders } from "../../Store";

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const { orders, isLoading } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        if (orders.length === 0 && !isLoading) {
            dispatch(fetchOrders());
        }
    }, [dispatch, orders.length, isLoading]);

    // Find order from state
    useEffect(() => {
        const foundOrder = orders.find(o => String(o.id) === orderId || o.transaction_id === orderId || String(o.order_number) === orderId);
        if (foundOrder) {
            setOrder(foundOrder);
        }
    }, [orderId, orders]);



    const steps = [
        { id: "pending", label: "Order Placed", icon: <CheckCircle size={20} /> },
        { id: "confirmed", label: "Confirmed by Vendor", icon: <Warehouse size={20} /> },
        { id: "shipping", label: "In Transit", icon: <Ship size={20} /> },
        { id: "out_for_delivery", label: "Out for Delivery", icon: <Truck size={20} /> },
        { id: "delivered", label: "Delivered", icon: <Box size={20} /> },
    ];

    const getStatusIndex = (status) => {
        // Special mapping for delivery agent states
        if (status === 'out_for_delivery') return 3;
        const index = steps.findIndex(step => step.id === status);
        return index === -1 ? 0 : index;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-orange-400 font-bold animate-pulse">Syncing tracking data...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-center">
                <div className="max-w-md">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Box className="text-gray-300" size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-500 mb-8">We couldn't find an order with the ID <span className="text-orange-400 font-bold">#{orderId}</span>. Please verify the ID or check your order history.</p>
                    <button
                        onClick={() => navigate("/profile/orders")}
                        className="px-8 py-4 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                    >
                        Go to My Orders
                    </button>
                </div>
            </div>
        );
    }


    // Harmonize status field name (backend sends 'status', frontend was looking for 'order_status')
    const currentStatus = order.status || order.order_status || "pending";
    const currentStepIndex = getStatusIndex(currentStatus);
    const progressPercent = (currentStepIndex / (steps.length - 1)) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 pb-16 px-4 font-sans">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white rounded-full transition-colors group relative z-10"
                    >
                        <ArrowLeft className="text-gray-400 group-hover:text-gray-900" size={20} />
                    </button>
                    <div className="text-center flex-grow -ml-10">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                            ORDER TRACKING PAGE
                        </h1>
                        <p className="text-gray-400 text-sm font-bold mt-1">
                            Delivery dates are estimated and may change without prior notice
                        </p>
                    </div>
                </div>

                {/* Order Summary Section */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm mb-10 overflow-hidden">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Placed Date</p>
                            <p className="text-sm font-bold text-gray-900">
                                {new Date(order.created_at).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                            <p className="text-sm font-bold text-gray-900">₹{Number(order.total_amount).toFixed(2)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ship To</p>
                            <p className="text-sm font-bold text-gray-900">{order.customer_name || "Valued Customer"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                            <p className="text-sm font-bold text-orange-400 font-mono tracking-tighter">#{order.transaction_id || order.id}</p>
                        </div>
                    </div>
                </div>

                {/* Status Highlight Section */}
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-gray-900 font-bold text-xl tracking-tight">Order Status: </span>
                        <span className="text-emerald-500 font-black text-xl tracking-tight uppercase">
                            {steps[currentStepIndex].label}
                        </span>
                    </div>
                    <p className="text-gray-400 font-bold flex items-center justify-center gap-2">
                        <Calendar size={16} className="text-gray-300" />
                        Estimated Delivery Date: <span className="text-gray-900">{order.estimated_delivery || "29 Jul – 8 Aug"}</span>
                    </p>
                </div>

                {/* Tracking Progress Section */}
                <div className="relative mt-20 mb-32 px-4">
                    {/* Main Track Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>

                    {/* Completed Progress Line */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-400 to-purple-500 -translate-y-1/2 z-10"
                    ></motion.div>

                    {/* Truck Animation */}
                    <motion.div
                        initial={{ left: 0 }}
                        animate={{ left: `${progressPercent}%` }}
                        transition={{ duration: 1.5, ease: "backOut", delay: 0.5 }}
                        className="absolute top-1/2 -translate-y-11 -translate-x-1/2 z-20"
                        style={{ width: "fit-content" }}
                    >
                        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-gray-200 border border-gray-100 relative group animate-bounce-slow">
                            <Truck size={28} className="text-orange-400" />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100"></div>
                        </div>
                    </motion.div>

                    {/* Steps */}
                    <div className="flex justify-between relative z-10">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            const isFuture = index > currentStepIndex;

                            return (
                                <div key={step.id} className="flex flex-col items-center group">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isCompleted
                                            ? "bg-gradient-to-br from-orange-400 to-purple-500 border-white text-white shadow-lg shadow-purple-200 scale-110"
                                            : isCurrent
                                                ? "bg-white border-orange-400 text-orange-400 shadow-xl shadow-gray-200 scale-125 z-30"
                                                : "bg-white border-gray-200 text-gray-300"
                                            }`}
                                    >
                                        {isCompleted ? <CheckCircle size={18} /> : React.cloneElement(step.icon, { size: 18 })}
                                    </div>

                                    <div className="absolute -bottom-16 w-32 text-center pointer-events-none">
                                        <p className={`text-[10px] font-black uppercase tracking-widest mt-4 transition-colors duration-500 ${isFuture ? "text-gray-300" : "text-gray-900 font-black"
                                            }`}>
                                            {step.label}
                                        </p>
                                        {isCurrent && (
                                            <span className="text-[8px] font-black text-orange-400 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-tighter mt-1 inline-block">
                                                Active Step
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Delivery Details Details Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Box size={20} />
                            </div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Shipment Status</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold">Courier</span>
                                <span className="text-gray-900 font-black tracking-tight">ShopSphere Global Logistics</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold">Vessel</span>
                                <span className="text-gray-900 font-black tracking-tight">SS-EXPLORER-X</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-bold">Weight</span>
                                <span className="text-gray-900 font-black tracking-tight">2.5 KG</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-orange-50 text-orange-400 rounded-xl flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Latest Update</h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1 bg-orange-200 rounded-full"></div>
                            <div>
                                <p className="text-sm font-black text-gray-900 tracking-tight mb-1">Cleared Customs at Hub</p>
                                <p className="text-xs text-gray-400 font-bold leading-relaxed mb-1">
                                    Your package has successfully cleared international customs and is being loaded onto the main transit vessel.
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Clock size={12} className="text-orange-400" />
                                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">2 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-12 flex justify-center gap-4">
                    <button
                        onClick={() => navigate("/profile/orders")}
                        className="px-8 py-4 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                    >
                        View Order Details
                    </button>
                    <button
                        className="px-8 py-4 bg-white text-gray-900 text-[11px] font-black uppercase tracking-widest rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                        onClick={() => window.print()}
                    >
                        Print Tracking
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default OrderTracking;


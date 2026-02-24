import React from "react";
import { FaTimes, FaCalculator, FaCreditCard, FaTag, FaTrendingUp, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SettlementModal = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;

    const subtotal = parseFloat(item.price) * item.quantity;
    const commissionAmount = parseFloat(item.commission_amount) || 0;
    const netEarning = subtotal - commissionAmount;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-gray-900/40 backdrop-blur-xl" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[32px] md:rounded-[56px] w-full max-w-lg overflow-hidden shadow-3xl relative flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-8 md:p-10 bg-gray-900 text-white flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                                <FaCalculator size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-black tracking-tight italic uppercase">Payment Details</h3>
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[3px] mt-1">Ref: {item.order_id}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 md:p-4 hover:bg-white/10 rounded-2xl transition-all text-white"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10 space-y-8 md:space-y-10 max-h-[70vh] overflow-y-auto no-scrollbar">
                        {/* Item Summary */}
                        <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 bg-indigo-50/50 rounded-[28px] md:rounded-[32px] border border-indigo-50 relative overflow-hidden group">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 flex-shrink-0">
                                <FaCreditCard size={20} />
                            </div>
                            <div className="truncate">
                                <h4 className="text-base md:text-lg font-black text-gray-900 tracking-tight italic uppercase truncate">{item.product}</h4>
                                <p className="text-xs font-bold text-gray-500 mt-0.5">{item.quantity} Units × ₹{parseFloat(item.price).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm px-4">
                                <span className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Item Price Subtotal</span>
                                <span className="font-black text-gray-900 text-lg italic">₹{subtotal.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center p-5 md:p-6 bg-rose-50/50 rounded-2xl md:rounded-[28px] border border-rose-100 group transition-all">
                                <div className="flex items-center gap-3 md:gap-4 text-rose-500">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <FaTag size={12} />
                                    </div>
                                    <span className="text-rose-600 font-black uppercase tracking-widest text-[10px] italic">Platform Fee ({item.commission_rate}%)</span>
                                </div>
                                <span className="font-black text-rose-600 text-lg italic">- ₹{commissionAmount.toLocaleString()}</span>
                            </div>

                            <div className="pt-6 md:pt-8 border-t border-gray-100">
                                <div className="flex justify-between items-center bg-emerald-50/30 p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-emerald-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                                            <FaTrendingUp size={16} />
                                        </div>
                                        <span className="text-gray-900 font-black tracking-tight text-base md:text-lg uppercase italic">Your Profit</span>
                                    </div>
                                    <span className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tighter italic">₹{netEarning.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="bg-gray-50 p-5 md:p-6 rounded-[24px] md:rounded-[32px] border border-gray-100 flex gap-4 items-start">
                            <FaInfoCircle className="text-indigo-400 mt-1 flex-shrink-0" size={16} />
                            <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1 italic">Important Note</p>
                                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                                    Your earnings will be available to withdraw 7 days after the order is delivered.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 md:p-10 bg-gray-50 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="w-full py-5 md:py-6 bg-gray-900 text-white rounded-2xl md:rounded-[28px] font-black text-[10px] uppercase tracking-[4px] hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 italic"
                        >
                            Close Details
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SettlementModal;

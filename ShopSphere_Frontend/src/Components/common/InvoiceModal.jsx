import React from "react";
import {
    FaTimes,
    FaDownload,
    FaPrint,
    FaEnvelope,
    FaBuilding,
    FaUser,
    FaMapMarkerAlt,
    FaCreditCard,
    FaFileInvoice
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const InvoiceModal = ({ isOpen, onClose, order }) => {
    if (!order) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header / Actions */}
                        <div className="bg-gray-900 p-6 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                                    <FaFileInvoice size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black">Tax Invoice</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Receipt #{order.order_number}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <FaDownload size={14} /> Download
                                </button>
                                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <FaPrint size={14} /> Print
                                </button>
                                <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all">
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-grow overflow-y-auto p-8 md:p-12 font-sans">
                            {/* Top Section: Company & Bill To */}
                            <div className="grid md:grid-cols-2 gap-12 mb-12">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-8 bg-violet-600 rounded-full"></div>
                                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[4px]">From</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black text-gray-900">ShopSphere Inc.</h4>
                                        <div className="space-y-1 text-sm text-gray-500 font-bold">
                                            <p className="flex items-center gap-2"><FaBuilding className="text-gray-300" /> 123 Tech Square, Silicon Valley</p>
                                            <p>California, USA - 94025</p>
                                            <p className="flex items-center gap-2"><FaEnvelope className="text-gray-300" /> support@shopsphere.com</p>
                                            <p className="mt-4 pt-4 border-t border-gray-100 text-[10px] font-black text-violet-600 uppercase tracking-widest">GSTIN: 22AAAAA0000A1Z5</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[4px]">Bill To</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black text-gray-900">{order.customer_name || "Valued Customer"}</h4>
                                        <div className="space-y-1 text-sm text-gray-500 font-bold">
                                            <p className="flex items-center gap-2"><FaUser className="text-gray-300" /> {order.delivery_address?.name || "Customer"}</p>
                                            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-300" /> {order.delivery_address || "No address provided"}</p>
                                            <p className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                                <FaCreditCard /> Payment: {order.payment_method || "Paid Online"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="mb-12">
                                <div className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-100/50">
                                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                                                <th className="p-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</th>
                                                <th className="p-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Price</th>
                                                <th className="p-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {order.items?.map((item, idx) => (
                                                <tr key={idx} className="group">
                                                    <td className="p-6">
                                                        <p className="font-black text-gray-900 group-hover:text-violet-600 transition-colors">{item.product_name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">HSN: 8517</p>
                                                    </td>
                                                    <td className="p-6 text-center font-bold text-gray-600">{item.quantity}</td>
                                                    <td className="p-6 text-right font-bold text-gray-600">₹{parseFloat(item.product_price).toFixed(2)}</td>
                                                    <td className="p-6 text-right font-black text-gray-900">₹{parseFloat(item.subtotal).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="flex flex-col md:flex-row justify-between gap-12">
                                <div className="max-w-xs">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[3px] mb-4">Declaration</p>
                                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed italic">
                                        This is a computer generated invoice and does not require a physical signature. Returns are subject to terms and conditions.
                                    </p>
                                </div>

                                <div className="flex-grow max-w-sm space-y-3">
                                    <div className="flex justify-between text-sm font-bold text-gray-500 pb-2 border-b border-gray-50">
                                        <span>Subtotal</span>
                                        <span>₹{parseFloat(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-gray-500 pb-2 border-b border-gray-50">
                                        <span>Tax (GST 5%)</span>
                                        <span>₹{parseFloat(order.tax_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-gray-500 pb-2 border-b border-gray-50">
                                        <span>Shipping</span>
                                        <span>₹{parseFloat(order.shipping_cost || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4">
                                        <span className="text-xl font-black text-gray-900 tracking-tight">Total Amount</span>
                                        <div className="bg-violet-600 text-white px-6 py-2 rounded-2xl font-black text-xl shadow-xl shadow-violet-500/20">
                                            ₹{parseFloat(order.total_amount).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-6 text-center border-t border-gray-100 shrink-0">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Thank you for shopping with ShopSphere</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InvoiceModal;

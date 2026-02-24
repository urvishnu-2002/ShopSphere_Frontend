import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    ArrowLeft,
    Package,
    Truck,
    User,
    MapPin,
    CreditCard,
    Clock,
    Activity,
    CheckCircle2,
    Circle,
    PanelLeftClose,
    PanelLeftOpen,
    HelpCircle,
    ShieldCheck,
    Fingerprint,
    Banknote,
    Zap
} from 'lucide-react';
import { fetchAdminOrderDetail, triggerAssignment, updateDeliveryStatus, completeDeliveryOTP, logout } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [otpCode, setOtpCode] = useState('');

    useEffect(() => {
        const loadOrder = async () => {
            setIsLoading(true);
            try {
                const data = await fetchAdminOrderDetail(id);
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order details", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadOrder();
    }, [id]);

    const handleAssign = async () => {
        if (!id) return;
        setIsAssigning(true);
        try {
            const res = await triggerAssignment(id);
            alert(res.message);
            const data = await fetchAdminOrderDetail(id);
            setOrder(data);
        } catch (error) {
            console.error("Assignment failed", error);
            alert(error.response?.data?.error || "Failed to assign delivery agent.");
        } finally {
            setIsAssigning(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'shipping':
            case 'shipped': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'out_for_delivery': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    if (isLoading) {
        return (
            <div className={`flex h-screen items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className={`flex h-screen items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
                <div className="text-center">
                    <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${isDarkMode ? 'bg-slate-900 text-slate-700' : 'bg-slate-100 text-slate-300'}`}>
                        <HelpCircle size={40} />
                    </div>
                    <h2 className={`text-xl font-semibold uppercase tracking-normal mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Order Not Found</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-normal mb-6">This order does not exist in the system.</p>
                    <button onClick={() => navigate('/orders')} className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-semibold uppercase tracking-normal hover:bg-blue-500 transition-all">Back to Grid</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Orders" onLogout={logout} />

            <main className="flex-1 overflow-y-auto">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-40 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <button onClick={() => navigate(-1)} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'}`}>
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-lg font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Order #{order.order_number}</h1>
                                <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-normal ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>Active</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Order Details &amp; Delivery Status</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-[2.5rem] p-8 border flex flex-wrap items-center justify-between gap-8 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-2xl shadow-blue-500/5' : 'bg-white border-slate-100 shadow-sm'}`}
                    >
                        <div className="flex items-center gap-8">
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                <Package className="w-10 h-10" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-4 mb-3">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-normal border transition-all ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-normal">
                                        <Clock size={12} />
                                        {new Date(order.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <h2 className={`text-4xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{order.total_amount}</h2>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                                <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-2">Payment Method</p>
                                <p className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                                    <CreditCard className="w-4 h-4 text-blue-500" />
                                    {order.payment_method?.toUpperCase()}
                                </p>
                            </div>
                            <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                                <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-2">Payment Status</p>
                                <p className={`text-sm font-semibold uppercase tracking-normal ${order.payment_status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{order.payment_status}</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <section className={`rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <div className={`px-8 py-6 border-b flex items-center justify-between ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-[10px] font-semibold uppercase tracking-normal text-slate-500">Order Items</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-normal ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}`}>{order.items?.length} items</span>
                                </div>
                                <div className="p-8 space-y-4">
                                    {order.items?.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={`flex items-center justify-between p-6 rounded-3xl border transition-all group ${isDarkMode ? 'bg-slate-900/30 border-slate-800 hover:border-blue-500/30' : 'bg-slate-50 border-transparent hover:border-blue-200'}`}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={`w-16 h-16 rounded-2xl overflow-hidden border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm group-hover:scale-105'}`}>
                                                    {item.product_image ? (
                                                        <img
                                                            src={item.product_image.startsWith('http') ? item.product_image : `http://localhost:8000${item.product_image}`}
                                                            alt={item.product_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Package size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.product_name}</p>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-normal mt-1">Qty: <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{item.quantity}</span> × ₹{item.product_price}</p>
                                                </div>
                                            </div>
                                            <p className={`text-lg font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>₹{item.subtotal}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className={`p-8 border-t space-y-4 transition-colors ${isDarkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-slate-50/20 border-slate-100'}`}>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-normal">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-900'}>₹{order.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-normal">
                                        <span className="text-slate-500">Shipping</span>
                                        <span className="text-emerald-500">₹{order.shipping_cost}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-normal">
                                        <span className="text-slate-500">Tax</span>
                                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-900'}>₹{order.tax_amount}</span>
                                    </div>
                                    <div className={`pt-6 border-t border-dashed flex justify-between items-end ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                                        <span className="text-[10px] font-semibold uppercase tracking-normal text-slate-500">Total Amount</span>
                                        <span className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-blue-600'}`}>₹{order.total_amount}</span>
                                    </div>
                                </div>
                            </section>

                            <section className={`rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <div className={`px-8 py-6 border-b flex items-center justify-between ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-[10px] font-semibold uppercase tracking-normal text-slate-500">Tracking History</h3>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className={`relative pl-10 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 transition-colors ${isDarkMode ? 'before:bg-slate-800' : 'before:bg-slate-100'}`}>
                                        {order.tracking_history?.length > 0 ? (
                                            order.tracking_history.map((track, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="relative"
                                                >
                                                    <div className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full border-4 transition-all ${idx === 0 ? (isDarkMode ? 'bg-blue-500 border-slate-900 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-blue-600 border-white shadow-lg') : (isDarkMode ? 'bg-slate-800 border-slate-900' : 'bg-slate-100 border-white')}`} />
                                                    <div className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl border transition-all ${idx === 0 ? (isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100') : (isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-transparent')}`}>
                                                        <div>
                                                            <h4 className={`text-sm font-semibold uppercase tracking-normal ${idx === 0 ? (isDarkMode ? 'text-white' : 'text-blue-600') : 'text-slate-500'}`}>{track.status}</h4>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <MapPin size={12} className="text-blue-500 opacity-50" />
                                                                <p className={`text-[10px] font-bold uppercase tracking-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{track.location || "Central Hub"}</p>
                                                            </div>
                                                            {track.notes && <p className="text-xs text-slate-500 mt-3 font-medium leading-relaxed">"{track.notes}"</p>}
                                                        </div>
                                                        <div className={`mt-4 md:mt-0 text-[9px] font-semibold uppercase tracking-normal px-3 py-1.5 rounded-lg border flex items-center gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
                                                            <Clock size={10} />
                                                            {new Date(track.timestamp).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 opacity-50">
                                                <Zap className="mx-auto mb-4 text-slate-600" size={32} />
                                                <p className="text-[10px] font-semibold uppercase tracking-normal text-slate-500">No tracking history yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-8">
                            <section className={`rounded-[2.5rem] border p-8 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                        <Fingerprint className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">Customer Info</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-transparent'}`}>
                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-1">Customer Name</p>
                                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{order.customer_name || "Profile Anomaly"}</p>
                                    </div>
                                    <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-transparent'}`}>
                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-1">Email</p>
                                        <p className={`text-xs font-bold text-slate-500 truncate`}>{order.customer_email}</p>
                                    </div>
                                </div>
                            </section>

                            <section className={`rounded-[2.5rem] border p-8 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">Delivery Address</h3>
                                </div>
                                {order.delivery_address ? (
                                    <div className="space-y-4">
                                        <p className={`text-xs font-semibold uppercase tracking-normal ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{order.delivery_address.name}</p>
                                        <div className={`p-6 rounded-3xl border text-xs font-medium leading-relaxed transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-transparent text-slate-600'}`}>
                                            <p>{order.delivery_address.address_line1}</p>
                                            {order.delivery_address.address_line2 && <p className="mt-1">{order.delivery_address.address_line2}</p>}
                                            <p className="mt-1">{order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}</p>
                                        </div>
                                        <div className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                            <Zap size={14} />
                                            <span className="text-[10px] font-semibold tracking-normal">{order.delivery_address.phone}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-normal opacity-50">No address found</p>
                                )}
                            </section>

                            <section className={`rounded-[2.5rem] p-8 relative overflow-hidden transition-all duration-300 shadow-xl ${isDarkMode ? 'bg-blue-600/90 shadow-blue-500/10' : 'bg-slate-900 shadow-slate-200'}`}>
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Truck size={100} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-8">
                                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                            <ShieldCheck className="w-5 h-5 text-blue-300" />
                                        </div>
                                        <span className="text-[10px] font-semibold uppercase tracking-normal text-white/60">Delivery Agent</span>
                                    </div>

                                    <div className="space-y-8">
                                        {order.delivery_agent_name ? (
                                            <>
                                                <div className={`p-6 rounded-3xl border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/10 border-white/20'}`}>
                                                    <p className="text-[9px] font-semibold text-white/40 uppercase tracking-normal mb-2">Assigned Agent</p>
                                                    <p className="text-base font-semibold text-white">{order.delivery_agent_name}</p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[9px] font-semibold text-white/40 uppercase tracking-normal mb-1">Status</p>
                                                        <p className="text-[10px] font-semibold text-blue-300 uppercase tracking-normal">{order.delivery_assignment_status}</p>
                                                    </div>
                                                    {order.status === 'delivered' && (
                                                        <div className="px-3 py-1 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                                                            <p className="text-[8px] font-semibold text-emerald-400 uppercase tracking-normal">Delivery Complete</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <div className={`p-8 rounded-3xl border-2 border-dashed transition-colors ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
                                                <p className="text-[10px] text-white/60 text-center leading-relaxed">No delivery agent assigned yet.</p>
                                                {['shipped', 'shipping'].includes(order.status) && (
                                                    <button
                                                        onClick={handleAssign}
                                                        disabled={isAssigning}
                                                        className="w-full mt-6 py-4 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-white/10 disabled:text-white/20 rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                                                    >
                                                        {isAssigning ? <div className="w-4 h-4 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" /> : <Zap size={14} />}
                                                        Assign Delivery Agent
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className={`rounded-[2.5rem] border p-8 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                        <Banknote className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">Payment Info</h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-2">Transaction ID</p>
                                        <p className={`text-[10px] font-mono p-4 rounded-xl break-all transition-colors ${isDarkMode ? 'bg-slate-900/50 text-slate-400 border border-slate-800' : 'bg-slate-50 text-slate-600 border border-slate-100 shadow-inner'}`}>{order.transaction_id || "OFFLINE_CREDIT_NODE"}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal">System Core</p>
                                        <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>ShopSphere Admin v1.0</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderDetail;

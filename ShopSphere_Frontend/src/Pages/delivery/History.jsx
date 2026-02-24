import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBox,
    FaMapMarkerAlt,
    FaCheck,
    FaTruck,
    FaClock,
    FaCalendarAlt,
    FaUser,
    FaRupeeSign,
    FaTimesCircle
} from 'react-icons/fa';
import { fetchAssignedOrders } from '../../api/delivery_axios';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

export default function DeliveryHistory() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const loadHistory = async () => {
            try {
                // Fetch both delivered and failed orders
                const [delivered, failed] = await Promise.all([
                    fetchAssignedOrders('delivered'),
                    fetchAssignedOrders('failed')
                ]);

                const allHistory = [...delivered, ...failed].sort((a, b) =>
                    new Date(b.completed_at || b.assigned_at) - new Date(a.completed_at || a.assigned_at)
                );

                setHistory(allHistory);
            } catch (error) {
                toast.error('Failed to load history');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);

    if (loading) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isDarkMode ? 'border-white/5 border-t-orange-500' : 'border-slate-200 border-t-orange-500'}`}></div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading history records...</p>
            </div>
        );
    }

    return (
        <div className={`w-full min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            <header className={`px-4 md:px-8 py-8 md:py-10 border-b backdrop-blur-xl sticky top-0 z-20 mb-8 md:mb-10 transition-all ${isDarkMode ? 'bg-[#0f172a]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-left w-full md:w-auto">
                        <h1 className={`text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-4  uppercase transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                                <FaClock size={20} />
                            </div>
                            Past Deliveries
                        </h1>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mt-2 ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                            Work Archive
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 md:px-8">
                {history.length === 0 ? (
                    <div className={`text-center py-24 rounded-[48px] shadow-2xl border-2 border-dashed transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'}`}>
                        <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 border shadow-inner transition-colors ${isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <FaClock size={40} className={isDarkMode ? 'text-slate-800' : 'text-slate-300'} />
                        </div>
                        <h3 className={`text-2xl font-bold uppercase tracking-tight  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Records Found</h3>
                        <p className="text-gray-500 mt-3 font-medium max-w-sm mx-auto text-[10px] uppercase tracking-widest leading-relaxed">You haven't completed any deliveries yet. Start working to build your record.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:gap-8">
                        {history.map((order) => (
                            <div
                                key={order.id}
                                className={`rounded-[42px] p-6 md:p-8 shadow-2xl border transition-all duration-500 group relative overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-orange-500/20' : 'bg-white border-slate-100'}`}
                            >
                                <div className={`absolute top-0 right-0 w-2 h-full ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-red-500'} opacity-10`}></div>

                                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                    <div className="flex-1 w-full text-left">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider border ${order.status === 'delivered'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                {order.status === 'delivered' ? 'Success' : 'Failed'}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>ID #{order.id}</span>
                                        </div>

                                        <h3 className={`text-xl md:text-2xl font-bold mb-2 flex items-center gap-4  tracking-tight uppercase transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all border shadow-inner ${isDarkMode ? 'bg-[#0f172a] text-indigo-400 border-white/5' : 'bg-slate-50 text-orange-500 border-slate-200'}`}>
                                                <FaBox size={16} />
                                            </div>
                                            {order.customer_name}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-6 mt-6">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <FaMapMarkerAlt className="w-3.5 h-3.5 text-rose-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{order.delivery_city}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <FaCalendarAlt className="w-3.5 h-3.5 text-indigo-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {new Date(order.completed_at || order.assigned_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <FaBox className="w-3.5 h-3.5 text-amber-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{order.items?.length || 0} Items</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`flex flex-col md:flex-row items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l pt-8 md:pt-0 md:pl-10 transition-colors ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                                        <div className="text-center md:text-right min-w-[120px]">
                                            <div className="flex items-baseline justify-center md:justify-end gap-1">
                                                <span className="text-sm font-bold text-emerald-500/30  font-sans">₹</span>
                                                <span className="text-3xl font-bold text-emerald-400 tracking-tight ">
                                                    {parseFloat(order.delivery_fee || 0).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mt-1 ">Earnings</p>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/delivery/order/${order.id}`)}
                                            className={`w-full md:w-auto px-10 py-4 border rounded-[24px] font-bold uppercase tracking-wider text-[10px] transition-all active:scale-95  ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-orange-500 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white'}`}
                                        >
                                            View Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

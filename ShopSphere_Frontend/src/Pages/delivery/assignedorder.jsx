import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaStore,
    FaMapMarkerAlt,
    FaCheck,
    FaPhoneAlt,
    FaDirections,
    FaBox,
    FaListUl,
    FaDotCircle,
    FaTruck,
    FaShippingFast,
    FaTimesCircle,
    FaChevronRight,
    FaLock,
    FaKey,
} from 'react-icons/fa';
import {
    fetchAssignedOrders,
    completeDelivery,
    acceptOrder as apiAcceptOrder,
    rejectOrder as apiRejectOrder,
    markPickedUp,
    markInTransit,
    markArrived,
    failDelivery,
} from '../../api/delivery_axios';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

// ─── Status pipeline ───────────────────────────────────────────────────────────
const STEPS = [
    { key: 'assigned', label: 'Assigned', icon: FaDotCircle },
    { key: 'accepted', label: 'Accepted', icon: FaCheck },
    { key: 'picked_up', label: 'Picked Up', icon: FaBox },
    { key: 'in_transit', label: 'In Transit', icon: FaShippingFast },
    { key: 'arrived', label: 'Arrived', icon: FaMapMarkerAlt },
    { key: 'delivered', label: 'Delivered', icon: FaTruck },
];

const STATUS_INDEX = Object.fromEntries(STEPS.map((s, i) => [s.key, i]));

function StatusStepper({ currentStatus, isDarkMode }) {
    const currentIdx = STATUS_INDEX[currentStatus] ?? 0;
    const isFailed = currentStatus === 'failed';

    return (
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
            {STEPS.map((step, idx) => {
                const done = !isFailed && idx <= currentIdx;
                const active = !isFailed && idx === currentIdx;
                return (
                    <div key={step.key} className="flex items-center gap-3 flex-shrink-0">
                        <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-[18px] text-[10px] font-bold uppercase tracking-wider transition-all duration-500 border ${active ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 border-indigo-400 scale-105' :
                            done ? 'bg-orange-500/10 text-emerald-400 border-emerald-500/20' :
                                isDarkMode ? 'bg-white/5 text-slate-600 border-white/5' : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}>
                            <step.icon className={`w-3.5 h-3.5 ${active ? 'animate-pulse' : ''}`} />
                            {step.label}
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className={`w-4 h-[2px] rounded-full ${done && !active ? 'bg-emerald-500/20' : isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}></div>
                        )}
                    </div>
                );
            })}
            {isFailed && (
                <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-[18px] text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-lg shadow-rose-900/20 scale-105">
                    <FaTimesCircle className="w-4 h-4" /> Delivery Failed
                </div>
            )}
        </div>
    );
}

// ─── OTP Input panel ───────────────────────────────────────────────────────────
function OtpDeliveryPanel({ orderId, loading, onConfirm, isDarkMode }) {
    const [digits, setDigits] = useState(['', '', '', '', '', '']);

    const handleDigit = (idx, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...digits];
        next[idx] = val;
        setDigits(next);
        if (val && idx < 5) {
            document.getElementById(`otp-${orderId}-${idx + 1}`)?.focus();
        }
    };

    const handleKeyDown = (idx, e) => {
        if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
            document.getElementById(`otp-${orderId}-${idx - 1}`)?.focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste.length === 6) {
            setDigits(paste.split(''));
            document.getElementById(`otp-${orderId}-5`)?.focus();
        }
    };

    const otp = digits.join('');
    const isComplete = otp.length === 6;

    return (
        <div className={`rounded-[42px] p-8 md:p-10 mt-10 border relative overflow-hidden group shadow-2xl transition-all ${isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
                <div className="text-left w-full md:w-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center backdrop-blur-xl transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                            <FaKey className="text-indigo-400" size={20} />
                        </div>
                        <div>
                            <p className={`font-bold text-xl tracking-tight  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Enter Security PIN</p>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mt-1 ">Ask the customer for their OTP</p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto flex flex-col gap-6" onPaste={handlePaste}>
                    <div className="flex gap-2 min-[400px]:gap-3 justify-center md:justify-end">
                        {digits.map((d, idx) => (
                            <input
                                key={idx}
                                id={`otp-${orderId}-${idx}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={d}
                                onChange={e => handleDigit(idx, e.target.value)}
                                onKeyDown={e => handleKeyDown(idx, e)}
                                className={`w-10 h-12 min-[400px]:w-12 min-[400px]:h-14 text-center text-xl min-[400px]:text-2xl font-bold border rounded-2xl outline-none transition-all  shadow-inner ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-indigo-400 focus:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500 focus:bg-white'}`}
                            />
                        ))}
                    </div>

                    <button
                        disabled={!isComplete || loading}
                        onClick={() => onConfirm(orderId, otp)}
                        className="w-full py-4 md:py-5 bg-orange-500 hover:bg-orange-500 text-white font-bold uppercase tracking-wider text-[10px] md:text-[11px] rounded-[24px] hover:scale-[1.02] transition-all shadow-xl shadow-indigo-900/40 disabled:opacity-20 flex items-center justify-center gap-4 active:scale-95 "
                    >
                        {loading ? (
                            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                        ) : (
                            <>Complete Delivery <FaChevronRight size={10} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AssignedOrders() {
    const navigate = useNavigate();
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const { isDarkMode } = useTheme();

    const loadDeliveries = async () => {
        try {
            setLoading(true);
            const data = await fetchAssignedOrders('assigned');
            setActiveDeliveries(data);
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('Account restricted.');
                localStorage.removeItem('accessToken');
                navigate('/delivery');
            } else {
                toast.error('Failed to load orders');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDeliveries(); }, []);

    const runAction = async (id, label, apiFn, ...args) => {
        setActionLoading(prev => ({ ...prev, [id]: true }));
        try {
            await apiFn(id, ...args);
            if (label === 'In Transit') {
                toast.success('OTP sent to customer! 📧');
            } else {
                toast.success(`${label} Success!`);
            }
            loadDeliveries();
        } catch (error) {
            toast.error(error.response?.data?.error || `Failed: ${label}`);
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleOtpDelivery = async (id, otp) => {
        setActionLoading(prev => ({ ...prev, [id]: true }));
        try {
            await completeDelivery(id, { otp_code: otp });
            toast.success('🎉 Delivery completed successfully!');
            loadDeliveries();
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to verify OTP';
            toast.error(msg);
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    if (loading) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-[60vh] gap-4 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isDarkMode ? 'border-white/5 border-t-orange-500' : 'border-slate-200 border-t-orange-500'}`}></div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Checking active orders...</p>
            </div>
        );
    }

    return (
        <div className={`w-full min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            <header className={`px-4 md:px-8 py-8 mb-8 border-b backdrop-blur-xl sticky top-0 z-20 transition-all ${isDarkMode ? 'bg-[#0f172a]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-left w-full md:w-auto">
                        <h1 className={`text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-4  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                                <FaShippingFast size={20} />
                            </div>
                            Active Deliveries
                        </h1>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mt-2 ml-1 flex items-center gap-2  ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                            Live Tracker
                        </p>
                    </div>
                    <div className={`px-6 py-2.5 rounded-full border backdrop-blur-sm self-stretch md:self-center flex items-center justify-center gap-3 transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {activeDeliveries.length} Active Orders
                        </span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {activeDeliveries.length === 0 ? (
                    <div className={`max-w-xl mx-auto text-center py-20 rounded-[48px] border-2 border-dashed shadow-2xl transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'}`}>
                        <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center mx-auto mb-8 border shadow-inner transition-colors ${isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <FaTruck size={32} className={isDarkMode ? 'text-slate-800' : 'text-slate-300'} />
                        </div>
                        <h3 className={`text-2xl font-bold uppercase tracking-tight mb-4  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Orders Assigned</h3>
                        <p className="text-gray-500 font-bold mb-10 max-w-xs mx-auto text-[10px] uppercase tracking-widest leading-relaxed">Wait for the admin to assign you a delivery mission.</p>
                        <button
                            onClick={() => navigate('/delivery/dashboard')}
                            className="px-10 py-5 bg-orange-500 text-white rounded-3xl font-bold uppercase tracking-wider text-[10px] hover:bg-orange-500 transition-all shadow-xl shadow-orange-500/20 "
                        >
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {activeDeliveries.map((order) => (
                            <div key={order.id} className={`group rounded-[48px] md:rounded-[64px] p-6 md:p-14 shadow-2xl border transition-all duration-700 relative overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-orange-500/20' : 'bg-white border-slate-100'}`}>
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className={`relative flex flex-col lg:flex-row justify-between items-start mb-10 gap-8 pb-10 border-b transition-colors ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                                    <div className="flex items-center gap-6 md:gap-8">
                                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[32px] md:rounded-[38px] flex items-center justify-center shadow-inner border transition-all ${isDarkMode ? 'bg-[#0f172a] text-indigo-400 border-white/10 group-hover:bg-orange-500 group-hover:text-white' : 'bg-slate-50 text-orange-500 border-slate-100 group-hover:bg-slate-900 group-hover:text-white'}`}>
                                            <FaBox size={32} className="md:size-[40px]" />
                                        </div>
                                        <div className="text-left">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-2">
                                                <h2 className={`text-2xl md:text-4xl font-bold tracking-tight uppercase  truncate max-w-[200px] md:max-w-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{order.customer_name}</h2>
                                                <span className="px-4 py-1.5 bg-orange-500 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider w-fit shadow-lg shadow-indigo-900/40">
                                                    #{order.id}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ">Current Status: {order.status.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`lg:text-right w-full lg:w-auto p-8 lg:p-0 rounded-[32px] md:rounded-[42px] border lg:border-none transition-all ${isDarkMode ? 'bg-emerald-500/5 border-orange-500/10' : 'bg-emerald-50 border-emerald-100'}`}>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 ">Delivery Fee</p>
                                        <div className="text-4xl md:text-6xl font-bold text-emerald-400 tracking-tight flex items-center justify-center lg:justify-end ">
                                            <span className="text-2xl font-bold text-emerald-500/30 mr-1 mt-1">₹</span>
                                            {order.delivery_fee}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
                                    <div className="space-y-8 w-full text-left">
                                        <div className={`rounded-[40px] p-8 md:p-10 border transition-all w-full text-left shadow-inner ${isDarkMode ? 'bg-white/5 border-white/5 group-hover:bg-white/5' : 'bg-slate-50 border-slate-100 group-hover:bg-slate-50/80'}`}>
                                            <h3 className="text-[10px] font-bold uppercase text-gray-600 tracking-wider mb-8 flex items-center gap-3 ">
                                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                                Address Details
                                            </h3>
                                            <div className={`relative pl-10 space-y-12 border-l-2 border-dashed ml-4 transition-colors ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                                                <div className="relative text-left">
                                                    <div className="absolute -left-[57px] bg-emerald-600 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg">
                                                        <FaStore className="text-white w-3 h-3" />
                                                    </div>
                                                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider mb-2 ">Pickup (Store)</p>
                                                    <p className={`font-bold text-sm md:text-base leading-snug tracking-tight uppercase  ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{order.pickup_address}</p>
                                                </div>
                                                <div className="relative text-left">
                                                    <div className="absolute -left-[57px] bg-orange-500 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                                                        <FaMapMarkerAlt className="text-white w-3 h-3" />
                                                    </div>
                                                    <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider mb-2 ">Delivery (Customer)</p>
                                                    <p className={`font-bold text-lg md:text-2xl tracking-tight  leading-snug uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{order.delivery_address}</p>
                                                    <p className="text-gray-500 font-bold text-[10px] tracking-wider mt-2 uppercase">{order.delivery_city}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between gap-8 md:gap-10">
                                        <div className={`rounded-[40px] p-8 md:p-10 border transition-all w-full text-left shadow-inner ${isDarkMode ? 'bg-white/5 border-white/5 group-hover:bg-white/5' : 'bg-slate-50 border-slate-100 group-hover:bg-slate-50/80'}`}>
                                            <h3 className="text-[10px] font-bold uppercase text-gray-600 tracking-wider mb-8 flex items-center gap-3 ">
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                                Package Content
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                {order.items ? order.items.map((item, idx) => (
                                                    <div key={idx} className={`flex items-center justify-between p-5 rounded-[20px] md:rounded-[24px] border shadow-inner transition-all hover:scale-[1.01] hover:border-orange-500/20 group/item ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs uppercase  border transition-colors ${isDarkMode ? 'bg-white/5 text-slate-500 border-white/5 group-hover/item:text-indigo-400' : 'bg-slate-50 text-slate-400 border-slate-200 group-hover/item:text-orange-500'}`}>
                                                                {item.quantity}×
                                                            </div>
                                                            <span className={`font-bold text-base tracking-tight  uppercase truncate max-w-[120px] sm:max-w-none ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{item.product_name}</span>
                                                        </div>
                                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                    </div>
                                                )) : (
                                                    <div className="text-center py-6">
                                                        <p className="text-gray-700 text-[10px] font-bold uppercase tracking-wider ">No items found</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                                                {order.status !== 'assigned' && order.status !== 'arrived' ? (
                                                    <button
                                                        disabled={actionLoading[order.id]}
                                                        onClick={() => {
                                                            const nextStatusActions = {
                                                                'accepted': { label: 'Pick Up', fn: markPickedUp },
                                                                'picked_up': { label: 'In Transit', fn: markInTransit },
                                                                'in_transit': { label: 'Arrived', fn: markArrived },
                                                            };
                                                            const action = nextStatusActions[order.status];
                                                            if (action) runAction(order.id, action.label, action.fn);
                                                        }}
                                                        className="flex-1 py-5 md:py-6 bg-orange-500 text-white font-bold uppercase tracking-wider text-[10px] md:text-[11px] rounded-[24px] md:rounded-[32px] hover:bg-orange-500 transition-all active:scale-95 disabled:opacity-50  shadow-xl shadow-indigo-900/20"
                                                    >
                                                        {actionLoading[order.id] ? (
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                                                        ) : (
                                                            <>Next Step: {
                                                                order.status === 'accepted' ? 'Confirm Pick Up' :
                                                                    order.status === 'picked_up' ? 'Start Journey' :
                                                                        order.status === 'in_transit' ? 'Confirm Arrival' : ''
                                                            }</>
                                                        )}
                                                    </button>
                                                ) : order.status === 'arrived' ? (
                                                    <p className="text-indigo-400 font-bold text-sm  animate-pulse tracking-wider text-center w-full uppercase">Enter OTP Below to Finish ↓</p>
                                                ) : (
                                                    <button
                                                        disabled={actionLoading[order.id]}
                                                        onClick={() => runAction(order.id, 'Accept Order', apiAcceptOrder)}
                                                        className="flex-1 py-5 md:py-6 bg-orange-500 text-white font-bold uppercase tracking-wider text-[11px] md:text-[12px] rounded-[24px] md:rounded-[32px] hover:bg-orange-500 transition-all active:scale-95 disabled:opacity-50  shadow-2xl shadow-indigo-900/40"
                                                    >
                                                        {actionLoading[order.id] ? (
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                                                        ) : (
                                                            <>Accept This Job</>
                                                        )}
                                                    </button>
                                                )}

                                                {order.status === 'assigned' && (
                                                    <button
                                                        disabled={actionLoading[order.id]}
                                                        onClick={() => runAction(order.id, 'Reject Order', apiRejectOrder)}
                                                        className={`flex-none px-10 py-5 md:py-6 border font-bold uppercase tracking-wider text-[10px] rounded-[24px] md:rounded-[32px] transition-all active:scale-95 disabled:opacity-50  ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-500' : 'bg-white border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600'}`}
                                                    >
                                                        Decline
                                                    </button>
                                                )}
                                            </div>

                                            {order.status !== 'assigned' && <StatusStepper currentStatus={order.status} isDarkMode={isDarkMode} />}

                                            {order.status === 'arrived' && (
                                                <OtpDeliveryPanel
                                                    orderId={order.id}
                                                    loading={actionLoading[order.id]}
                                                    onConfirm={handleOtpDelivery}
                                                    isDarkMode={isDarkMode}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

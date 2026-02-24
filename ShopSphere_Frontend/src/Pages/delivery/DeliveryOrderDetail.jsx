import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaMapMarkerAlt,
    FaCheck,
    FaPhoneAlt,
    FaDirections,
    FaBox,
    FaListUl,
    FaShippingFast,
    FaTruck,
    FaArrowLeft,
    FaExclamationTriangle,
    FaTimes,
    FaLock,
} from 'react-icons/fa';
import {
    fetchAssignedOrders,
    completeDelivery,
    markPickedUp,
    markInTransit,
    markArrived,
    failDelivery,
    acceptOrder as apiAcceptOrder
} from '../../api/delivery_axios';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

// ─── Status Stepper ─────────────────────────────────────────────────────────────
function StatusStepper({ currentStatus, isDarkMode }) {
    const STEPS = [
        { key: 'assigned', label: 'Assigned' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'picked_up', label: 'Picked Up' },
        { key: 'in_transit', label: 'In Transit' },
        { key: 'arrived', label: 'Arrived' },
        { key: 'delivered', label: 'Delivered' },
    ];
    const STATUS_INDEX = Object.fromEntries(STEPS.map((s, i) => [s.key, i]));
    const currentIdx = STATUS_INDEX[currentStatus] ?? 0;
    const isFailed = currentStatus === 'failed';

    return (
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
            {STEPS.map((step, idx) => {
                const done = !isFailed && idx <= currentIdx;
                const active = !isFailed && idx === currentIdx;
                return (
                    <div key={step.key} className="flex items-center gap-2 flex-shrink-0">
                        <div className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all duration-500 border
                            ${active
                                ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 border-indigo-400/30 scale-105'
                                : done
                                    ? 'bg-orange-500/10 text-emerald-400 border-emerald-500/20'
                                    : isDarkMode
                                        ? 'bg-white/5 text-slate-600 border-white/5 opacity-60'
                                        : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                            }`}>
                            {step.label}
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className={`w-4 h-0.5 rounded-full ${done && !active ? 'bg-emerald-500/50' : isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                        )}
                    </div>
                );
            })}
            {isFailed && (
                <div className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Failed / Cancelled
                </div>
            )}
        </div>
    );
}

export default function DeliveryOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [issueText, setIssueText] = useState('');
    const { isDarkMode } = useTheme();

    const loadDetail = async () => {
        try {
            const data = await fetchAssignedOrders();
            const found = data.find(a => a.id === parseInt(id));
            if (found) {
                setAssignment(found);
            } else {
                toast.error("Order not found");
                navigate('/delivery/dashboard');
            }
        } catch (error) {
            toast.error("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDetail(); }, [id]);

    const handleAction = async (label, apiFn, customData = null) => {
        setActionLoading(true);
        try {
            if (customData) {
                await apiFn(id, customData);
            } else {
                await apiFn(id);
            }
            toast.success(`${label} successful!`);
            loadDetail();
            if (label === 'Report Issue') {
                setShowIssueModal(false);
                setIssueText('');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || `${label} failed`);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className={`p-20 text-center flex flex-col items-center justify-center min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            <div className={`w-16 h-16 border-4 rounded-full animate-spin ${isDarkMode ? 'border-white/5 border-t-indigo-500' : 'border-slate-200 border-t-orange-500'}`}></div>
            <p className={`mt-6 text-[11px] font-bold uppercase tracking-wider animate-pulse  ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading order details...</p>
        </div>
    );
    if (!assignment) return null;

    return (
        <div className={`w-full min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            {/* Page Header */}
            <div className={`px-4 md:px-8 py-6 border-b backdrop-blur-xl sticky top-0 z-20 mb-8 transition-all ${isDarkMode ? 'bg-[#0f172a]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className={`group flex items-center gap-3 transition-all uppercase text-[10px] tracking-wider font-bold  ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:bg-orange-500 group-hover:border-indigo-500' : 'bg-slate-50 border-slate-200 group-hover:bg-white group-hover:border-orange-500'}`}>
                            <FaArrowLeft size={10} />
                        </div>
                        Back
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className={`rounded-[32px] md:rounded-[40px] p-5 md:p-10 shadow-2xl border relative overflow-hidden transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                    {/* Subtle grain */}
                    <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:24px_24px]"></div>

                    {/* Header Section */}
                    <div className={`relative flex flex-col md:flex-row justify-between items-start mb-8 md:mb-12 gap-6 border-b pb-8 md:pb-12 transition-colors ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${isDarkMode ? 'bg-white/10 text-white border-white/10' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                    Order #{assignment.id}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${assignment.status === 'delivered' ? 'bg-orange-500/10 text-emerald-400 border-emerald-500/20' :
                                    assignment.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                        'bg-orange-500/10 text-indigo-400 border-orange-500/20'
                                    }`}>
                                    {assignment.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <h1 className={`text-3xl md:text-5xl font-bold tracking-tight leading-tight  transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {assignment.customer_name}
                            </h1>
                            <p className={`text-[11px] font-bold uppercase tracking-wider  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Order Ref: #{assignment.order_id}</p>
                        </div>
                        <div className={`p-6 md:p-8 rounded-[28px] text-center w-full md:w-auto shadow-2xl transition-all ${isDarkMode ? 'bg-orange-500 shadow-orange-500/30' : 'bg-slate-900 shadow-slate-200'}`}>
                            <div className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-1">₹{assignment.delivery_fee}</div>
                            <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider ">Your Earnings</p>
                        </div>
                    </div>

                    {/* Stepper */}
                    <StatusStepper currentStatus={assignment.status} isDarkMode={isDarkMode} />

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                        {/* Left: Routes & Items */}
                        <div className="space-y-10 md:space-y-12">
                            {/* Route */}
                            <section>
                                <h3 className={`text-[9px] font-bold uppercase tracking-wider mb-6 flex items-center gap-3  transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                                    Delivery Route
                                </h3>
                                <div className={`space-y-8 relative pl-8 md:pl-10 border-l-2 border-dashed ml-3 md:ml-4 transition-colors ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                                    <div className="relative">
                                        <div className={`absolute -left-[39px] md:-left-[51px] bg-emerald-500 w-7 h-7 md:w-8 md:h-8 rounded-full border-4 shadow-lg flex items-center justify-center transition-all ${isDarkMode ? 'border-[#0f172a]' : 'border-white'}`}>
                                            <FaCheck className="text-white w-3 h-3" />
                                        </div>
                                        <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mb-1.5 ">Pickup From</p>
                                        <p className={`font-bold leading-relaxed text-sm transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{assignment.pickup_address}</p>
                                    </div>
                                    <div className="relative">
                                        <div className={`absolute -left-[42px] md:-left-[55px] w-7 h-7 md:w-8 md:h-8 rounded-full border-4 shadow-xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-[#0f172a] border-indigo-500 ring-4 ring-orange-500/10' : 'bg-white border-orange-500 ring-4 ring-indigo-100'}`}>
                                            <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse"></div>
                                        </div>
                                        <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mb-1.5 ">Deliver To</p>
                                        <p className={`font-bold text-xl md:text-2xl tracking-tight mb-1  transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{assignment.delivery_address}</p>
                                        <p className={`font-bold text-xs tracking-widest uppercase transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{assignment.delivery_city}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Order Items */}
                            <section className={`rounded-[32px] md:rounded-[40px] p-6 md:p-10 border shadow-inner transition-all ${isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                <h3 className={`text-[9px] font-bold uppercase tracking-wider mb-6 flex items-center gap-3  transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                    <FaListUl className="text-indigo-400" size={12} /> Package Items
                                </h3>
                                <div className="space-y-3">
                                    {assignment.items?.map((item, idx) => (
                                        <div key={idx} className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-orange-500/20' : 'bg-white border-slate-100 hover:border-indigo-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-lg">
                                                    {item.quantity}×
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm block tracking-tight  transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.product_name}</span>
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest  transition-colors ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>Verified</span>
                                                </div>
                                            </div>
                                            <span className={`font-bold tracking-tight transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right: Actions */}
                        <div className="space-y-8 md:space-y-10">
                            {/* Contact Buttons */}
                            <div className={`rounded-[32px] md:rounded-[40px] p-7 md:p-10 text-white shadow-2xl relative overflow-hidden group transition-all ${isDarkMode ? 'bg-orange-500 shadow-orange-500/30' : 'bg-slate-900 shadow-slate-200'}`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                <h4 className="text-[9px] font-bold uppercase tracking-wider opacity-50 mb-8 text-center ">Customer Contact</h4>
                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <a
                                        href={`tel:${assignment.customer_contact}`}
                                        className="flex flex-col items-center justify-center p-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-[24px] transition-all gap-3 group/btn"
                                    >
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                                            <FaPhoneAlt size={18} />
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest ">Call</span>
                                    </a>
                                    <button className="flex flex-col items-center justify-center p-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-[24px] transition-all gap-3 group/btn">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                                            <FaDirections size={18} />
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest ">Navigate</span>
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                {assignment.status === 'assigned' && (
                                    <div className={`p-7 md:p-10 rounded-[32px] md:rounded-[40px] border text-center transition-all ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-orange-500'}`}>
                                        <p className="text-[10px] font-bold uppercase tracking-wider mb-6 ">New Job Available</p>
                                        <button
                                            disabled={actionLoading}
                                            onClick={() => handleAction('Accept', apiAcceptOrder)}
                                            className="w-full py-5 bg-orange-500 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-2xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase tracking-widest "
                                        >
                                            Accept Job
                                        </button>
                                    </div>
                                )}

                                {assignment.status === 'accepted' && (
                                    <button
                                        disabled={actionLoading}
                                        onClick={() => handleAction('Pick Up', markPickedUp)}
                                        className={`w-full py-6 font-bold text-[11px] uppercase tracking-widest rounded-2xl border transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95  ${isDarkMode ? 'bg-white/10 hover:bg-white/15 text-white border-white/10' : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700'}`}
                                    >
                                        <FaBox className="text-indigo-300" /> Mark as Picked Up
                                    </button>
                                )}

                                {assignment.status === 'picked_up' && (
                                    <button
                                        disabled={actionLoading}
                                        onClick={() => handleAction('In Transit', markInTransit)}
                                        className="w-full py-6 bg-orange-500 hover:bg-indigo-500 text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-orange-500/30 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 "
                                    >
                                        <FaShippingFast /> Start Delivery
                                    </button>
                                )}

                                {assignment.status === 'in_transit' && (
                                    <button
                                        disabled={actionLoading}
                                        onClick={() => handleAction('Arrived', markArrived)}
                                        className="w-full py-6 bg-amber-500 hover:bg-amber-400 text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-amber-900/20 transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 "
                                    >
                                        <FaMapMarkerAlt /> I've Arrived
                                    </button>
                                )}

                                {assignment.status === 'arrived' && (
                                    <div className={`space-y-4 p-7 md:p-10 rounded-[32px] md:rounded-[40px] border-2 transition-all ${isDarkMode ? 'bg-[#0f172a] border-emerald-500/40' : 'bg-white border-emerald-500/40 shadow-xl'}`}>
                                        <div className="text-center">
                                            <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 ">🔐 Enter OTP Code</h4>
                                            <p className={`text-[10px] font-bold mb-6  ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Ask the customer for their 6-digit delivery code</p>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="0  0  0  0  0  0"
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                            className={`w-full py-5 text-center text-3xl md:text-5xl font-bold rounded-2xl tracking-wider focus:outline-none transition-all shadow-inner border-2 ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 focus:border-emerald-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600 focus:border-emerald-500'}`}
                                        />
                                        <button
                                            disabled={actionLoading || otpCode.length < 6}
                                            onClick={() => handleAction('Complete', completeDelivery, { otp_code: otpCode })}
                                            className="w-full py-5 bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-emerald-900/20 hover:bg-emerald-400 disabled:opacity-50 transition-all active:scale-95 "
                                        >
                                            Confirm Delivery
                                        </button>
                                    </div>
                                )}

                                {['accepted', 'picked_up', 'in_transit', 'arrived'].includes(assignment.status) && (
                                    <button
                                        disabled={actionLoading}
                                        onClick={() => setShowIssueModal(true)}
                                        className={`w-full py-4 font-bold text-[10px] uppercase tracking-wider rounded-2xl border transition-all flex items-center justify-center gap-3 mt-2  ${isDarkMode ? 'text-rose-400 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10' : 'text-rose-500 border-rose-200 bg-rose-50 hover:bg-rose-100'}`}
                                    >
                                        <FaExclamationTriangle size={12} /> Report an Issue
                                    </button>
                                )}

                                {assignment.status === 'delivered' && (
                                    <div className={`p-8 md:p-12 rounded-[32px] md:rounded-[40px] text-center border transition-all ${isDarkMode ? 'bg-orange-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-[20px] flex items-center justify-center mx-auto mb-5 text-2xl shadow-xl shadow-emerald-900/20">
                                            <FaCheck />
                                        </div>
                                        <h3 className={`text-xl md:text-2xl font-bold tracking-tight  mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Delivery Complete!</h3>
                                        <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest ">Great job! Payment will be processed shortly.</p>
                                    </div>
                                )}

                                {assignment.status === 'failed' && (
                                    <div className={`p-8 md:p-12 rounded-[32px] md:rounded-[40px] text-center border transition-all ${isDarkMode ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100'}`}>
                                        <div className="w-16 h-16 bg-rose-500 text-white rounded-[20px] flex items-center justify-center mx-auto mb-5 text-2xl shadow-xl shadow-rose-900/20">
                                            <FaTimes />
                                        </div>
                                        <h3 className={`text-xl md:text-2xl font-bold tracking-tight  mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Delivery Failed</h3>
                                        <p className="text-rose-400 font-bold text-[10px] uppercase tracking-widest ">Reason: {assignment.failure_reason || 'Not specified'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Issue Reporting Modal */}
            {showIssueModal && (
                <div className={`fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-5 md:p-6 transition-all ${isDarkMode ? 'bg-[#0f172a]/95' : 'bg-slate-900/40'}`}>
                    <div className={`rounded-[32px] md:rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl border transition-all ${isDarkMode ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`}>
                        <div className="bg-rose-600 p-7 md:p-10 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                            <FaExclamationTriangle className="text-4xl mx-auto mb-4 drop-shadow-lg" />
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight  leading-none">Report an Issue</h3>
                            <p className="text-rose-200 text-[10px] font-bold uppercase tracking-widest mt-3 ">This will mark the delivery as failed</p>
                        </div>
                        <div className="p-7 md:p-10">
                            <label className={`text-[9px] font-bold uppercase tracking-wider block mb-3  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>What went wrong?</label>
                            <textarea
                                className={`w-full border rounded-2xl p-5 font-bold outline-none min-h-[140px] transition-all text-sm leading-relaxed  resize-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-rose-500/50 placeholder:text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-400 placeholder:text-slate-300'}`}
                                placeholder="Describe the reason for failing this delivery..."
                                value={issueText}
                                onChange={(e) => setIssueText(e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <button
                                    onClick={() => setShowIssueModal(false)}
                                    className={`py-4 font-bold rounded-2xl transition-all uppercase text-[10px] tracking-widest active:scale-95 border  ${isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10 border-white/5' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={!issueText || actionLoading}
                                    onClick={() => handleAction('Report Issue', failDelivery, { notes: issueText })}
                                    className="py-4 bg-rose-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-900/20 hover:bg-rose-500 transition-all uppercase text-[10px] tracking-widest disabled:opacity-50 active:scale-95 "
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

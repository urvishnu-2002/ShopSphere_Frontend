import { useState, useEffect } from 'react';
import {
    FaBox, FaDollarSign, FaMapMarkerAlt, FaCheck, FaTruck,
    FaListUl, FaPhoneAlt, FaCalendarAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    fetchDeliveryDashboard,
    fetchAssignedOrders
} from '../../api/delivery_axios';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

export default function DeliveryDashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [activeAssignments, setActiveAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useTheme();

    const [approvalStatus, setApprovalStatus] = useState('approved');
    const [rejectionReason, setRejectionReason] = useState(null);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const [dashData, activeData] = await Promise.all([
                fetchDeliveryDashboard(),
                fetchAssignedOrders()
            ]);

            setProfile(dashData.profile);
            setStats(dashData.today_stats);
            // Filter only work-in-progress statuses
            const working = activeData.filter(a =>
                ['accepted', 'picked_up', 'in_transit', 'arrived'].includes(a.status)
            );
            setActiveAssignments(working);
            setApprovalStatus('approved');
        } catch (error) {
            console.error("Dashboard load failed:", error);
            if (error.response?.status === 403) {
                const status = error.response.data.status || 'pending';
                setApprovalStatus(status);
                setRejectionReason(error.response.data.reason);
                // Don't navigate away, we'll show a pending screen
            } else {
                toast.error("Transmission failed. Re-syncing required.");
                localStorage.removeItem("accessToken");
                navigate('/delivery');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDashboard(); }, []);

    if (loading) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className={`w-16 h-16 border-4 rounded-full animate-spin mb-6 ${isDarkMode ? 'border-white/5 border-t-orange-500' : 'border-slate-200 border-t-orange-500'}`}></div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Connecting to Hub...</p>
            </div>
        );
    }

    if (approvalStatus !== 'approved') {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-[120px]"></div>
                <div className={`max-w-xl w-full backdrop-blur-3xl border rounded-[48px] p-12 text-center shadow-2xl relative z-10 transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="w-24 h-24 bg-orange-500/10 text-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-orange-500/20 shadow-xl">
                        <FaTruck size={40} className={approvalStatus === 'pending' ? 'animate-pulse' : ''} />
                    </div>
                    <h1 className={`text-4xl font-bold tracking-tight mb-4  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {approvalStatus === 'pending' ? 'Account Pending' : 'Account Rejected'}
                    </h1>
                    <p className={`font-bold text-[10px] uppercase tracking-wider mb-8 leading-relaxed  ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {approvalStatus === 'pending'
                            ? "Your transmission has been received. Central Command is currently reviewing your documentation. Access will be granted shortly."
                            : `Your application status: ${approvalStatus.toUpperCase()}. Reason: ${rejectionReason || 'Contact support for details.'}`
                        }
                    </p>
                    <div className={`p-6 rounded-2xl border mb-10 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <p className="text-[8px] font-bold text-orange-400 uppercase tracking-widest  flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                            Status Check: {approvalStatus.toUpperCase()}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/delivery')}
                        className={`w-full py-6 rounded-[28px] text-[11px] font-bold uppercase tracking-wider transition-all  shadow-2xl border-none cursor-pointer ${isDarkMode ? 'bg-white text-[#0f172a] hover:bg-orange-600 hover:text-white' : 'bg-slate-900 text-white hover:bg-orange-600'}`}
                    >
                        Return to Portal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full min-h-screen transition-colors duration-300 pb-20 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            {/* Top Branding Header */}
            <header className={`px-4 md:px-8 py-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b backdrop-blur-xl sticky top-0 z-20 transition-all ${isDarkMode ? 'bg-[#0f172a]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
                <div className="text-left w-full md:w-auto">
                    <h1 className={`text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-4  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                            <FaTruck size={18} />
                        </div>
                        Delivery Portal
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-2 ml-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                        Hub Management
                    </p>
                </div>
                <div className={`flex px-6 py-3 rounded-2xl border backdrop-blur-sm self-stretch md:self-center gap-4 items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                    <div className="text-center md:text-right">
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Today</p>
                        <p className={`text-xs font-bold uppercase  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{new Date().toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
                {/* Greeting Section */}
                <div className={`relative overflow-hidden p-10 md:p-14 rounded-[40px] md:rounded-[64px] shadow-3xl group transition-all duration-300 ${isDarkMode ? 'bg-orange-500 shadow-orange-400/20' : 'bg-slate-900 shadow-slate-200'}`}>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4  uppercase leading-tight">
                                Welcome, {profile?.username || 'Partner'}
                            </h2>
                            <p className="text-orange-100 font-bold text-[10px] md:text-[11px] uppercase tracking-wider ">
                                Ready for your next delivery? Sync with the hub now.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/delivery/assigned')}
                            className="w-full lg:w-auto px-10 py-5 bg-white text-orange-500 rounded-[28px] font-bold uppercase tracking-wider text-xs hover:bg-slate-50 hover:shadow-2xl transition-all active:scale-95  shadow-lg"
                        >
                            Find New Orders
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    <div className={`p-8 md:p-10 rounded-[40px] border transition-all shadow-2xl relative overflow-hidden group ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-orange-500/30' : 'bg-white border-slate-100'}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl"></div>
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-orange-500/10 text-indigo-400 border-indigo-400/10' : 'bg-indigo-50 text-orange-500 border-orange-100'}`}>
                                <FaDollarSign size={20} />
                            </div>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total Earnings</span>
                        </div>
                        <div className={`text-4xl font-bold tracking-tight  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{parseFloat(profile?.total_earnings || 0).toLocaleString()}</div>
                        <p className="mt-2 text-[9px] text-emerald-400 font-bold uppercase tracking-widest ">Lifetime Profit</p>
                    </div>

                    <div className={`p-8 md:p-10 rounded-[40px] border transition-all shadow-2xl relative overflow-hidden group ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-purple-500/30' : 'bg-white border-slate-100'}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-purple-500/10 text-purple-400 border-purple-400/10' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                <FaBox size={20} />
                            </div>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Deliveries</span>
                        </div>
                        <div className={`text-4xl font-bold tracking-tight  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{profile?.completed_deliveries || 0}</div>
                        <p className="mt-2 text-[9px] text-purple-400 font-bold uppercase tracking-widest ">Completed Jobs</p>
                    </div>

                    <div className={`p-8 md:p-10 rounded-[40px] border transition-all shadow-2xl relative overflow-hidden group sm:col-span-2 lg:col-span-1 ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-orange-500/30' : 'bg-white border-slate-100'}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl"></div>
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-orange-500/10 text-emerald-400 border-emerald-400/10' : 'bg-emerald-50 text-orange-500 border-emerald-100'}`}>
                                <FaCheck size={20} />
                            </div>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Today's Earnings</span>
                        </div>
                        <div className={`text-4xl font-bold tracking-tight  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{parseFloat(stats?.total_earnings || 0).toLocaleString()}</div>
                        <p className="mt-2 text-[9px] text-emerald-400 font-bold uppercase tracking-widest ">Current Shift</p>
                    </div>
                </div>

                {/* Active Assignments */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-orange-500/10 text-indigo-400 border-indigo-400/10' : 'bg-indigo-50 text-orange-500 border-orange-100'}`}>
                            <FaListUl size={18} />
                        </div>
                        <h3 className={`text-2xl font-bold tracking-tight  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Active Orders</h3>
                    </div>

                    {activeAssignments.length > 0 ? (
                        <div className="space-y-6">
                            {activeAssignments.map((assignment) => (
                                <div key={assignment.id} className={`rounded-[40px] p-8 md:p-10 border transition-all shadow-2xl group relative overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-orange-500/20' : 'bg-white border-slate-100 hover:shadow-sm'}`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                                        <div className="flex-shrink-0">
                                            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex flex-col items-center justify-center border shadow-inner transition-all ${isDarkMode ? 'bg-[#020617] text-indigo-400 border-white/5 group-hover:bg-orange-500 group-hover:text-white' : 'bg-slate-50 text-orange-500 border-slate-100 group-hover:bg-slate-900 group-hover:text-white'}`}>
                                                <FaTruck className="text-2xl md:text-3xl" />
                                                <span className="text-[8px] font-bold uppercase mt-2 tracking-widest ">ID-{assignment.id}</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 text-center lg:text-left">
                                            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4 justify-center lg:justify-start">
                                                <h4 className={`text-2xl font-bold tracking-tight  uppercase truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{assignment.customer_name}</h4>
                                                <span className={`px-5 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest border  self-center ${isDarkMode ? 'bg-orange-500/20 text-indigo-400 border-orange-500/20' : 'bg-indigo-50 text-orange-500 border-orange-100'}`}>
                                                    {assignment.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-6">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <FaMapMarkerAlt className="text-rose-400" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{assignment.delivery_city}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <FaBox className="text-amber-400" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{assignment.items?.length || 0} Items</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-10">
                                            <div className="text-center lg:text-right">
                                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Your Fee</p>
                                                <div className={`text-3xl font-bold tracking-tight  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{parseFloat(assignment.delivery_fee || 0).toLocaleString()}</div>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/delivery/order/${assignment.id}`)}
                                                className="w-full lg:w-auto px-10 py-4 bg-orange-500 text-white rounded-[20px] font-bold text-[10px] uppercase tracking-wider hover:bg-orange-500 transition-all shadow-xl shadow-orange-500/20 "
                                            >
                                                View Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-20 rounded-[64px] border-2 border-dashed shadow-2xl transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'}`}>
                            <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center mx-auto mb-8 border shadow-inner transition-colors ${isDarkMode ? 'bg-[#020617] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                <FaCheck size={32} className={isDarkMode ? 'text-slate-800' : 'text-slate-300'} />
                            </div>
                            <h3 className={`text-2xl font-bold tracking-tight mb-3  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Active Orders</h3>
                            <p className="text-gray-500 font-bold text-[10px] mb-10 max-w-xs mx-auto uppercase tracking-widest leading-relaxed">Your area is currently clear. Sync to find new assignments.</p>
                            <button
                                onClick={() => navigate('/delivery/assigned')}
                                className="px-12 py-5 bg-orange-500 text-white rounded-3xl font-bold uppercase tracking-wider text-[10px] hover:bg-orange-500 transition-all active:scale-95  shadow-xl shadow-orange-500/20"
                            >
                                Sync Now
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

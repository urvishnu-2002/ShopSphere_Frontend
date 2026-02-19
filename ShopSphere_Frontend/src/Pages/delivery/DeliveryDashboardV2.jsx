import { useState, useEffect } from 'react';
import { FaBox, FaDollarSign, FaMapMarkerAlt, FaCheck, FaSignOutAlt, FaBars, FaTruck, FaClipboardList, FaMoneyBillWave, FaTachometerAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchDeliveryDashboard, acceptOrder as apiAcceptOrder, sendDeliveryOTP, verifyDeliveryOTP } from '../../api/delivery_axios';
import { toast } from 'react-hot-toast';

export default function DeliveryDashboardV2({ onLogout: propLogout }) {
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem("accessToken");
        navigate('/delivery');
    };

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [activeAssignments, setActiveAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // OTP Modal State
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);

    const loadDashboard = async () => {
        try {
            const data = await fetchDeliveryDashboard();
            setProfile(data.profile);
            setStats(data.today_stats);
            setActiveAssignments(data.active_assignments);
        } catch (error) {
            console.error("Dashboard load failed:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleAcceptOrder = async (assignmentId) => {
        try {
            await apiAcceptOrder(assignmentId);
            toast.success('Order accepted!');
            loadDashboard();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to accept order");
        }
    };



    const handleDeliverCompleted = async (assignment) => {
        try {
            setCurrentAssignment(assignment);
            const res = await sendDeliveryOTP(assignment.id);
            if (res.success) {
                if (res.warning) {
                    // Email failed but OTP is saved — show warning and proceed
                    toast('Email failed. Check server terminal for OTP.', { icon: '⚠️' });
                } else {
                    toast.success("OTP sent to customer's email!");
                }
            }

            setShowOTPModal(true);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to generate OTP. Please try again.");
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        setVerifying(true);
        try {
            await verifyDeliveryOTP(currentAssignment.id, otp);
            toast.success("Delivery completed successfully!");
            setShowOTPModal(false);
            setOtp('');
            loadDashboard();
        } catch (error) {
            toast.error(error.response?.data?.error || "Invalid OTP");
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-white border-b px-8 py-6 flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Delivery Portal</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Live Statistics</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{profile?.full_name}</p>
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online & Active</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="mb-12">
                    <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome back!</h2>
                    <p className="text-gray-500 font-medium">Manage your active tasks and daily performance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-gray-400 font-black uppercase tracking-widest text-xs">Total Earnings</span>
                            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                                <FaDollarSign className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-gray-900">₹{profile?.total_earnings || '0.00'}</div>
                        <p className="text-xs font-bold text-gray-400 mt-3 uppercase tracking-wider">Life time performance</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-gray-400 font-black uppercase tracking-widest text-xs">Completed</span>
                            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                                <FaBox className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-gray-900">{profile?.completed_deliveries || 0}</div>
                        <p className="text-xs font-bold text-gray-400 mt-3 uppercase tracking-wider">Successful Deliveries</p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-gray-400 font-black uppercase tracking-widest text-xs">Today's Earnings</span>
                            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                                <FaMoneyBillWave className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-gray-900">₹{stats?.total_earnings || '0.00'}</div>
                        <p className="text-xs font-bold text-gray-400 mt-3 uppercase tracking-wider">Earnings Today</p>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-100 pb-4">Active Assignments</h3>
                    {activeAssignments.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {activeAssignments.map((assignment) => (
                                <div key={assignment.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-purple-50 hover:border-purple-200 transition-all flex flex-col lg:flex-row justify-between lg:items-center gap-8 group">
                                    <div className="space-y-4 flex-grow">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 font-bold group-hover:scale-110 transition-transform">
                                                #{assignment.id}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900">
                                                    {assignment.items && assignment.items.length > 0 ? assignment.items.map(i => i.product_name).join(', ') : 'Order Details unavailable'}
                                                </h4>
                                                <p className="text-gray-500 font-medium">To: {assignment.delivery_address || assignment.delivery_city}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 px-3 py-1.5 rounded-full border border-gray-100">
                                                Customer: {assignment.customer_name}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 px-3 py-1.5 rounded-full border border-green-100">
                                                Fee: ₹{assignment.delivery_fee}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 min-w-[300px]">
                                        <button
                                            onClick={() => handleDeliverCompleted(assignment)}
                                            className="flex-1 bg-purple-600 text-white py-4 px-8 rounded-2xl font-black text-xs uppercase tracking-[2px] shadow-xl shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1 active:translate-y-0 transition-all"
                                        >
                                            Deliver Completed
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] shadow-xl border border-dashed border-gray-200">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                                <FaTruck size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready for more?</h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">No active deliveries at the moment. New assignments will appear here once you accept them.</p>
                            <button
                                onClick={() => navigate('/delivery/assigned')}
                                className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition shadow-xl"
                            >
                                Check New Requests
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* OTP Verification Modal */}
            {showOTPModal && (
                <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-fadeIn">
                    <div className="bg-white rounded-[3rem] p-10 md:p-14 max-w-lg w-full relative shadow-3xl">
                        <button
                            className="absolute top-8 right-8 text-gray-300 hover:text-gray-900 transition-colors"
                            onClick={() => setShowOTPModal(false)}
                        >
                            <FaTimes size={24} />
                        </button>

                        <div className="text-center space-y-6">
                            <div className="w-24 h-24 bg-purple-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-4xl shadow-inner animate-bounce">
                                📦
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Verify Delivery</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Enter the 6-digit code sent to customer</p>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full py-6 px-10 border-2 border-purple-50 rounded-3xl bg-purple-50/30 text-4xl font-black text-purple-900 tracking-[12px] text-center outline-none focus:border-purple-600 focus:bg-white transition-all shadow-inner placeholder:text-purple-100"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />

                                <div className="flex justify-center flex-col items-center">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Sent to customer's registered email</p>
                                    <button
                                        className="text-purple-600 text-[10px] font-black mt-2 hover:underline cursor-pointer bg-transparent border-none"
                                        onClick={() => handleDeliverCompleted(currentAssignment)}
                                    >
                                        RESEND OTP
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleVerifyOTP}
                                disabled={verifying || otp.length !== 6}
                                className={`w-full py-5 rounded-3xl text-sm font-black uppercase tracking-[4px] transition-all shadow-xl ${verifying || otp.length !== 6
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-purple-600 text-white shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1'
                                    }`}
                            >
                                {verifying ? 'VERIFYING...' : 'CONFIRM DELIVERY'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}

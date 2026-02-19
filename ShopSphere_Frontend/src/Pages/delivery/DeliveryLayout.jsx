import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { fetchAgentProfile } from "../../api/delivery_axios";
import { FaClock, FaExclamationTriangle, FaSignOutAlt } from "react-icons/fa";

export default function DeliveryLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [approvalStatus, setApprovalStatus] = useState('loading'); // loading, approved, pending, rejected
    const [agentData, setAgentData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkApproval = async () => {
            try {
                const profile = await fetchAgentProfile();
                console.log("Profile fetched:", profile);
                setAgentData(profile);

                // Case-insensitive check and trimmed string
                const status = (profile.approval_status || profile.status || '').toLowerCase().trim();
                setApprovalStatus(status);
            } catch (error) {
                console.error("Failed to check approval:", error);

                // If it's a 401, they need to log in again
                if (error.response?.status === 401) {
                    navigate('/delivery');
                } else if (error.response?.status === 403) {
                    // If they get a 403, and they are logged in, it means the permission denied 
                    // likely because they are not approved yet (depends on how backend is set up)
                    setApprovalStatus('pending');
                } else {
                    // For other errors, we check if we have any cached data or just default to pending
                    setApprovalStatus('pending');
                }
            }
        };

        checkApproval();

        const handler = (e) => setSidebarOpen(Boolean(e?.detail?.open));
        window.addEventListener('deliverySidebarToggle', handler);
        return () => window.removeEventListener('deliverySidebarToggle', handler);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate('/delivery');
    };

    if (approvalStatus === 'loading') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-purple-900 font-bold animate-pulse tracking-widest text-xs uppercase">Verifying Credentials</p>
            </div>
        );
    }

    if (approvalStatus !== 'approved') {
        const isRejected = approvalStatus === 'rejected';
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white rounded-[40px] shadow-2xl p-10 lg:p-16 text-center relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-3 ${isRejected ? 'bg-red-500' : 'bg-amber-500'}`}></div>

                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 ${isRejected ? 'bg-red-50' : 'bg-amber-50'}`}>
                        {isRejected ? (
                            <FaExclamationTriangle className="w-12 h-12 text-red-500" />
                        ) : (
                            <FaClock className="w-12 h-12 text-amber-500 animate-pulse" />
                        )}
                    </div>

                    <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                        {isRejected ? "Account Restricted" : "Registration in Review"}
                    </h1>

                    <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
                        {isRejected
                            ? "Unfortunately, your delivery agent application has been rejected by our administration team. Please contact support for more details."
                            : "Welcome aboard! Your application is currently being reviewed by our administration team. This usually takes 24-48 hours. We'll notify you once you're cleared for takeoff!"}
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.reload()}
                            className={`w-full py-5 rounded-2xl text-white font-bold uppercase tracking-widest text-xs transition-all hover:-translate-y-1 shadow-xl ${isRejected ? 'bg-red-600 shadow-red-100' : 'bg-amber-600 shadow-amber-100'}`}
                        >
                            Refresh Status
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full py-5 rounded-2xl bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                        >
                            <FaSignOutAlt /> Sign Out
                        </button>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-center gap-6">
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Status</p>
                            <p className={`font-bold uppercase text-xs ${isRejected ? 'text-red-600' : 'text-amber-600'}`}>{approvalStatus}</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100"></div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Agent ID</p>
                            <p className="font-bold uppercase text-xs text-gray-900">#{agentData?.id || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-0`}>
                <Outlet />
            </main>
        </div>
    );
}

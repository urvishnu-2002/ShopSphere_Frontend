import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    PanelLeftClose,
    PanelLeftOpen,
    SearchX,
    ShieldCheck,
    Mail,
    Clock,
    ArrowRight,
    CheckCircle,
    XCircle,
    UserPlus,
    Activity,
    ShieldAlert,
    Zap
} from 'lucide-react';
import { fetchVendorRequests, approveVendorRequest, rejectVendorRequest, logout } from '../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';

const VendorRequests = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [vendors, setVendors] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const loadVendors = async () => {
        setIsLoading(true);
        try {
            const data = await fetchVendorRequests();
            setVendors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch vendor requests", error);
            toast.error("Failed to load requests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

    const pendingRequests = vendors.filter(vendor => vendor.approval_status === 'pending');

    const handleAction = async (id, action) => {
        try {
            if (action === "Approved") {
                await approveVendorRequest(id);
                toast.success("Vendor approved successfully");
            } else {
                await rejectVendorRequest(id, "Rejected by administrator");
                toast.success("Vendor request rejected");
            }
            await loadVendors();
        } catch (error) {
            console.error("Action execution failed:", error);
            toast.error("Operation failed");
        }
    };

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                activePage="Vendor Requests"
                onLogout={logout}
            />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <header className={`border-b px-8 h-20 flex items-center justify-between z-20 sticky top-0 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-lg font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Onboarding Queue</h1>
                                <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-normal ${isDarkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>Critical</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Verify and authorize new marketplace partners</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <ShieldCheck className="w-3.5 h-3.5" /> Registry Protocol
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Pending Apps', value: pendingRequests.length, icon: UserPlus, color: 'blue' },
                                { label: 'Verification Rate', value: '94%', icon: Activity, color: 'emerald' },
                                { label: 'Security State', value: 'Nominal', icon: ShieldAlert, color: 'emerald' },
                                { label: 'Node Session', value: 'Active', icon: Zap, color: 'amber' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-6 rounded-[2.5rem] border transition-all duration-300 group ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 hover:border-slate-700 hover:bg-[#1e293b]/80' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${stat.color === 'blue' ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') :
                                            stat.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                                                stat.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                                                    (isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600')
                                            }`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-semibold uppercase tracking-normal text-slate-500 mb-1">{stat.label}</p>
                                            <p className={`text-2xl font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className={`rounded-[3rem] border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-sm shadow-blue-500/5' : 'bg-white border-slate-100 shadow-md'}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                        <tr>
                                            {['Transmission Identity', 'Entity Endpoint', 'Current Protocol', 'Registry Log', 'Operations'].map(h => (
                                                <th key={h} className="px-10 py-6 text-[10px] font-semibold text-slate-500 uppercase tracking-normal">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y transition-colors duration-300 ${isDarkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                                        <AnimatePresence mode="wait">
                                            {isLoading ? (
                                                Array(3).fill(0).map((_, i) => (
                                                    <tr key={i} className="animate-pulse">
                                                        <td colSpan="5" className="px-10 py-10"><div className={`h-14 rounded-3xl w-full ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`} /></td>
                                                    </tr>
                                                ))
                                            ) : pendingRequests.length > 0 ? (
                                                pendingRequests.map((vendor, index) => (
                                                    <motion.tr
                                                        key={vendor.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className={`group transition-all duration-300 ${isDarkMode ? 'hover:bg-blue-500/5' : 'hover:bg-blue-50/50'}`}
                                                    >
                                                        <td className="px-10 py-8">
                                                            <div className="flex items-center gap-6">
                                                                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-semibold text-xl transition-all duration-500 ${isDarkMode ? 'bg-[#0f172a] border-slate-800 text-blue-400 group-hover:border-blue-500 group-hover:scale-105' : 'bg-white border-slate-100 text-blue-600 group-hover:scale-105 shadow-sm'}`}>
                                                                    {(vendor.shop_name || '?').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className={`text-base font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{vendor.shop_name}</div>
                                                                    <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-normal mt-1">VID #{vendor.id}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-8">
                                                            <div className={`flex items-center gap-2.5 text-xs font-bold tracking-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                                <Mail className="w-4 h-4 opacity-50" /> {vendor.user_email}
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-8">
                                                            <span className="px-4 py-2 rounded-xl text-[9px] font-semibold uppercase tracking-normal border bg-amber-500/10 text-amber-500 border-amber-500/20">
                                                                {vendor.approval_status}
                                                            </span>
                                                        </td>
                                                        <td className="px-10 py-8">
                                                            <div className={`flex items-center gap-2.5 text-xs font-bold tracking-normal ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                                                <Clock className="w-4 h-4 opacity-50" /> {new Date(vendor.created_at).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-10 py-8">
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={() => navigate(`/vendors/review/${vendor.id}`)}
                                                                    className={`p-3 rounded-2xl transition-all border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-blue-500/50' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}
                                                                    title="Inspect Profile"
                                                                >
                                                                    <ArrowRight className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAction(vendor.id, 'Approved')}
                                                                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[9px] font-semibold uppercase tracking-normal transition-all border shadow-lg shadow-emerald-500/5 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white'}`}
                                                                >
                                                                    <CheckCircle className="w-4 h-4" /> Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAction(vendor.id, 'Rejected')}
                                                                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[9px] font-semibold uppercase tracking-normal transition-all border shadow-lg shadow-rose-500/5 ${isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white' : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white'}`}
                                                                >
                                                                    <XCircle className="w-4 h-4" /> Decline
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <motion.tr
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <td colSpan="5" className="px-10 py-32 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-28 h-28 rounded-[3.5rem] flex items-center justify-center mb-8 border transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                                                <SearchX className="w-14 h-14 text-slate-300/30" />
                                                            </div>
                                                            <h3 className={`text-xl font-semibold uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Registry Empty</h3>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal mt-2 max-w-xs">No pending applications require governance event response at this timestamp.</p>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                            <div className={`px-10 py-8 flex items-center justify-between border-t transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal">
                                    Registry Node Synchronized Node_01
                                </div>
                                <div className="flex items-center gap-4 text-[9px] font-semibold text-slate-500 tracking-normal uppercase">
                                    Auth Secured <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VendorRequests;

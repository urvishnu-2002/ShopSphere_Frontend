import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    Trash2,
    User,
    Store,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Mail,
    FileText,
    PanelLeftClose,
    PanelLeftOpen,
    ShieldAlert,
    ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";
import { useTheme } from "../context/ThemeContext";
import { logout } from "../api/axios";

export default function DeletionRequests() {
    const { isDarkMode } = useTheme();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${API_BASE_URL}/superAdmin/api/deletion-requests/list_requests/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching deletion requests:", error);
            toast.error("Failed to load deletion requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (type, id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this deletion request?`)) return;

        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(`${API_BASE_URL}/superAdmin/api/deletion-requests/process_request/`, {
                type, id, action
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Request ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
            fetchRequests();
        } catch (error) {
            console.error("Error processing request:", error);
            toast.error("Failed to process request");
        }
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Requests" onLogout={logout} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-20 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-lg font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Account Deletion Requests</h1>
                                <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-normal ${isDarkMode ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>Sensitive</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Approve or reject account deletion requests from vendors and delivery agents</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <ShieldAlert className="w-3.5 h-3.5" /> High Priority
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {requests.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`rounded-[3rem] border p-20 text-center transition-all ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}
                            >
                                <div className={`w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-900 text-emerald-500/20' : 'bg-emerald-50 text-emerald-500/20'}`}>
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className={`text-2xl font-semibold uppercase tracking-normal mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>All Clear</h2>
                                <p className="text-slate-500 text-sm uppercase tracking-normal font-bold max-w-md mx-auto">No pending deletion requests at the moment.</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence>
                                    {requests.map((request, index) => (
                                        <motion.div
                                            key={`${request.type}-${request.id}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`rounded-[2.5rem] border p-8 relative overflow-hidden group transition-all duration-500 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 hover:border-rose-500/20 shadow-2xl shadow-rose-900/5' : 'bg-white border-slate-100 hover:border-rose-200 shadow-sm hover:shadow-xl'}`}
                                        >
                                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl transition-opacity group-hover:opacity-100 ${isDarkMode ? 'bg-rose-500/10 opacity-30' : 'bg-rose-500/5 opacity-0'}`}></div>

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-10">
                                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-normal flex items-center gap-2 ${request.type === 'vendor'
                                                        ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600')
                                                        : (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600')
                                                        }`}>
                                                        {request.type === 'vendor' ? <Store size={12} /> : <User size={12} />}
                                                        {request.type}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-normal">
                                                        <Clock size={12} />
                                                        {new Date(request.requested_at).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <div className="mb-10">
                                                    <h3 className={`text-2xl font-semibold tracking-normal uppercase mb-2 truncate group-hover:text-rose-500 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{request.name}</h3>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-normal text-slate-500">
                                                        <Mail size={12} className="opacity-50" />
                                                        {request.email}
                                                    </div>
                                                </div>

                                                <div className={`p-6 rounded-3xl border mb-10 flex-grow transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800 group-hover:border-slate-700' : 'bg-slate-50 border-transparent group-hover:bg-slate-100'}`}>
                                                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-4 flex items-center gap-2">
                                                        <FileText size={12} />
                                                        Reason for Deletion
                                                    </p>
                                                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                        "{request.reason || "No reason provided."}"
                                                    </p>
                                                </div>

                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => handleAction(request.type, request.id, 'approve')}
                                                        className="flex-1 py-5 bg-rose-600 text-white rounded-2xl text-[10px] font-semibold uppercase tracking-normal hover:bg-rose-500 transition-all shadow-xl shadow-rose-900/20 flex items-center justify-center gap-2 active:scale-95 group"
                                                    >
                                                        <ShieldAlert size={14} className="group-hover:animate-pulse" /> Approve Deletion
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(request.type, request.id, 'deny')}
                                                        className={`flex-1 py-5 rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all flex items-center justify-center gap-2 active:scale-95 ${isDarkMode
                                                            ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                                                            : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        <XCircle size={14} /> Reject Request
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

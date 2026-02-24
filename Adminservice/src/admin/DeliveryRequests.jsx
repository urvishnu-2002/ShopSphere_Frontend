import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    PanelLeftClose,
    PanelLeftOpen,
    ClipboardList,
    CheckCircle,
    XCircle,
    Eye,
    Truck,
    Activity,
    Mail,
    Smartphone,
    Calendar,
    ArrowUpRight,
    MapPin
} from 'lucide-react';
import { fetchDeliveryRequests, approveDeliveryAgent, rejectDeliveryAgent, logout } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';

const DeliveryRequests = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const data = await fetchDeliveryRequests();
            setAgents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch delivery requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleAction = async (id, action) => {
        try {
            if (action === "approve") {
                await approveDeliveryAgent(id, "Approved by administrator");
            } else {
                const reason = prompt("Enter rejection reason:") || "Rejected by administrator";
                await rejectDeliveryAgent(id, reason);
            }
            await loadRequests();
        } catch (error) {
            console.error("Action failed:", error);
        }
    };

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                activePage="Delivery Requests"
                onLogout={logout}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className={`text-lg font-bold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Admission Queue</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Global Fleet Expansion Registry</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <Activity className="w-3.5 h-3.5" /> Ops Synchronized
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">
                        {/* Header Stats */}
                        <div className={`p-8 rounded-[2.5rem] border relative overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-normal mb-4 ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                        <ClipboardList className="w-3 h-3" /> Fleet Protocol
                                    </div>
                                    <h2 className={`text-3xl font-semibold tracking-normal mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        Pending Fleet Approvals
                                    </h2>
                                    <p className="text-slate-500 text-sm font-medium">Verify and authorize new logistics nodes for the global network.</p>
                                </div>
                                <div className={`px-8 py-4 rounded-3xl border text-center transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                    <p className="text-[10px] font-semibold uppercase tracking-normal text-slate-500 mb-1">Queue Density</p>
                                    <p className={`text-4xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{agents.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* List Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    Array(6).fill(0).map((_, i) => (
                                        <div key={i} className={`h-64 rounded-[2rem] animate-pulse ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`} />
                                    ))
                                ) : agents.length === 0 ? (
                                    <div className="col-span-full py-24 text-center">
                                        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                                            <CheckCircle className="w-12 h-12 text-slate-300" />
                                        </div>
                                        <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Zero Backlog</h3>
                                        <p className="text-slate-500">All logistics requests have been processed successfully.</p>
                                    </div>
                                ) : agents.map((agent, index) => (
                                    <motion.div
                                        key={agent.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className={`group rounded-[2.5rem] border p-6 transition-all duration-300 hover:translate-y-[-4px] ${isDarkMode
                                            ? 'bg-[#1e293b]/50 border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 shadow-2xl shadow-blue-500/5'
                                            : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-blue-400' : 'bg-slate-50 border-slate-100 text-blue-600'
                                                }`}>
                                                <Truck className="w-7 h-7" />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAction(agent.id, 'approve')}
                                                    className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm'}`}
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(agent.id, 'reject')}
                                                    className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm'}`}
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className={`text-lg font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{agent.user_email}</h3>
                                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mt-1">
                                                    <Smartphone className="w-3.5 h-3.5" /> {agent.phone_number}
                                                </div>
                                            </div>

                                            <div className={`grid grid-cols-2 gap-3 p-4 rounded-3xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-transparent shadow-inner'}`}>
                                                <div>
                                                    <p className="text-[9px] font-semibold uppercase text-slate-500 mb-1">Vehicle Unit</p>
                                                    <p className={`text-xs font-semibold uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{agent.vehicle_type}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-semibold uppercase text-slate-500 mb-1">Registry Date</p>
                                                    <p className={`text-xs font-semibold uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                        {new Date(agent.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => navigate(`/delivery/review/${agent.id}`)}
                                                className={`w-full py-4 rounded-2xl text-[10px] font-semibold uppercase tracking-normal flex items-center justify-center gap-2 transition-all ${isDarkMode
                                                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20'
                                                    }`}
                                            >
                                                Review Artifacts <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DeliveryRequests;

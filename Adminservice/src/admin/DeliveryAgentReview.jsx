import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShieldCheck,
    Truck,
    User,
    FileText,
    AlertTriangle,
    Clock,
    Activity,
    PanelLeftClose,
    PanelLeftOpen,
    Loader2,
    Star,
    CreditCard,
    DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import axios from '../api/axios';

const DeliveryAgentReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [agent, setAgent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActioning, setIsActioning] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        const loadAgentData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(`/superAdmin/api/delivery-agents/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAgent(response.data);
            } catch (error) {
                console.error("Failed to load agent details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAgentData();
    }, [id]);

    const handleActionClick = (action) => {
        setPendingAction(action);
        setIsActionModalOpen(true);
    };

    const confirmAction = async () => {
        if (!pendingAction || !agent) return;

        setIsActioning(true);
        setIsActionModalOpen(false);

        try {
            const token = localStorage.getItem("authToken");
            const baseUrl = `/superAdmin/api/delivery-agents/${agent.id}/`;

            if (pendingAction === "Approved") {
                await axios.post(`${baseUrl}approve/`, {}, { headers: { Authorization: `Bearer ${token}` } });
            } else if (pendingAction === "Blocked") {
                await axios.post(`${baseUrl}block/`, { reason: "Policy violation" }, { headers: { Authorization: `Bearer ${token}` } });
            } else if (pendingAction === "Rejected") {
                await axios.post(`${baseUrl}reject/`, { reason: "Security review failed" }, { headers: { Authorization: `Bearer ${token}` } });
            } else if (pendingAction === "Unblocked") {
                await axios.post(`${baseUrl}unblock/`, {}, { headers: { Authorization: `Bearer ${token}` } });
            }

            navigate('/delivery-agents');
        } catch (error) {
            console.error("Action execution failed:", error);
        } finally {
            setIsActioning(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white font-sans text-slate-800">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Truck className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Profiling Agent</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Fetching security data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F8FAFC] text-slate-800">
                <div className="text-center max-w-sm px-6">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex items-center justify-center mx-auto mb-8">
                        <AlertTriangle className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Access Restricted</h2>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">The agent record you are looking for does not exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/delivery-agents')}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
            case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'rejected': return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-slate-500 bg-slate-50 border-slate-100';
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-900">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Delivery Agents" onLogout={() => window.location.href = '/'} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 px-8 h-24 flex items-center justify-between z-20">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate(-1)} className="p-3 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 hover:text-indigo-600 transition-all">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="w-px h-10 bg-slate-200 hidden sm:block" />
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Agent Security Review</h1>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-indigo-600" /> Profiling ID: {agent.id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className="hidden lg:flex items-center bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest gap-2">
                            <ShieldCheck className="w-4 h-4" /> Personnel Controls
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-[#F8FAFC]">
                    <div className="max-w-5xl mx-auto space-y-12 pb-40">
                        {/* Status Hero Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-12 text-slate-900 border border-slate-200 shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(agent.approval_status)}`}>
                                    {agent.is_blocked ? 'Blocked' : agent.approval_status}
                                </span>
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                <div className="w-32 h-32 bg-violet-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl">
                                    {(agent.username || "D").charAt(0).toUpperCase()}
                                </div>
                                <div className="text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-black text-yellow-700">{agent.average_rating || '5.0'}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled: {new Date(agent.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className="text-5xl font-black tracking-tighter mb-2 text-slate-900">{agent.username}</h2>
                                    <p className="text-slate-500 font-bold text-sm tracking-tight">{agent.email}</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Detailed Info */}
                            <div className="lg:col-span-2 space-y-12">
                                <section className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm relative group overflow-hidden">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-violet-600" /> Operational Identity
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Primary Vehicle</label>
                                            <p className="text-lg font-black text-slate-900 flex items-center gap-3">
                                                <Truck className="w-5 h-5 text-violet-600" /> {agent.vehicle_type}
                                            </p>
                                            <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">{agent.vehicle_number || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Contact Protocol</label>
                                            <p className="text-lg font-black text-slate-900 flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-violet-600" /> {agent.phone}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">License Credential</label>
                                            <p className="text-lg font-black text-slate-900 font-mono italic">{agent.license_number || 'PEND_AUTH'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Payout Node</label>
                                            <p className="text-lg font-black text-slate-900 flex items-center gap-3">
                                                <CreditCard className="w-5 h-5 text-violet-600" /> {agent.bank_name || 'NOT_LINKED'}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-violet-600" /> Compliance Dossier
                                    </h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
                                        Identity verification documents are protected by end-to-end encryption.
                                    </p>
                                </section>
                            </div>

                            {/* Performance Sidebar */}
                            <div className="space-y-12">
                                <section className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-violet-600" /> Performance Node
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                                            <div className="text-4xl font-black text-slate-900 mb-1">{agent.completed_deliveries}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Shifts</div>
                                        </div>
                                        <div className="p-8 bg-violet-600 rounded-[2.5rem] text-center text-white shadow-xl shadow-violet-200">
                                            <div className="text-4xl font-black mb-1">₹{agent.total_earnings}</div>
                                            <div className="text-[10px] font-black text-violet-200 uppercase tracking-widest flex items-center justify-center gap-2">
                                                <DollarSign className="w-3 h-3" /> Total Revenue
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer Action Bar */}
                <div className={`fixed bottom-0 right-0 left-0 bg-white/80 backdrop-blur-3xl border-t border-slate-200 p-8 z-40 transition-all duration-500`} style={{ left: isSidebarOpen ? '280px' : '80px' }}>
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-12">
                        <div>
                            <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Control Hub</h4>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Personnel Authorization Terminal</p>
                        </div>

                        <div className="flex items-center gap-6 w-full sm:w-auto">
                            {agent.is_blocked ? (
                                <button
                                    onClick={() => handleActionClick('Unblocked')}
                                    className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all"
                                >
                                    Unblock Personnel
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleActionClick('Blocked')}
                                    className="px-10 py-5 bg-white border-2 border-slate-200 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-300 transition-all"
                                >
                                    Block Access
                                </button>
                            )}

                            {agent.approval_status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleActionClick('Rejected')}
                                        className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleActionClick('Approved')}
                                        className="px-12 py-5 bg-violet-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-violet-600/40 hover:bg-violet-700 transition-all flex items-center justify-center gap-4 min-w-[220px]"
                                    >
                                        {isActioning ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                        {isActioning ? 'Authorizing...' : 'Approve Agent'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isActionModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                            onClick={() => setIsActionModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-slate-200 rounded-[3rem] p-16 max-w-sm w-full relative z-10 shadow-2xl text-center"
                        >
                            <div className="w-28 h-28 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mb-12 border border-rose-100 mx-auto">
                                <AlertTriangle className="w-14 h-14 text-rose-500" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Protocol Execution</h2>
                            <p className="text-sm text-slate-500 font-bold leading-relaxed mb-12 px-2 italic">
                                Are you sure you want to change this agent's status to <span className="text-slate-900 font-black underline decoration-violet-600/40">{pendingAction}</span>?
                            </p>
                            <div className="flex flex-col gap-5">
                                <button
                                    onClick={confirmAction}
                                    className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                                >
                                    Confirm Action
                                </button>
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    className="w-full py-5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeliveryAgentReview;

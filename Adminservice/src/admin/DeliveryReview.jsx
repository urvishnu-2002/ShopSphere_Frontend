import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    ArrowLeft, CheckCircle, XCircle, Mail, Phone, MapPin,
    Calendar, ShieldCheck, User, FileText, AlertTriangle,
    Activity, Loader2, Truck, CreditCard, Landmark, ArrowUpRight,
    ShieldAlert, Fingerprint, Banknote, MapPinned
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDeliveryAgentDetail, approveDeliveryAgent, rejectDeliveryAgent, blockDeliveryAgent, unblockDeliveryAgent, logout } from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
};

const DeliveryReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [agent, setAgent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActioning, setIsActioning] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const loadAgentData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchDeliveryAgentDetail(id);
                setAgent(data);
            } catch (error) {
                console.error("Failed to load agent details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAgentData();
    }, [id]);

    const handleAction = async (action) => {
        setIsActioning(true);
        try {
            if (action === 'Approved') {
                await approveDeliveryAgent(id, "Approved by admin");
            } else if (action === 'Rejected') {
                const reason = prompt("Rejection reason:") || "Rejected by admin";
                await rejectDeliveryAgent(id, reason);
            } else if (action === 'Blocked') {
                const reason = prompt("Blocking reason:") || "Blocked by admin";
                await blockDeliveryAgent(id, reason);
            } else if (action === 'Unblocked') {
                await unblockDeliveryAgent(id);
            }
            navigate('/delivery/agents');
        } catch (error) {
            console.error("Action execution failed:", error);
        } finally {
            setIsActioning(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`flex h-screen items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                        <Truck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-500" />
                    </div>
                    <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Synchronizing Fleet Telemetry</p>
                </div>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className={`flex h-screen items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
                <div className="text-center max-w-sm px-6">
                    <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <AlertTriangle className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Node Disconnected</h2>
                    <p className="text-slate-500 text-sm mb-8">The requested logistics agent protocol could not be retrieved from the central index.</p>
                    <button onClick={() => navigate(-1)} className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-semibold uppercase tracking-normal hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">Return to Registry</button>
                </div>
            </div>
        );
    }

    const canApprove = agent.approval_status === 'pending';
    const canReject = agent.approval_status === 'pending';
    const canBlock = agent.approval_status === 'approved' && !agent.is_blocked;
    const canUnblock = agent.is_blocked;

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Delivery Agents" onLogout={logout} />

            <div className="flex-1 flex flex-col min-w-0 relative">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className={`text-lg font-bold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Entity Dossier</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Security Clearance Review</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                            <ShieldAlert className="w-3.5 h-3.5" /> Compliance Pending
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-5xl mx-auto space-y-8 pb-32">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-[3rem] p-8 md:p-12 relative overflow-hidden border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-2xl shadow-blue-500/5' : 'bg-white border-slate-100 shadow-sm'}`}
                        >
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                    <div className={`relative w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-5xl font-semibold transition-all ${isDarkMode ? 'bg-slate-900 text-white border border-slate-700' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'}`}>
                                        {agent.user_username?.charAt(0) || 'A'}
                                    </div>
                                    <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${agent.is_blocked ? (isDarkMode ? 'bg-rose-500 border-slate-900 text-white' : 'bg-rose-600 border-white text-white') :
                                        agent.approval_status === 'approved' ? (isDarkMode ? 'bg-emerald-500 border-slate-900 text-white' : 'bg-emerald-600 border-white text-white') :
                                            (isDarkMode ? 'bg-amber-500 border-slate-900 text-white' : 'bg-amber-600 border-white text-white')
                                        }`}>
                                        {agent.is_blocked ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-semibold uppercase tracking-normal border ${agent.is_blocked ? (isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100') :
                                            agent.approval_status === 'approved' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100') :
                                                (isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100')
                                            }`}>
                                            {agent.is_blocked ? 'Restricted Access' : agent.approval_status + ' Status'}
                                        </span>
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-semibold uppercase tracking-normal border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            PROTOCOL ID: {agent.id}
                                        </span>
                                    </div>
                                    <h2 className={`text-4xl font-semibold tracking-normal mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{agent.user_username || 'Logistics Operational Agent'}</h2>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                            <Mail className="w-4 h-4 text-blue-500" /> {agent.user_email}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                            <Phone className="w-4 h-4 text-blue-500" /> {agent.phone_number}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Details */}
                            <section className={`rounded-[2.5rem] p-8 border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-normal mb-8 flex items-center gap-2">
                                    <Fingerprint className="w-4 h-4 text-blue-500" /> Identity Matrix
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                    {[
                                        { label: 'Agent Alias', value: agent.user_username, icon: User },
                                        { label: 'Date of Birth', value: agent.date_of_birth ? new Date(agent.date_of_birth).toLocaleDateString() : 'N/A', icon: Calendar },
                                        { label: 'Service Entry', value: new Date(agent.created_at).toLocaleDateString(), icon: Activity },
                                        { label: 'Current Geo', value: agent.city + ', ' + agent.state, icon: MapPin }
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-1">
                                            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal flex items-center gap-1.5"><item.icon className="w-3 h-3" /> {item.label}</p>
                                            <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-transparent shadow-inner'}`}>
                                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-2 flex items-center gap-1.5"><MapPinned className="w-3 h-3" /> Registry Address</p>
                                    <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {agent.address}<br />
                                        {agent.city}, {agent.state} - {agent.postal_code}
                                    </p>
                                </div>
                            </section>

                            {/* Vehicle Details */}
                            <section className={`rounded-[2.5rem] p-8 border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-normal mb-8 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-emerald-500" /> Logistic Hardware
                                </h3>
                                <div className="space-y-6">
                                    <div className={`p-8 rounded-3xl border flex flex-col items-center justify-center gap-4 relative overflow-hidden group ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-blue-400' : 'bg-blue-50 border-transparent text-blue-600 shadow-inner'}`}>
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                            <Truck className="w-24 h-24" />
                                        </div>
                                        <Truck className="w-12 h-12 relative z-10" />
                                        <div className="text-center relative z-10">
                                            <p className="text-[10px] font-semibold uppercase tracking-normal opacity-60 mb-1">Unit Model / Type</p>
                                            <p className={`text-2xl font-semibold uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{agent.vehicle_type}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-transparent'}`}>
                                            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-1">Plate Registry</p>
                                            <p className={`text-sm font-semibold font-mono tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{agent.vehicle_number}</p>
                                        </div>
                                        <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-transparent'}`}>
                                            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-1">Capacity Index</p>
                                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{agent.vehicle_type === 'Truck' ? 'HIGH LOAD' : 'STANDARD'}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Bank Details */}
                            <section className={`rounded-[2.5rem] p-8 border transition-all duration-300 md:col-span-2 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-normal mb-8 flex items-center gap-2">
                                    <Banknote className="w-4 h-4 text-emerald-500" /> Settlement Protocol
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Target Bank', value: agent.bank_name, icon: Landmark },
                                        { label: 'Beneficiary', value: agent.bank_holder_name, icon: User },
                                        { label: 'Account Protocol', value: agent.bank_account_number, icon: CreditCard, mono: true },
                                        { label: 'Routing Code (IFSC)', value: agent.bank_ifsc_code, icon: Activity, mono: true }
                                    ].map((bank, i) => (
                                        <div key={i} className={`p-6 rounded-3xl border transition-all hover:translate-y-[-2px] ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/50' : 'bg-slate-50 border-transparent hover:border-emerald-200 shadow-sm'}`}>
                                            <div className="flex items-center gap-3 mb-3 text-emerald-500">
                                                <bank.icon className="w-4 h-4" />
                                                <p className="text-[9px] font-semibold uppercase tracking-normal opacity-60">{bank.label}</p>
                                            </div>
                                            <p className={`text-sm font-bold truncate ${bank.mono ? 'font-mono' : ''} ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{bank.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Compliance Documents */}
                            <section className={`rounded-[2.5rem] p-8 border transition-all duration-300 md:col-span-2 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-normal mb-8 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" /> Compliance Artifacts
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {[
                                        { title: 'Aadhaar Card', type: 'Biological ID', detail: agent.aadhar_number, file: agent.aadhar_card_file || agent.aadhar_file, iconColor: 'text-emerald-500' },
                                        { title: 'PAN Card', type: 'Tax Identification', detail: agent.pan_number, file: agent.pan_card_file || agent.pan_file, iconColor: 'text-amber-500' },
                                        { title: 'Driving License', type: 'Pilot Auth', detail: agent.license_number, expiry: agent.license_expires, file: agent.license_file, iconColor: 'text-blue-500' },
                                        { title: 'Biometric Check', type: 'Visual Selfie', detail: 'Agent Matching', file: agent.selfie_with_id || agent.selfie, iconColor: 'text-rose-500' },
                                        { title: 'Identity Matrix', type: agent.id_type, detail: agent.id_number, file: agent.id_proof_file, iconColor: 'text-blue-500' },
                                        { title: 'Vehicle Registry', type: 'Unit RC', detail: agent.vehicle_number, file: agent.vehicle_registration, iconColor: 'text-emerald-500' },
                                        { title: 'Fulfillment Ins.', type: 'Unit Policy', detail: 'Verified Scan', file: agent.vehicle_insurance, iconColor: 'text-rose-500' },
                                        { title: 'Extended Artifacts', type: 'Supporting Logs', detail: 'Additional Files', file: agent.additional_documents, iconColor: 'text-slate-500' }
                                    ].map((doc, idx) => (
                                        doc.file ? (
                                            <div key={idx}
                                                onClick={() => window.open(getMediaUrl(doc.file), '_blank')}
                                                className={`p-5 rounded-3xl border group cursor-pointer transition-all hover:translate-y-[-4px] ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 shadow-2xl shadow-blue-500/5' : 'bg-slate-50 border-transparent hover:border-blue-200 shadow-inner hover:shadow-lg hover:shadow-blue-100'}`}
                                            >
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'} ${doc.iconColor}`}>
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{doc.title}</p>
                                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal opacity-70">{doc.type}</p>
                                                    </div>
                                                </div>
                                                <div className={`pt-4 border-t transition-colors ${isDarkMode ? 'border-slate-800' : 'border-blue-100'}`}>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[10px] font-mono font-bold text-slate-500 truncate">{doc.detail || 'SECURE SCAN'}</p>
                                                        <ArrowUpRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                                                    </div>
                                                    {doc.expiry && (
                                                        <p className="text-[9px] font-semibold text-rose-500 mt-2 uppercase tracking-normal flex items-center gap-1">
                                                            <Calendar className="w-2.5 h-2.5" /> Exp: {new Date(doc.expiry).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>

                {/* Sticky Action Footer */}
                <div className={`fixed bottom-0 right-0 left-0 border-t backdrop-blur-xl transition-all duration-300 py-6 px-10 z-[100] ${isDarkMode ? 'bg-[#0f172a]/90 border-slate-800 shadow-2xl shadow-black/50' : 'bg-white/90 border-slate-100 shadow-2xl shadow-slate-200'}`} style={{ marginLeft: isSidebarOpen ? '280px' : '8rem' }}>
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal leading-none mb-1">Fleet Security Node {agent.id}</p>
                                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Decision Required: {agent.user_username}</h4>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {canReject && (
                                <button
                                    onClick={() => handleAction('Rejected')}
                                    disabled={isActioning}
                                    className={`flex-1 md:flex-none px-8 py-3.5 rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400' : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600'
                                        }`}
                                >
                                    Reject Protocol
                                </button>
                            )}
                            {canBlock && (
                                <button
                                    onClick={() => handleAction('Blocked')}
                                    disabled={isActioning}
                                    className={`flex-1 md:flex-none px-8 py-3.5 rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all ${isDarkMode ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 border border-rose-500/20 hover:text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100'
                                        }`}
                                >
                                    Revoke Access
                                </button>
                            )}
                            {canUnblock && (
                                <button
                                    onClick={() => handleAction('Unblocked')}
                                    disabled={isActioning}
                                    className="flex-1 md:flex-none px-8 py-3.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-semibold uppercase tracking-normal shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
                                >
                                    Restore Protocol
                                </button>
                            )}
                            {canApprove && (
                                <button
                                    onClick={() => handleAction('Approved')}
                                    disabled={isActioning}
                                    className="flex-1 md:flex-none px-12 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-semibold uppercase tracking-normal shadow-xl shadow-blue-600/20 hover:bg-blue-500 hover:translate-y-[-2px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck className="w-4 h-4" /> Authorize Entity
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryReview;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Building2,
    User,
    FileText,
    AlertTriangle,
    Clock,
    Activity,
    Store,
    Camera,
    Image,
    Ban,
    ExternalLink,
    Zap,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { fetchVendorDetail, approveVendorRequest, rejectVendorRequest, blockVendor, unblockVendor, logout } from '../api/axios';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
};

const VendorReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { markAsRead } = useNotifications();
    const [vendor, setVendor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActioning, setIsActioning] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const hasMarkedRef = useRef(false);

    useEffect(() => {
        const loadVendorData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchVendorDetail(id);
                setVendor(data);

                if (!hasMarkedRef.current && data.notifId) {
                    markAsRead(data.notifId);
                    hasMarkedRef.current = true;
                }
            } catch (error) {
                console.error("Failed to load vendor details:", error);
                toast.error("Cloud synchronization failed");
            } finally {
                setIsLoading(false);
            }
        };

        loadVendorData();
    }, [id, markAsRead]);

    const handleActionClick = (action) => {
        setPendingAction(action);
        setIsActionModalOpen(true);
    };

    const confirmAction = async () => {
        if (!pendingAction || !vendor) return;

        setIsActioning(true);
        setIsActionModalOpen(false);

        try {
            if (pendingAction === "Approved") {
                await approveVendorRequest(vendor.id);
                toast.success("Security Clearance Granted");
            } else if (pendingAction === "Blocked") {
                await blockVendor(vendor.id, "Actioned via Management Review");
                toast.success("Security Block Engaged");
            } else if (pendingAction === "Unblocked") {
                await unblockVendor(vendor.id);
                toast.success("Access Restored");
            } else {
                await rejectVendorRequest(vendor.id, "Declined via Security Review");
                toast.error("Protocol Terminated");
            }
            navigate('/vendors');
        } catch (error) {
            console.error("Action execution failed:", error);
            toast.error("Governance Error");
        } finally {
            setIsActioning(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`flex h-screen items-center justify-center font-sans ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className={`w-16 h-16 border-4 rounded-full shadow-2xl ${isDarkMode ? 'border-slate-800 border-t-blue-500' : 'border-slate-100 border-t-blue-600'}`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className={`text-[10px] font-semibold uppercase tracking-normal mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Synchronizing Identity</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Pulling Node_{id} Metadata...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className={`flex h-screen items-center justify-center font-sans ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
                <div className="text-center max-w-sm px-6">
                    <div className={`w-28 h-28 rounded-[3.5rem] border shadow-xl flex items-center justify-center mx-auto mb-10 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                        <AlertTriangle className="w-12 h-12 text-amber-500" />
                    </div>
                    <h2 className={`text-2xl font-semibold mb-3 tracking-normal uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Node Offline</h2>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed mb-12 uppercase tracking-normal">The requested merchant identity is no longer broadcasting in this domain.</p>
                    <button
                        onClick={() => navigate('/vendors')}
                        className={`w-full py-5 rounded-[2rem] text-[10px] font-semibold uppercase tracking-normal shadow-2xl transition-all ${isDarkMode ? 'bg-blue-600 text-white shadow-blue-900/40 hover:bg-blue-500' : 'bg-slate-900 text-white shadow-slate-200 hover:scale-105'}`}
                    >
                        Return to Mainframe
                    </button>
                </div>
            </div>
        );
    }

    const canApprove = vendor.approval_status === 'pending';
    const canBlock = vendor.approval_status === 'approved' && !vendor.is_blocked;
    const canUnblock = vendor.is_blocked;
    const canReject = vendor.approval_status === 'pending';

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Vendors" onLogout={logout} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-20 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className={`w-px h-6 hidden sm:block mx-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-lg font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {vendor.approval_status === 'approved' ? 'Partner Audit' : 'Security Clearance'}
                                </h1>
                                <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-normal ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>Priority</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal flex items-center gap-2">
                                <Zap className="w-3 h-3 text-amber-500" /> Identity Hub Node_{vendor.id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <ShieldCheck className="w-3.5 h-3.5" /> Registry Protocol 2.4
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
                    <div className="max-w-6xl mx-auto space-y-8 pb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className={`rounded-[3rem] p-8 md:p-12 border shadow-sm relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-blue-500/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}
                        >
                            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                                <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-5xl font-semibold shadow-2xl transition-all duration-500 overflow-hidden hover:scale-110 ${isDarkMode ? 'bg-blue-600 text-white shadow-blue-900/40' : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-200'}`}>
                                    {vendor.user_profile_image ? (
                                        <img src={getMediaUrl(vendor.user_profile_image)} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        (vendor.shop_name || "V").charAt(0)
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-4">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                        <span className={`px-5 py-1.5 rounded-xl text-[9px] font-semibold uppercase tracking-normal border transition-all ${vendor.is_blocked ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                            vendor.approval_status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {vendor.is_blocked ? 'Restricted' : vendor.approval_status}
                                        </span>
                                        <span className={`text-[9px] font-semibold uppercase tracking-normal px-5 py-1.5 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>Hash: {vendor.id}</span>
                                    </div>
                                    <h2 className={`text-4xl font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{vendor.shop_name}</h2>
                                    <p className={`font-bold max-w-2xl text-xs leading-relaxed uppercase tracking-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{vendor.shop_description || "Authenticated Merchant Node - No additional broadcast description provided."}</p>
                                </div>
                                <div className="hidden lg:flex flex-col items-end gap-3 text-right">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-normal">Onboarding Timestamp</p>
                                        <p className={`text-base font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{new Date(vendor.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                    </div>
                                    <button
                                        onClick={() => setIsDocModalOpen(true)}
                                        className={`mt-4 px-8 py-3.5 rounded-2xl text-[9px] font-semibold uppercase tracking-normal transition-all flex items-center gap-3 border shadow-lg ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-blue-500' : 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 shadow-slate-200'}`}
                                    >
                                        <FileText className="w-4 h-4" /> Inspect Registry Files
                                    </button>
                                </div>
                            </div>

                            {(vendor.blocked_reason || vendor.rejection_reason) && (
                                <div className={`mt-10 border rounded-[2rem] p-6 flex items-start gap-5 transition-all duration-300 ${isDarkMode ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50/50 border-rose-100'}`}>
                                    <AlertTriangle className="w-5 h-5 text-rose-500 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-semibold text-rose-600 uppercase tracking-normal mb-2">Security Override Remarks</p>
                                        <p className={`text-sm font-bold leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{vendor.blocked_reason || vendor.rejection_reason}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Detailed Info */}
                            <div className="lg:col-span-2 space-y-8">
                                <motion.section
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                                    className={`rounded-[3rem] p-10 border shadow-sm transition-all duration-500 group ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 hover:bg-[#1e293b]/80' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'}`}
                                >
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <h3 className={`text-[11px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Merchant Core Protocol</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal block">Entity Designation</label>
                                            <p className={`text-base font-semibold tracking-normal ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.shop_name}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal block">Sector Classification</label>
                                            <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{vendor.business_type}</p>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal block">Global Endpoint (HQ)</label>
                                            <p className={`text-sm font-bold flex items-start gap-3 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                                                <MapPin className="w-4 h-4 text-slate-500 mt-1 flex-shrink-0" /> {vendor.address}
                                            </p>
                                        </div>
                                        <div className="space-y-2 p-5 rounded-3xl border transition-colors border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40">
                                            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal block">GST Authentication</label>
                                            <p className={`text-sm font-semibold tracking-normal uppercase ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.gst_number || 'NULL'}</p>
                                        </div>
                                        <div className="space-y-2 p-5 rounded-3xl border transition-colors border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40">
                                            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal block">PAN Resource ID</label>
                                            <p className={`text-sm font-semibold tracking-normal uppercase ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.pan_number || 'NULL'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal block">Legal Entity Name (PAN)</label>
                                            <p className={`text-base font-semibold tracking-normal ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.pan_name || 'NOT VERIFIED'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal block">Logistics Tariff Base</label>
                                            <p className={`text-lg font-semibold tracking-normal ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>₹{parseFloat(vendor.shipping_fee || 0).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </motion.section>

                                <motion.section
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                                    className={`rounded-[3rem] p-10 border shadow-sm transition-all duration-500 group ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 hover:bg-[#1e293b]/80' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'}`}
                                >
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <h3 className={`text-[11px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Settlement Node_ALPHA</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal block">Beneficiary Identity</label>
                                            <p className={`text-base font-semibold tracking-normal ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.bank_holder_name || 'SECURITY_NULL'}</p>
                                        </div>
                                        <div className="hidden md:block" />
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal block">Encryption Account String</label>
                                            <p className={`text-base font-semibold tracking-normal  ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.bank_account_number || '********'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal block">Routing Code (IFSC)</label>
                                            <p className={`text-sm font-semibold tracking-normal uppercase ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{vendor.bank_ifsc_code || 'NULL'}</p>
                                        </div>
                                    </div>
                                </motion.section>

                                <motion.section
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                                    className={`rounded-[3rem] p-10 border shadow-sm transition-all duration-500 group ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 hover:bg-[#1e293b]/80' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'}`}
                                >
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <h3 className={`text-[11px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Identity Verification Assets</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {vendor.id_proof_file && (
                                            <div
                                                className={`group p-6 rounded-3xl border flex items-center justify-between transition-all cursor-pointer ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-blue-500/50' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:border-blue-200'}`}
                                                onClick={() => window.open(getMediaUrl(vendor.id_proof_file), '_blank')}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-white border-slate-200 text-blue-600 shadow-sm'}`}>
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{vendor.id_type || 'Identity Proof'}</p>
                                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal">{vendor.id_number || 'Official ID'}</p>
                                                    </div>
                                                </div>
                                                <ExternalLink className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                                            </div>
                                        )}

                                        {vendor.pan_card_file && (
                                            <div
                                                className={`group p-6 rounded-3xl border flex items-center justify-between transition-all cursor-pointer ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-rose-500/50' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:border-rose-200'}`}
                                                onClick={() => window.open(getMediaUrl(vendor.pan_card_file), '_blank')}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-rose-400' : 'bg-white border-slate-200 text-rose-600 shadow-sm'}`}>
                                                        <ShieldCheck className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tax Resource ID</p>
                                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal">{vendor.pan_number || 'Tax Asset'}</p>
                                                    </div>
                                                </div>
                                                <ExternalLink className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} />
                                            </div>
                                        )}

                                        {vendor.additional_documents && (
                                            <div
                                                className={`group p-6 rounded-3xl border flex items-center justify-between transition-all cursor-pointer md:col-span-2 ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-amber-500/50' : 'bg-amber-50/30 border-amber-100 hover:bg-white hover:shadow-xl hover:border-amber-200'}`}
                                                onClick={() => window.open(getMediaUrl(vendor.additional_documents), '_blank')}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-amber-200 text-amber-600 shadow-sm'}`}>
                                                        <Zap className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Compliance Bundle</p>
                                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal">GSTIN / Merchant Trade License Artifacts</p>
                                                    </div>
                                                </div>
                                                <ExternalLink className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                                            </div>
                                        )}

                                        {vendor.selfie_with_id && (
                                            <div
                                                className={`group p-6 rounded-3xl border flex items-center justify-between transition-all cursor-pointer md:col-span-2 ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-900 hover:border-blue-500/50' : 'bg-blue-50/30 border-blue-100 hover:bg-white hover:shadow-xl hover:border-blue-200'}`}
                                                onClick={() => window.open(getMediaUrl(vendor.selfie_with_id), '_blank')}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-white border-blue-200 text-blue-600 shadow-sm'}`}>
                                                        <Camera className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Selfie Verification</p>
                                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal">Face Match with ID Asset</p>
                                                    </div>
                                                </div>
                                                <ExternalLink className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                                            </div>
                                        )}
                                    </div>
                                </motion.section>
                            </div>

                            {/* Contact & Registry Info */}
                            <div className="space-y-8">
                                <motion.section
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                                    className={`rounded-[3rem] p-10 border shadow-sm transition-all duration-500 group ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 hover:bg-[#1e293b]/80' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'}`}
                                >
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-slate-500' : 'bg-slate-50 text-slate-400 shadow-inner'}`}>
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal">Endpoint Comms</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-800 group-hover:bg-slate-900' : 'bg-slate-50/50 border-slate-100 group-hover:bg-white group-hover:shadow-md'}`}>
                                            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-2">Authenticated Email</p>
                                            <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.user_email || 'NULL_SIGNAL'}</p>
                                        </div>

                                        <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-800 group-hover:bg-slate-900' : 'bg-slate-50/50 border-slate-100 group-hover:bg-white group-hover:shadow-md'}`}>
                                            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-2">Secure Link Hotline</p>
                                            <p className={`text-sm font-semibold tracking-normal ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.user_phone || 'DISCONNECTED'}</p>
                                        </div>
                                    </div>
                                </motion.section>

                                <motion.section
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
                                    className={`p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group transition-all duration-700 cursor-help ${isDarkMode ? 'bg-gradient-to-br from-blue-700 to-blue-900 shadow-blue-950/50' : 'bg-blue-600 shadow-blue-200'}`}
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <ShieldCheck className="w-5 h-5 text-blue-300" />
                                            <span className="text-[10px] font-semibold uppercase tracking-normal text-blue-100">Core Compliance</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-blue-50/70 leading-relaxed mb-8 uppercase tracking-normal">Global merchant verification complete. All security parameters are currently within nominal operation ranges for Node_{vendor.id}.</p>
                                        <div className="h-2 w-full bg-blue-900/40 rounded-full overflow-hidden mb-2">
                                            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, delay: 1 }} className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                                        </div>
                                        <div className="flex justify-between text-[8px] font-semibold uppercase tracking-normal text-blue-300/80">
                                            <span>Encryption Active</span>
                                            <span>Registry Synced</span>
                                        </div>
                                    </div>
                                    <Activity className="absolute -bottom-10 -right-10 w-44 h-44 text-white opacity-[0.03] group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000" />
                                </motion.section>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer Action Bar */}
                <div className={`fixed bottom-0 right-0 left-0 border-t p-6 z-40 transition-all duration-300 backdrop-blur-md ${isDarkMode ? 'bg-[#0f172a]/95 border-slate-800' : 'bg-white/95 border-slate-100'}`} style={{ left: isSidebarOpen ? '280px' : '80px' }}>
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div>
                            <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Administrative Governance</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal mt-0.5">Decision finalized upon authentication</p>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            {canBlock && (
                                <button
                                    onClick={() => handleActionClick('Blocked')}
                                    disabled={isActioning}
                                    className={`flex-1 sm:flex-none px-8 py-3.5 border rounded-xl font-bold text-[10px] uppercase tracking-normal transition-all disabled:opacity-50 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50' : 'bg-white border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200'}`}
                                >
                                    Force Block
                                </button>
                            )}

                            {canUnblock && (
                                <button
                                    onClick={() => handleActionClick('Unblocked')}
                                    disabled={isActioning}
                                    className={`flex-1 sm:flex-none px-8 py-3.5 border rounded-xl font-bold text-[10px] uppercase tracking-normal transition-all disabled:opacity-50 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50' : 'bg-white border-slate-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200'}`}
                                >
                                    Unblock Access
                                </button>
                            )}

                            {canReject && (
                                <button
                                    onClick={() => handleActionClick('Rejected')}
                                    disabled={isActioning}
                                    className={`flex-1 sm:flex-none px-8 py-3.5 border rounded-xl font-bold text-[10px] uppercase tracking-normal transition-all disabled:opacity-50 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Reject Entry
                                </button>
                            )}

                            {canApprove && (
                                <button
                                    onClick={() => handleActionClick('Approved')}
                                    disabled={isActioning}
                                    className={`flex-1 sm:flex-none px-10 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-normal shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 min-w-[200px] ${isDarkMode ? 'bg-blue-600 text-white shadow-blue-900/40 hover:bg-blue-500' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'}`}
                                >
                                    {isActioning ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Authorizing...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-4 h-4 text-blue-200" />
                                            Publish Clearance
                                        </>
                                    )}
                                </button>
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
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                            onClick={() => setIsActionModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className={`rounded-[3rem] p-16 max-w-sm w-full relative z-10 shadow-2xl text-center border transition-colors ${isDarkMode ? 'bg-[#1e293b] border-slate-700 shadow-slate-950/50' : 'bg-white border-slate-200'}`}
                        >
                            <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center mb-12 border mx-auto transition-colors ${pendingAction === 'Blocked' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
                                {pendingAction === 'Blocked' ? <AlertTriangle className="w-14 h-14 text-rose-500" /> : <ShieldCheck className="w-14 h-14 text-blue-500" />}
                            </div>
                            <h2 className={`text-3xl font-semibold mb-6 tracking-normal uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Review Execution</h2>
                            <p className="text-sm text-slate-500 font-bold leading-relaxed mb-12 px-2">
                                Modifying partner status to <span className={`font-semibold uppercase tracking-normal underline decoration-blue-600/40 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{pendingAction}</span>. Confirm?
                            </p>
                            <div className="flex flex-col gap-5">
                                <button
                                    onClick={confirmAction}
                                    className={`w-full py-5 rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/40' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'}`}
                                >
                                    Execute Order
                                </button>
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    className={`w-full py-5 border rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    Decline Operation
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Documents Modal */}
            <AnimatePresence>
                {isDocModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                            onClick={() => setIsDocModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className={`rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col border transition-colors ${isDarkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-100'}`}
                        >
                            <div className={`p-8 border-b flex items-center justify-between transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                <div>
                                    <h2 className={`text-2xl font-semibold tracking-normal flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <ShieldCheck className="w-6 h-6 text-blue-500" /> Verification Bundle
                                    </h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal mt-1">Official Documents for {vendor.shop_name}</p>
                                </div>
                                <button
                                    onClick={() => setIsDocModalOpen(false)}
                                    className={`p-3 rounded-2xl transition-all font-bold ${isDarkMode ? 'hover:bg-slate-800 text-slate-500 hover:text-white' : 'hover:bg-white text-slate-400 hover:text-slate-900'}`}
                                >
                                    Esc
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                {vendor.selfie_with_id && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                            <h3 className={`text-xs font-semibold uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Selfie Confirmation</h3>
                                        </div>
                                        <div className={`relative group rounded-3xl overflow-hidden border-4 shadow-xl max-w-2xl mx-auto ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-50 bg-slate-50'}`}>
                                            <img
                                                src={getMediaUrl(vendor.selfie_with_id)}
                                                alt="Selfie"
                                                className="w-full h-auto max-h-[500px] object-contain"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {vendor.id_proof_file && (
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal px-2">Govt Issued ID ({vendor.id_type})</h3>
                                            <div
                                                className={`p-8 rounded-3xl border-2 border-dashed transition-all group cursor-pointer ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5' : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}
                                                onClick={() => window.open(getMediaUrl(vendor.id_proof_file), '_blank')}
                                            >
                                                <div className="flex flex-col items-center text-center gap-4">
                                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600'}`}>
                                                        <FileText className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>View ID Document</p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Type: {vendor.id_type} · Ref: {vendor.id_number}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {vendor.pan_card_file && (
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal px-2">Tax Asset (PAN)</h3>
                                            <div
                                                className={`p-8 rounded-3xl border-2 border-dashed transition-all group cursor-pointer ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5' : 'bg-slate-50 border-slate-200 hover:border-rose-400 hover:bg-rose-50/30'}`}
                                                onClick={() => window.open(getMediaUrl(vendor.pan_card_file), '_blank')}
                                            >
                                                <div className="flex flex-col items-center text-center gap-4">
                                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-slate-800 text-rose-400' : 'bg-white text-rose-500'}`}>
                                                        <ShieldCheck className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>View PAN Asset</p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Name: {vendor.pan_name} · Ref: {vendor.pan_number}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {vendor.additional_documents && (
                                        <div className="space-y-4 md:col-span-2">
                                            <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal px-2">Supporting Evidence</h3>
                                            <div
                                                className={`p-8 rounded-3xl border-2 border-dashed transition-all group cursor-pointer ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5' : 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100/20'}`}
                                                onClick={() => window.open(getMediaUrl(vendor.additional_documents), '_blank')}
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-500'}`}>
                                                        <FileText className="w-8 h-8" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Verification Bundle (GSTIN/Trade)</p>
                                                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-normal">Supplemental business verification documents</p>
                                                    </div>
                                                    <div className={`px-6 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-normal shadow-sm transition-colors ${isDarkMode ? 'bg-slate-800 text-white group-hover:bg-blue-600' : 'bg-white text-slate-900 group-hover:bg-slate-900 group-hover:text-white'}`}>Open File ↗</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`p-8 border-t flex justify-end transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/30 border-slate-100'}`}>
                                <button
                                    onClick={() => setIsDocModalOpen(false)}
                                    className={`px-10 py-4 rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'}`}
                                >
                                    Dismiss Profile Docs
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorReview;

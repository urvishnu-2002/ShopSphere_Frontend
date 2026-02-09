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
    Building2,
    User,
    FileText,
    AlertTriangle,
    Clock,
    Activity,
    PanelLeftClose,
    PanelLeftOpen,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { useVendors } from '../context/VendorContext';
import { useNotifications } from '../context/NotificationContext';

const VendorReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { vendors, updateVendorStatus } = useVendors();
    const { markAsRead } = useNotifications();
    const [vendor, setVendor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActioning, setIsActioning] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const hasMarkedRef = useRef(false);

    useEffect(() => {
        // Find vendor by ID or by notifId
        const foundVendor = vendors.find(v => v.id === id || v.notifId === id);

        if (foundVendor) {
            setVendor(foundVendor);
            setIsLoading(false);

            // Automatically mark as read if it's a notification-based view
            if (!hasMarkedRef.current && foundVendor.notifId) {
                markAsRead(foundVendor.notifId);
                hasMarkedRef.current = true;
            }
        } else {
            const timer = setTimeout(() => setIsLoading(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [id, vendors, markAsRead]);

    const handleActionClick = (action) => {
        setPendingAction(action);
        setIsActionModalOpen(true);
    };

    const confirmAction = async () => {
        if (!pendingAction || !vendor) return;

        setIsActioning(true);
        setIsActionModalOpen(false);

        const success = await updateVendorStatus(vendor.id, pendingAction, vendor.notifId);

        setIsActioning(false);
        if (success) {
            navigate('/vendors');
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white font-sans">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full shadow-2xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Authorization Layer</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Decrypting Vendor Profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
                <div className="text-center max-w-sm px-6">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex items-center justify-center mx-auto mb-8">
                        <AlertTriangle className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Access Restricted</h2>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">The vendor credential you are looking for is either archived or the token has expired.</p>
                    <button
                        onClick={() => navigate('/vendors')}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-105 transition-all"
                    >
                        Return to Registry
                    </button>
                </div>
            </div>
        );
    }

    // Determine available actions based on current status
    const canApprove = vendor.status === 'Pending' || vendor.status === 'Suspended';
    const canSuspend = vendor.status === 'Approved';
    const canBlock = vendor.status !== 'Blocked';

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-900">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Vendors" onLogout={() => window.location.href = '/'} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-20">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="w-px h-8 bg-slate-100 hidden sm:block" />
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Security Review</h1>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-indigo-500" /> Profiling: {vendor.id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="hidden lg:flex items-center bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest gap-2">
                            <ShieldCheck className="w-3.5 h-3.5" /> High Clearance
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-5xl mx-auto space-y-10 pb-40">
                        {/* Status Hero Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl shadow-slate-200 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Compliance Score</p>
                                    <p className="text-2xl font-black">{vendor.riskScore === 'Low' ? '98.2%' : '84.5%'}</p>
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-indigo-500/20">
                                    {vendor.storeName.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/20 ${vendor.status === 'Approved' ? 'text-emerald-400' :
                                            vendor.status === 'Pending' ? 'text-amber-400' : 'text-rose-400'
                                            }`}>
                                            {vendor.status}
                                        </span>
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Joined On {vendor.registrationDate}</span>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight mb-2">{vendor.storeName}</h2>
                                    <p className="text-white/60 font-medium max-w-xl text-sm leading-relaxed">{vendor.description}</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Detailed Info */}
                            <div className="lg:col-span-2 space-y-10">
                                <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 scale-150 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                                        <Building2 className="w-32 h-32" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Business Identity
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block">Legal Entity Name</label>
                                            <p className="text-base font-bold text-slate-900">{vendor.legalName}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block">Registered Region</label>
                                            <p className="text-base font-bold text-slate-900 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-300" /> {vendor.address}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block">Business Category</label>
                                            <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100">{vendor.category}</span>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 block">Tax Certification ID</label>
                                            <p className="text-base font-bold text-slate-900 font-mono tracking-tighter italic">TXN-00-{vendor.id.split('-')[2]}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Submitted Documents
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {vendor.documents.map((doc, idx) => (
                                            <div key={idx} className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{doc.type} • {doc.size}</p>
                                                    </div>
                                                </div>
                                                <motion.div whileHover={{ x: 5 }} className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                                    <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180" />
                                                </motion.div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Contact & Risk */}
                            <div className="space-y-10">
                                <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Contact Root
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-5 p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-xl text-indigo-600 shadow-inner">
                                                {vendor.owner.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 leading-tight">{vendor.owner}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Primary Principal</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 px-2">
                                            <div className="flex items-center gap-4 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer group">
                                                <div className="w-9 h-9 bg-slate-50 flex items-center justify-center rounded-xl group-hover:bg-indigo-50">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                {vendor.email}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer group">
                                                <div className="w-9 h-9 bg-slate-50 flex items-center justify-center rounded-xl group-hover:bg-indigo-50">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                {vendor.phone}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Risk Assessment
                                    </h3>

                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center relative overflow-hidden group">
                                        <div className={`text-2xl font-black mb-1 ${vendor.riskScore === 'Low' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {vendor.riskScore}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Confidence</div>

                                        <div className="mt-6 flex justify-center gap-1.5">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={`w-1.5 h-6 rounded-full ${i <= (vendor.riskScore === 'Low' ? 4 : 3) ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer Action Bar */}
                <div className={`fixed bottom-0 right-0 left-0 bg-white/80 backdrop-blur-3xl border-t border-slate-100 p-6 z-40 transition-all duration-500 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)]`} style={{ left: isSidebarOpen ? '280px' : '80px' }}>
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div>
                            <h4 className="text-sm font-black text-slate-900 tracking-tight">Security Clearing</h4>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Action will be logged: Admin_Super_001</p>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            {canBlock && (
                                <button
                                    onClick={() => handleActionClick('Blocked')}
                                    disabled={isActioning}
                                    className="flex-1 sm:flex-none px-10 py-4 bg-white border-2 border-slate-200 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 transition-all disabled:opacity-50"
                                >
                                    Block ID
                                </button>
                            )}

                            {canSuspend && (
                                <button
                                    onClick={() => handleActionClick('Suspended')}
                                    disabled={isActioning}
                                    className="flex-1 sm:flex-none px-10 py-4 bg-white border-2 border-slate-200 text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-50 hover:border-amber-100 transition-all disabled:opacity-50"
                                >
                                    Suspend Access
                                </button>
                            )}

                            {canApprove && (
                                <button
                                    onClick={() => handleActionClick('Approved')}
                                    disabled={isActioning}
                                    className="flex-1 sm:flex-none px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3 min-w-[180px]"
                                >
                                    {isActioning ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                            Authorizing...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                            Grant Clearance
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
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                            onClick={() => setIsActionModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[3rem] p-12 max-w-sm w-full relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 text-center"
                        >
                            <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-rose-100 mx-auto">
                                <AlertTriangle className="w-12 h-12 text-rose-500" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Final Warning</h2>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 px-2 italic">
                                Changing status to <span className="text-slate-900 font-bold uppercase tracking-widest underline decoration-indigo-500/20">{pendingAction}</span> is an irreversible audit event. Continue?
                            </p>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={confirmAction}
                                    className="w-full py-4.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all font-black"
                                >
                                    Proceed with Action
                                </button>
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    className="w-full py-4.5 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-black"
                                >
                                    Abort Operation
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

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
import { fetchVendorRequests, approveVendorRequest, rejectVendorRequest, blockVendor } from '../api/axios';
import { useNotifications } from '../context/NotificationContext';

const VendorReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [vendors, setVendors] = useState([]);
    const { markAsRead } = useNotifications();
    const [vendor, setVendor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActioning, setIsActioning] = useState(false);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const hasMarkedRef = useRef(false);

    useEffect(() => {
        const loadVendorData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchVendorRequests();
                setVendors(data);

                const foundVendor = data.find(v => v.id.toString() === id.toString() || v.notifId === id);
                if (foundVendor) {
                    setVendor(foundVendor);
                    if (!hasMarkedRef.current && foundVendor.notifId) {
                        markAsRead(foundVendor.notifId);
                        hasMarkedRef.current = true;
                    }
                }
            } catch (error) {
                console.error("Failed to load vendor details:", error);
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
            } else if (pendingAction === "Blocked" || pendingAction === "Suspended") {
                await blockVendor(vendor.id, "Actioned via Security Review");
            } else {
                await rejectVendorRequest(vendor.id, "Declined via Security Review");
            }
            navigate('/vendors');
        } catch (error) {
            console.error("Action execution failed:", error);
        } finally {
            setIsActioning(false);
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
                        <p className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Loading Profile</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Fetching vendor audit data...</p>
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
    const canApprove = vendor.approval_status === 'pending';
    const canBlock = !vendor.is_blocked;
    const canSuspend = vendor.approval_status === 'approved';

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-900">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Vendors" onLogout={() => window.location.href = '/'} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 px-8 h-32 flex items-center justify-between z-20">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate(-1)} className="p-3 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 hover:text-indigo-600 transition-all">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="w-px h-10 bg-slate-200 hidden sm:block" />
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Security Review</h1>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-indigo-600" /> Profiling: {vendor.id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className="hidden lg:flex items-center bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest gap-2">
                            <ShieldCheck className="w-4 h-4" /> Admin Controls
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
                                <div className="bg-slate-50 backdrop-blur-xl rounded-2xl px-6 py-4 border border-slate-200 text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Status Overview</p>
                                    <p className="text-3xl font-black text-slate-900">{vendor.approval_status}</p>
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-indigo-600/20">
                                    {(vendor.shop_name || "V").charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50 border border-slate-200 ${vendor.approval_status === 'approved' ? 'text-emerald-600' :
                                            vendor.approval_status === 'pending' ? 'text-amber-600' : 'text-rose-600'
                                            }`}>
                                            {vendor.approval_status}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled: {new Date(vendor.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className="text-5xl font-black tracking-tighter mb-4 text-slate-900">{vendor.shop_name}</h2>
                                    <p className="text-slate-500 font-bold max-w-xl text-sm leading-relaxed">{vendor.shop_description}</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Detailed Info */}
                            <div className="lg:col-span-2 space-y-12">
                                <section className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 scale-150 opacity-5 group-hover:scale-125 transition-transform duration-1000 text-indigo-600">
                                        <Building2 className="w-40 h-40" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600" /> Organizational Identity
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Legally Registered Name</label>
                                            <p className="text-lg font-black text-slate-900">{vendor.shop_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Primary Operations Hub</label>
                                            <p className="text-lg font-black text-slate-900 flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-indigo-600" /> {vendor.address}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Business Sector</label>
                                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black border border-indigo-100 uppercase tracking-widest">{vendor.business_type}</span>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Tax Verification ID</label>
                                            <p className="text-lg font-black text-slate-900 font-mono tracking-tighter italic">{vendor.gst_number || vendor.id}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600" /> Compliance Documentation
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {vendor.id_proof_file ? (
                                            <div className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-indigo-500/30 hover:shadow-lg transition-all cursor-pointer"
                                                onClick={() => window.open(`http://localhost:8000${vendor.id_proof_file}`, '_blank')}>
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 border border-slate-200 group-hover:scale-110 transition-transform">
                                                        <FileText className="w-7 h-7" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">Identity Proof</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">{vendor.id_type || 'ID Document'}</p>
                                                    </div>
                                                </div>
                                                <motion.div whileHover={{ x: 5 }} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ArrowLeft className="w-5 h-5 text-indigo-600 rotate-180" />
                                                </motion.div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest p-6 text-center border-2 border-dashed border-slate-100 rounded-3xl col-span-2">No documents submitted for review</p>
                                        )}
                                    </div>
                                </section>

                                <section className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm overflow-hidden">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600" /> Inventory Audit ({vendor.products?.length || 0})
                                    </h3>

                                    <div className="overflow-x-auto -mx-12 px-12">
                                        <table className="w-full text-left">
                                            <thead className="bg-[#FBFCFD] border-b border-slate-100">
                                                <tr>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descriptor</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Valuation</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch Vol</th>
                                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {vendor.products && vendor.products.length > 0 ? (
                                                    vendor.products.map((product) => (
                                                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-8 py-6 text-sm font-bold text-slate-600">{product.name}</td>
                                                            <td className="px-8 py-6 text-sm font-bold text-slate-900 text-center">
                                                                ₹{product.price.toLocaleString()}
                                                            </td>
                                                            <td className="px-8 py-6 text-sm text-slate-500 font-bold text-center">{product.stock}</td>
                                                            <td className="px-8 py-6 text-right">
                                                                <span className={`text-[10px] font-black uppercase tracking-widest ${product.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                    {product.status || 'Active'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-8 py-16 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] italic">
                                                            Zero initial inventory submitted
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>

                            {/* Contact & Risk */}
                            <div className="space-y-12">
                                <section className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600" /> Principal Node
                                    </h3>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-indigo-600/20">
                                                {(vendor.user_username || "A").charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-slate-900 leading-tight">{vendor.user_username}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Authorized Official</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6 px-2">
                                            <div className="flex items-center gap-5 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group">
                                                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl group-hover:bg-indigo-50 border border-slate-100">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <span className="tracking-tight">{vendor.user_email}</span>
                                            </div>
                                            <div className="flex items-center gap-5 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group">
                                                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl group-hover:bg-indigo-50 border border-slate-100">
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <span className="tracking-tight">{vendor.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600" /> Administrative Info
                                    </h3>
                                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center relative overflow-hidden group">
                                        <div className="text-2xl font-black text-slate-900 mb-2 truncate">{vendor.business_type}</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registered Category</div>
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
                            <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Decision Portal</h4>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 italic opacity-50">Authorized Review Process</p>
                        </div>

                        <div className="flex items-center gap-6 w-full sm:w-auto">
                            {canBlock && (
                                <button
                                    onClick={() => handleActionClick('Blocked')}
                                    disabled={isActioning}
                                    className="flex-1 sm:flex-none px-10 py-5 bg-white border-2 border-slate-200 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-300 transition-all disabled:opacity-50"
                                >
                                    Force Block
                                </button>
                            )}

                            {canSuspend && (
                                <button
                                    onClick={() => handleActionClick('Suspended')}
                                    disabled={isActioning}
                                    className="flex-1 sm:flex-none px-10 py-5 bg-white border-2 border-slate-200 text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-50 hover:border-amber-300 transition-all disabled:opacity-50"
                                >
                                    Suspend
                                </button>
                            )}

                            {canApprove && (
                                <button
                                    onClick={() => handleActionClick('Approved')}
                                    disabled={isActioning}
                                    className="flex-1 sm:flex-none px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center gap-4 min-w-[220px]"
                                >
                                    {isActioning ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
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
                            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Review Execution</h2>
                            <p className="text-sm text-slate-500 font-bold leading-relaxed mb-12 px-2 italic">
                                Modifying partner status to <span className="text-slate-900 font-black uppercase tracking-[0.2em] underline decoration-indigo-600/40">{pendingAction}</span>. Confirm?
                            </p>
                            <div className="flex flex-col gap-5">
                                <button
                                    onClick={confirmAction}
                                    className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                                >
                                    Execute Order
                                </button>
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    className="w-full py-5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Decline Operation
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

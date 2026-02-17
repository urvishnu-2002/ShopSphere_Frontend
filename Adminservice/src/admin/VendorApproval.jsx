import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    CheckCircle,
    AlertTriangle,
    Ban,
    Activity,
    FileText,
    PanelLeftClose,
    PanelLeftOpen,
    ShieldCheck,
    Package,
    Clock,
    User,
    Mail,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { fetchAllVendors, blockVendor, unblockVendor, approveVendorRequest } from '../api/axios';

const VendorApproval = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All Vendors');

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const loadVendors = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAllVendors();
            setVendors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load vendors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

    const filteredVendors = useMemo(() => {
        return vendors.filter(v => {
            const matchesSearch = v.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.user_email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'All Vendors' || v.approval_status === filterStatus.toLowerCase();
            return matchesSearch && matchesFilter;
        });
    }, [vendors, searchTerm, filterStatus]);

    const handleActionClick = (vendor, action) => {
        setPendingAction({ vendor, action });
        setIsActionModalOpen(true);
    };

    const confirmAction = async () => {
        if (!pendingAction) return;
        const { vendor, action } = pendingAction;
        setIsActionModalOpen(false);

        try {
            if (action === 'Block') {
                await blockVendor(vendor.id, "Security Policy Enforcement");
            } else if (action === 'Unblock') {
                await unblockVendor(vendor.id);
            } else if (action === 'Approve') {
                await approveVendorRequest(vendor.id);
            }

            await loadVendors();
        } catch (error) {
            console.error("Action failed:", error);
        }
        setPendingAction(null);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'text-emerald-500 bg-emerald-50 border-emerald-100/50';
            case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100/50';
            case 'blocked': return 'text-rose-500 bg-rose-50 border-rose-100/50';
            default: return 'text-slate-500 bg-slate-50 border-slate-100/50';
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Vendors" onLogout={() => window.location.href = '/'} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">All Vendors</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="w-10 h-10 bg-violet-900 rounded-full flex items-center justify-center text-white font-bold">A</div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Toolbar */}
                    <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by shop or owner..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-slate-50 border-transparent rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none min-w-[150px]"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option>All Vendors</option>
                            <option>Approved</option>
                            <option>Pending</option>
                            <option>Blocked</option>
                        </select>
                        <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">
                            Filter
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#FBFCFD] border-b border-slate-100">
                                    <tr>
                                        {['SHOP NAME', 'OWNER', 'STATUS', 'APPLIED ON', 'ACTIONS'].map(h => (
                                            <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="5" className="px-8 py-8"><div className="h-10 bg-slate-100 rounded-2xl w-full" /></td>
                                            </tr>
                                        ))
                                    ) : filteredVendors.length > 0 ? (
                                        filteredVendors.map(vendor => (
                                            <tr key={vendor.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6 text-sm font-bold text-slate-900">{vendor.shop_name}</td>
                                                <td className="px-8 py-6 text-sm font-medium text-slate-500">{vendor.user_email}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getStatusColor(vendor.approval_status)}`}>
                                                        {vendor.approval_status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-medium text-slate-400">{new Date(vendor.created_at).toLocaleDateString()}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => navigate(`/vendors/review/${vendor.notifId || vendor.id}`)}
                                                            className="text-indigo-600 hover:text-indigo-800 text-xs font-bold transition-colors"
                                                        >
                                                            View
                                                        </button>
                                                        {vendor.approval_status === 'approved' && !vendor.is_blocked && (
                                                            <button
                                                                onClick={() => handleActionClick(vendor, 'Block')}
                                                                className="px-4 py-1.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-rose-500/20 transition-all"
                                                            >
                                                                Block
                                                            </button>
                                                        )}
                                                        {vendor.is_blocked && (
                                                            <button
                                                                onClick={() => handleActionClick(vendor, 'Unblock')}
                                                                className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                                                            >
                                                                Unblock
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                                        <Package className="w-8 h-8 text-slate-300" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900">No matches found</h3>
                                                    <p className="text-sm text-slate-400 font-medium">Try adjusting your search or filters.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-[#FBFCFD] px-8 py-4 border-t border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Total {filteredVendors.length} Vendors Listed
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isActionModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsActionModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 shadow-2xl border border-slate-100"
                        >
                            <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mb-8 border border-amber-100 mx-auto">
                                <AlertTriangle className="w-10 h-10 text-amber-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 text-center mb-3">Critical Action</h2>
                            <p className="text-sm text-slate-500 text-center font-medium leading-relaxed mb-10 px-4">
                                You are about to <span className="text-slate-900 font-black underline decoration-indigo-500/20">{pendingAction?.action}</span> <span className="text-slate-900 font-bold">{pendingAction?.vendor.shop_name}</span>. This change will affect portal access immediately.
                            </p>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={confirmAction}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Confirm Authorization
                                </button>
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-black"
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

export default VendorApproval;

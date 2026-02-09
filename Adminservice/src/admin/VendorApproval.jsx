import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useVendors } from '../context/VendorContext';

const VendorApproval = () => {
    const navigate = useNavigate();
    const { vendors, updateVendorStatus } = useVendors();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Pending');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    // Filter statuses for tabs
    const tabs = ['Pending', 'Approved', 'Suspended', 'Blocked'];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const filteredVendors = useMemo(() => {
        return vendors.filter(v => {
            const matchesSearch = v.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTab = v.status === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [vendors, searchTerm, activeTab]);

    const handleActionClick = (vendor, action) => {
        setPendingAction({ vendor, action });
        setIsActionModalOpen(true);
    };

    const confirmAction = async () => {
        if (!pendingAction) return;
        const { vendor, action } = pendingAction;

        // Map UI action to backend status
        const statusMap = {
            'Approve': 'Approved',
            'Suspend': 'Suspended',
            'Block': 'Blocked'
        };

        setIsActionModalOpen(false);
        await updateVendorStatus(vendor.id, statusMap[action], vendor.notifId);
        setPendingAction(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'Suspended': return 'text-rose-500 bg-rose-50 border-rose-100';
            case 'Blocked': return 'text-slate-600 bg-slate-100 border-slate-200';
            default: return 'text-slate-500 bg-slate-50 border-slate-100';
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
                            <h1 className="text-xl font-bold text-slate-900">Vendor Management</h1>
                            <p className="text-xs text-slate-500 font-medium tracking-tight">Onboarding, compliance, and lifecycle management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="hidden lg:flex items-center bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest gap-2">
                            <ShieldCheck className="w-3.5 h-3.5" /> SuperAdmin
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        {/* Tabs */}
                        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab}
                                    <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab ? 'bg-white/20' : 'bg-slate-100'
                                        }`}>
                                        {vendors.filter(v => v.status === tab).length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search vendors..."
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table / Grid View */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        {['Store Profile', 'Business Details', 'Registration', 'Actions'].map(h => (
                                            <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        Array(4).fill(0).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="4" className="px-8 py-8">
                                                    <div className="h-10 bg-slate-100 rounded-2xl w-full" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : filteredVendors.length > 0 ? (
                                        filteredVendors.map(vendor => (
                                            <tr key={vendor.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 font-black text-lg group-hover:scale-110 transition-transform">
                                                            {vendor.storeName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900 mb-0.5">{vendor.storeName}</div>
                                                            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                                                                <Mail className="w-3 h-3" /> {vendor.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-xs font-bold text-slate-700">{vendor.legalName}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{vendor.category}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-xs font-bold text-slate-700">{vendor.registrationDate}</div>
                                                    <div className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(vendor.status)}`}>
                                                        {vendor.status}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => navigate(`/vendors/review/${vendor.notifId || vendor.id}`)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-xl shadow-lg shadow-slate-200 hover:scale-105 transition-all"
                                                        >
                                                            <FileText className="w-3.5 h-3.5" /> Review & Manage
                                                        </button>

                                                        {/* Quick Actions based on transitions */}
                                                        {vendor.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleActionClick(vendor, 'Approve')}
                                                                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                                                                title="Approve Now"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {vendor.status === 'Approved' && (
                                                            <button
                                                                onClick={() => handleActionClick(vendor, 'Suspend')}
                                                                className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all border border-amber-100"
                                                                title="Suspend Account"
                                                            >
                                                                <Activity className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {(vendor.status !== 'Blocked') && (
                                                            <button
                                                                onClick={() => handleActionClick(vendor, 'Block')}
                                                                className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                                                                title="Block Vendor"
                                                            >
                                                                <Ban className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20">
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                                                        <Package className="w-10 h-10 text-slate-300" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-1">No vendors in {activeTab}</h3>
                                                    <p className="text-sm text-slate-400 font-medium max-w-xs">Everything is organized. There are no vendor records matching this status currently.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-50/50 px-8 py-4 flex items-center justify-between border-t border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Showing {filteredVendors.length} results
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                <Clock className="w-3.5 h-3.5" /> Session Active
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
                                You are about to <span className="text-slate-900 font-black underline decoration-indigo-500/20">{pendingAction?.action}</span> <span className="text-slate-900 font-bold">{pendingAction?.vendor.storeName}</span>. This change will affect portal access immediately.
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

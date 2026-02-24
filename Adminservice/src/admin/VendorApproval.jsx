import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    CheckCircle,
    AlertTriangle,
    Ban,
    Activity,
    PanelLeftClose,
    PanelLeftOpen,
    ShieldCheck,
    Store,
    Clock,
    Mail,
    ArrowRight,
    SearchX,
    UserCheck,
    Users,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { useTheme } from '../context/ThemeContext';
import { fetchAllVendors, blockVendor, unblockVendor, approveVendorRequest, logout } from '../api/axios';
import { toast } from 'react-hot-toast';

const VendorApproval = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
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
            toast.error("Cloud synchronization failed");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

    const filteredVendors = useMemo(() => {
        return vendors.filter(v => {
            const name = v.shop_name?.toLowerCase() || '';
            const email = v.user_email?.toLowerCase() || '';
            const search = searchTerm.toLowerCase();
            const matchesSearch = name.includes(search) || email.includes(search);

            let matchesFilter = true;
            if (filterStatus === 'Approved') {
                matchesFilter = v.approval_status === 'approved' && !v.is_blocked;
            } else if (filterStatus === 'Pending') {
                matchesFilter = v.approval_status === 'pending';
            } else if (filterStatus === 'Rejected') {
                matchesFilter = v.approval_status === 'rejected';
            } else if (filterStatus === 'Blocked') {
                matchesFilter = v.is_blocked === true;
            }

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
                toast.success("Security block engaged");
            } else if (action === 'Unblock') {
                await unblockVendor(vendor.id);
                toast.success("Access restored");
            } else if (action === 'Approve') {
                await approveVendorRequest(vendor.id);
                toast.success("Onboarding authorized");
            }
            await loadVendors();
        } catch (error) {
            console.error("Action failed:", error);
            toast.error("Governance event failed");
        }
        setPendingAction(null);
    };

    const getStatusColor = (vendor) => {
        if (vendor.is_blocked) return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
        switch (vendor.approval_status?.toLowerCase()) {
            case 'approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'rejected': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Vendors" onLogout={logout} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <header className={`border-b px-8 h-20 flex items-center justify-between z-20 sticky top-0 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-lg font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Partner Registry</h1>
                                <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-normal ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>Synced</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Global Merchant Lifecycle Management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <Users className="w-3.5 h-3.5" /> Core Node_02
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Partners', value: vendors.length, icon: Store, color: 'blue' },
                                { label: 'Active Service', value: vendors.filter(v => v.approval_status === 'approved' && !v.is_blocked).length, icon: Activity, color: 'emerald' },
                                { label: 'Verification Peak', value: '48h', icon: Clock, color: 'emerald' },
                                { label: 'Security Blocks', value: vendors.filter(v => v.is_blocked).length, icon: Ban, color: 'rose' }
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
                                                    (isDarkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600')
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

                        <div className={`p-4 rounded-[3rem] border transition-all duration-300 flex flex-col md:flex-row gap-4 items-center ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="relative flex-1 w-full group">
                                <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`} />
                                <input
                                    type="text"
                                    placeholder="Trace partner identity (Name, Email, or Hash)..."
                                    className={`w-full pl-12 pr-6 py-4 rounded-[2rem] text-sm focus:outline-none focus:ring-4 transition-all font-bold tracking-normal uppercase ${isDarkMode
                                        ? 'bg-slate-900/50 border-slate-800 text-white placeholder-slate-600 focus:ring-blue-500/10 focus:border-blue-500'
                                        : 'bg-slate-50 border-transparent text-slate-900 placeholder-slate-400 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 shadow-inner'
                                        }`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto pr-2">
                                <div className={`px-4 py-4 rounded-[2rem] flex items-center gap-3 min-w-[220px] transition-colors ${isDarkMode ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100'}`}>
                                    <Filter className="w-4 h-4 text-slate-500" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="bg-transparent text-[10px] font-semibold uppercase tracking-normal focus:outline-none w-full text-slate-400"
                                    >
                                        <option value="All Vendors">State: Universal</option>
                                        <option value="Approved">Auth: Secured</option>
                                        <option value="Pending">Flow: Pending</option>
                                        <option value="Rejected">Node: Terminated</option>
                                        <option value="Blocked">State: Restricted</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-[3rem] border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-sm shadow-blue-500/5' : 'bg-white border-slate-100 shadow-md'}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                        <tr>
                                            {['Partner Identity', 'Transmission Endpoint', 'Security Status', 'Log Timestamp', 'Governance'].map(h => (
                                                <th key={h} className="px-10 py-6 text-[10px] font-semibold text-slate-500 uppercase tracking-normal">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y transition-colors duration-300 ${isDarkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                                        <AnimatePresence mode="wait">
                                            {isLoading ? (
                                                Array(5).fill(0).map((_, i) => (
                                                    <tr key={i} className="animate-pulse">
                                                        <td colSpan="5" className="px-10 py-10"><div className={`h-14 rounded-3xl w-full ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`} /></td>
                                                    </tr>
                                                ))
                                            ) : filteredVendors.length > 0 ? (
                                                filteredVendors.map((vendor, index) => (
                                                    <motion.tr
                                                        key={vendor.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className={`group transition-all duration-300 ${isDarkMode ? 'hover:bg-blue-500/5' : 'hover:bg-blue-50/50'}`}
                                                    >
                                                        <td className="px-10 py-8">
                                                            <div className="flex items-center gap-6">
                                                                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-semibold text-xl transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-blue-400 group-hover:border-blue-500' : 'bg-white border-slate-100 text-blue-600 group-hover:scale-105 shadow-sm'}`}>
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
                                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-semibold uppercase tracking-normal border transition-all ${getStatusColor(vendor)}`}>
                                                                {vendor.is_blocked ? 'Restricted' : vendor.approval_status}
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
                                                                {vendor.approval_status === 'approved' && !vendor.is_blocked && (
                                                                    <button
                                                                        onClick={() => handleActionClick(vendor, 'Block')}
                                                                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[9px] font-semibold uppercase tracking-normal transition-all border shadow-lg shadow-rose-500/5 ${isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white' : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white'}`}
                                                                    >
                                                                        <Ban className="w-4 h-4" /> Block
                                                                    </button>
                                                                )}
                                                                {vendor.is_blocked && (
                                                                    <button
                                                                        onClick={() => handleActionClick(vendor, 'Unblock')}
                                                                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[9px] font-semibold uppercase tracking-normal transition-all border shadow-lg shadow-emerald-500/5 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white'}`}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" /> Restore
                                                                    </button>
                                                                )}
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
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal mt-2 max-w-xs">No merchant profiles matched the current security filters in this domain.</p>
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
                                    Registry Node Synchronized Node_02
                                </div>
                                <div className="flex items-center gap-4 text-[9px] font-semibold text-slate-500 tracking-normal uppercase">
                                    Auth Secured <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {isActionModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                            onClick={() => setIsActionModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className={`rounded-[3rem] p-10 max-w-sm w-full relative z-10 shadow-2xl border transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b] border-slate-700 shadow-slate-950/50' : 'bg-white border-slate-100'}`}
                        >
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 border mx-auto ${pendingAction?.action === 'Block' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                <AlertTriangle className={`w-10 h-10 ${pendingAction?.action === 'Block' ? 'text-rose-500' : 'text-emerald-500'}`} />
                            </div>
                            <h2 className={`text-2xl font-semibold text-center mb-3 tracking-normal uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{pendingAction?.action === 'Block' ? 'Security Lock' : 'Access Restored'}</h2>
                            <p className="text-[10px] text-slate-500 text-center font-bold leading-relaxed mb-10 px-4 uppercase tracking-normal">
                                You are authorizing a protocol change for <span className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{pendingAction?.vendor.shop_name}</span>. This event will be logged in the security audit trail.
                            </p>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={confirmAction}
                                    className={`w-full py-5 text-white rounded-2xl text-[10px] font-semibold uppercase tracking-normal shadow-xl transition-all ${pendingAction?.action === 'Block' ? 'bg-rose-600 shadow-rose-900/40 hover:bg-rose-500' : 'bg-blue-600 shadow-blue-900/40 hover:bg-blue-500 hover:scale-[1.02]'}`}
                                >
                                    Confirm Authorization
                                </button>
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    className={`w-full py-5 border rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
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

export default VendorApproval;

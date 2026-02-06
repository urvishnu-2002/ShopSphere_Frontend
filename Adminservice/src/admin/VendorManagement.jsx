import React, { useState, useEffect, useMemo } from 'react';
import {
    Store,
    Search,
    Filter,
    MoreVertical,
    Eye,
    CheckCircle,
    AlertTriangle,
    Ban,
    RefreshCcw,
    Calendar,
    Mail,
    ShieldCheck,
    Package,
    ChevronDown,
    X,
    Building2,
    MapPin,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    FileText,
    Activity,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';

// --- Production-Grade Mock Data ---
const MOCK_VENDORS = [
    {
        id: 'VND-2024-001',
        storeName: 'TechNova Solutions',
        legalName: 'TechNova Electronics Pvt Ltd',
        email: 'partners@technova.com',
        status: 'Active',
        onboardingDate: '2024-01-12',
        lastActivity: '2 hours ago',
        complianceStatus: 'Verified',
        owner: 'Robert Chen',
        phone: '+1 415 555 0123',
        address: '123 Innovation Dr, San Jose, CA',
        stats: {
            totalProducts: 142,
            activeProducts: 128,
            totalOrders: 1250,
            completedOrders: 1180,
            cancelledOrders: 45,
            returnedOrders: 25,
            grossSales: 89400.50,
            commission: 8940.05,
            netPayable: 80460.45
        }
    },
    {
        id: 'VND-2024-002',
        storeName: 'Urban Threads',
        legalName: 'Urban Apparel Group',
        email: 'admin@urbanthreads.co',
        status: 'Pending',
        onboardingDate: '2024-02-05',
        lastActivity: 'Yesterday',
        complianceStatus: 'Under Review',
        owner: 'Emily Watson',
        phone: '+1 212 555 0789',
        address: '789 Fashion Ave, New York, NY',
        stats: {
            totalProducts: 450,
            activeProducts: 0,
            totalOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0,
            returnedOrders: 0,
            grossSales: 0,
            commission: 0,
            netPayable: 0
        }
    },
    {
        id: 'VND-2024-003',
        storeName: 'Pure Grocers',
        legalName: 'Pure Organic Foods LLC',
        email: 'sales@puregrocers.org',
        status: 'Suspended',
        onboardingDate: '2023-11-20',
        lastActivity: '3 days ago',
        complianceStatus: 'Verification Failed',
        owner: 'Sandeep Gupta',
        phone: '+91 98765 43210',
        address: '45 Green Park, New Delhi, India',
        stats: {
            totalProducts: 85,
            activeProducts: 0,
            totalOrders: 890,
            completedOrders: 820,
            cancelledOrders: 50,
            returnedOrders: 20,
            grossSales: 34200.00,
            commission: 3420.00,
            netPayable: 30780.00
        }
    },
    {
        id: 'VND-2024-004',
        storeName: 'Zen Living',
        legalName: 'Zen Home Decor & Gifts',
        email: 'hello@zenliving.com',
        status: 'Active',
        onboardingDate: '2023-12-15',
        lastActivity: '15 mins ago',
        complianceStatus: 'Verified',
        owner: 'Yuki Nakamura',
        phone: '+81 3 5555 0101',
        address: 'Shibuya Crossing, Tokyo, Japan',
        stats: {
            totalProducts: 320,
            activeProducts: 315,
            totalOrders: 2100,
            completedOrders: 2050,
            cancelledOrders: 30,
            returnedOrders: 20,
            grossSales: 156000.75,
            commission: 15600.08,
            netPayable: 140400.67
        }
    },
    {
        id: 'VND-2024-005',
        storeName: 'Velvet Charm',
        legalName: 'VC Cosmetics International',
        email: 'support@velvetcharm.com',
        status: 'Blocked',
        onboardingDate: '2023-10-01',
        lastActivity: '1 week ago',
        complianceStatus: 'Flagged',
        owner: 'Sofia Rodriguez',
        phone: '+34 91 555 1234',
        address: 'Madrid Business Hub, Spain',
        stats: {
            totalProducts: 65,
            activeProducts: 0,
            totalOrders: 150,
            completedOrders: 120,
            cancelledOrders: 20,
            returnedOrders: 10,
            grossSales: 12500.20,
            commission: 1250.02,
            netPayable: 11250.18
        }
    }
];

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        // Simulate API Fetch
        const timer = setTimeout(() => {
            setVendors(MOCK_VENDORS);
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const filteredVendors = useMemo(() => {
        return vendors.filter(v => {
            const matchesSearch = v.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [vendors, searchTerm, statusFilter]);

    const handleActionClick = (vendor, type) => {
        setPendingAction({ vendor, type });
        setIsActionModalOpen(true);
    };

    const confirmAction = () => {
        const { vendor, type } = pendingAction;
        setVendors(prev => prev.map(v => {
            if (v.id === vendor.id) {
                let newStatus = v.status;
                if (type === 'Approve') newStatus = 'Active';
                if (type === 'Suspend') newStatus = 'Suspended';
                if (type === 'Block') newStatus = 'Blocked';
                if (type === 'Reactivate') newStatus = 'Active';
                return { ...v, status: newStatus };
            }
            return v;
        }));
        setIsActionModalOpen(false);
        setPendingAction(null);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Suspended': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'Blocked': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 overflow-hidden">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Vendors" onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Header Section */}
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                        >
                            <RefreshCcw className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vendor Oversight</h1>
                            <p className="text-xs text-slate-500 font-medium">Manage marketplace partnerships and compliance</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 gap-2 border border-slate-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                            Compliance Verified
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Filter & Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="relative w-full md:w-96 ">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by store name, ID or email..."
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative group w-full md:w-44">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                <select
                                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl appearance-none text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Blocked">Blocked</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        {['Vendor ID', 'Store Name', 'Legal Entity', 'Status', 'Joined On', 'Last Active', 'Actions'].map((header) => (
                                            <th key={header} className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                {Array(7).fill(0).map((_, j) => (
                                                    <td key={j} className="px-6 py-4.5">
                                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : filteredVendors.length > 0 ? (
                                        filteredVendors.map((vendor) => (
                                            <tr key={vendor.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4.5">
                                                    <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">{vendor.id}</span>
                                                </td>
                                                <td className="px-6 py-4.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                                                            {vendor.storeName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-800">{vendor.storeName}</div>
                                                            <div className="text-[11px] text-slate-400">{vendor.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4.5 text-sm text-slate-600 font-medium">
                                                    {vendor.legalName}
                                                </td>
                                                <td className="px-6 py-4.5">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${getStatusStyles(vendor.status)}`}>
                                                        {vendor.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4.5 text-sm text-slate-500 font-medium">
                                                    {vendor.onboardingDate}
                                                </td>
                                                <td className="px-6 py-4.5 text-sm text-slate-500">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Activity className="w-3 h-3 text-emerald-500" />
                                                        {vendor.lastActivity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4.5">
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setSelectedVendor(vendor)}
                                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                                                            title="View Profile"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <div className="relative group/actions">
                                                            <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                            {/* Context Menu Placeholder */}
                                                            <div className="absolute right-0 bottom-full mb-2 hidden group-hover/actions:block w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-10 py-2">
                                                                {vendor.status === 'Pending' && (
                                                                    <button onClick={() => handleActionClick(vendor, 'Approve')} className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                                                                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                                                                    </button>
                                                                )}
                                                                {(vendor.status === 'Active' || vendor.status === 'Pending') && (
                                                                    <button onClick={() => handleActionClick(vendor, 'Suspend')} className="w-full text-left px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 flex items-center gap-2">
                                                                        <AlertTriangle className="w-3.5 h-3.5" /> Suspend
                                                                    </button>
                                                                )}
                                                                {vendor.status !== 'Blocked' && (
                                                                    <button onClick={() => handleActionClick(vendor, 'Block')} className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                                                        <Ban className="w-3.5 h-3.5" /> Block
                                                                    </button>
                                                                )}
                                                                {(vendor.status === 'Suspended' || vendor.status === 'Blocked') && (
                                                                    <button onClick={() => handleActionClick(vendor, 'Reactivate')} className="w-full text-left px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2">
                                                                        <RefreshCcw className="w-3.5 h-3.5" /> Reactivate
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                                        <Package className="w-8 h-8 text-slate-300" />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-slate-900">No vendors found</h3>
                                                    <p className="text-xs text-slate-400 max-w-[200px] mt-1">Try adjusting your filters or search term to find what you're looking for.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/30">
                            <span className="text-xs font-medium text-slate-500">Showing {filteredVendors.length} of {vendors.length} vendors in system</span>
                        </div>
                    </div>
                </main>
            </div>

            {/* Vendor Profile Drawer */}
            <AnimatePresence>
                {selectedVendor && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedVendor(null)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[70] overflow-y-auto flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-100">
                                        {selectedVendor.storeName.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 leading-tight">{selectedVendor.storeName}</h2>
                                        <span className={`text-[10px] uppercase font-bold tracking-widest ${getStatusStyles(selectedVendor.status)} px-2 py-0.5 rounded-full border`}>
                                            {selectedVendor.status}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedVendor(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 space-y-10">
                                {/* Financial Snapshot */}
                                <section>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-3.5 h-3.5" /> Financial Snapshot
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase">Gross Sales</div>
                                            <div className="text-lg font-bold text-slate-900 mt-1">${selectedVendor.stats.grossSales.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                                            <div className="text-[10px] font-bold text-indigo-500 uppercase">Commission</div>
                                            <div className="text-lg font-bold text-indigo-700 mt-1">${selectedVendor.stats.commission.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                            <div className="text-[10px] font-bold text-emerald-500 uppercase">Payable</div>
                                            <div className="text-lg font-bold text-emerald-700 mt-1">${selectedVendor.stats.netPayable.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </section>

                                {/* Business Info */}
                                <section className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="col-span-2">
                                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Building2 className="w-3.5 h-3.5" /> Company Details
                                        </h3>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase">Legal Entity Name</label>
                                        <p className="text-sm font-bold text-slate-800 mt-1">{selectedVendor.legalName}</p>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase">Tax ID / Business ID</label>
                                        <p className="text-sm font-bold text-slate-800 mt-1">{selectedVendor.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase">Primary Owner</label>
                                        <p className="text-sm font-bold text-slate-800 mt-1">{selectedVendor.owner}</p>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase">Onboarding Date</label>
                                        <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {selectedVendor.onboardingDate}
                                        </p>
                                    </div>
                                </section>

                                {/* Contact & Compliance */}
                                <section className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="col-span-2">
                                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <ShieldCheck className="w-3.5 h-3.5" /> Contact & Compliance
                                        </h3>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase">Contact Support</label>
                                        <div className="mt-2 flex items-center gap-3">
                                            <a href={`mailto:${selectedVendor.email}`} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                                                <Mail className="w-3.5 h-3.5" /> Send Email
                                            </a>
                                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                                                <Activity className="w-3.5 h-3.5" /> View Logs
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase">Compliance Status</label>
                                        <p className={`text-xs font-bold mt-1 inline-flex items-center gap-1.5`}>
                                            {selectedVendor.complianceStatus === 'Verified' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                                            {selectedVendor.complianceStatus}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-400 uppercase">Operating Region</label>
                                        <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                            International
                                        </p>
                                    </div>
                                </section>

                                {/* Fulfillment Summary */}
                                <section>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Package className="w-3.5 h-3.5" /> Fulfillment Summary
                                    </h3>
                                    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                        <div className="p-4 flex gap-8">
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">Products</div>
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <span className="text-xl font-bold text-slate-900">{selectedVendor.stats.totalProducts}</span>
                                                    <span className="text-[10px] font-bold text-emerald-600">{selectedVendor.stats.activeProducts} Live</span>
                                                </div>
                                            </div>
                                            <div className="w-px bg-slate-200 self-stretch my-1"></div>
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">Orders</div>
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <span className="text-xl font-bold text-slate-900">{selectedVendor.stats.totalOrders}</span>
                                                    <span className="text-[10px] font-bold text-slate-500">{selectedVendor.stats.completedOrders} Completed</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/50 px-4 py-3 flex gap-4 text-[10px] font-bold uppercase tracking-tight">
                                            <span className="text-amber-600">{selectedVendor.stats.returnedOrders} Returns</span>
                                            <span className="text-rose-600">{selectedVendor.stats.cancelledOrders} Cancelled</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Security Pin */}
                                <div className="pt-8 border-t border-slate-100 italic text-[10px] text-slate-400 text-center">
                                    Last internal audit performed by Admin on {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Action Confirmation Modal */}
            <AnimatePresence>
                {isActionModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsActionModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl border border-slate-100"
                        >
                            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 mx-auto">
                                <AlertTriangle className="w-8 h-8 text-amber-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 text-center mb-2">Confirm Action</h2>
                            <p className="text-sm text-slate-500 text-center mb-8 font-medium">
                                Are you sure you want to <span className="text-slate-900 font-bold underline decoration-indigo-500/30 uppercase tracking-tight">{pendingAction?.type}</span> the vendor <span className="text-slate-900 font-bold tracking-tight">{pendingAction?.vendor.storeName}</span>?
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmAction}
                                    className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Yes, Confirm Action
                                </button>
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all"
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

export default VendorManagement;

import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import { useVendors } from '../context/VendorContext';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../api/axios';
import {
    PanelLeftClose,
    PanelLeftOpen,
    AlertTriangle,
    ShieldCheck,
    Info,
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    Clock,
    Store,
    Activity,
    Users
} from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

const VendorList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode } = useTheme();
    const { vendors, updateVendorStatus } = useVendors();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const initialFilter = location.state?.filter || 'All Vendors';
    const [filterStatus, setFilterStatus] = useState(initialFilter);
    const [activeFilter, setActiveFilter] = useState(initialFilter);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVendors = useMemo(() => {
        return vendors.filter(vendor => {
            const matchesStatus = activeFilter === 'All Vendors' || vendor.status === activeFilter;
            const matchesSearch = vendor.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vendor.owner.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [vendors, activeFilter, searchQuery]);

    const handleStatusUpdate = async (id, status) => {
        await updateVendorStatus(id, status);
    };

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activePage="Vendors"
                onLogout={logout}
            />

            <main className="flex-1 flex flex-col min-w-0">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className={`text-lg font-bold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Merchant Index</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Marketplace Partner Registry</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <Activity className="w-3.5 h-3.5" /> Core Ops Synced
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">
                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Total Partners', value: vendors.length, icon: Users, color: 'blue' },
                                { label: 'Active Channels', value: vendors.filter(v => v.status === 'Approved').length, icon: CheckCircle2, color: 'emerald' },
                                { label: 'Blocked Nodes', value: vendors.filter(v => v.status === 'Blocked').length, icon: XCircle, color: 'rose' }
                            ].map((stat, i) => (
                                <div key={i} className={`p-6 rounded-[2rem] border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color === 'blue' ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') :
                                            stat.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                                                (isDarkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600')
                                            }`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-normal text-slate-500 mb-0.5">{stat.label}</p>
                                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search and Filters */}
                        <div className={`p-4 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row gap-4 items-center ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="flex-1 w-full relative">
                                <SearchBar
                                    placeholder="Trace merchant by store name or principal..."
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                    onClear={() => setSearchQuery('')}
                                    className={`${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-transparent text-slate-900'}`}
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className={`rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-normal focus:outline-none min-w-[180px] w-full transition-all cursor-pointer ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-transparent text-slate-600'
                                        }`}
                                >
                                    <option value="All Vendors">All Protocols</option>
                                    <option value="Approved">Verified Only</option>
                                    <option value="Blocked">Restricted</option>
                                    <option value="Pending">Approval Queue</option>
                                </select>
                                <button
                                    onClick={() => setActiveFilter(filterStatus)}
                                    className={`px-8 py-3 rounded-2xl font-semibold text-[11px] uppercase tracking-normal transition-all shadow-xl hover:translate-y-[-2px] active:translate-y-[1px] ${isDarkMode
                                        ? 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-500'
                                        : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'
                                        }`}
                                >
                                    Filter
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                        <tr>
                                            {['Entity / Store Module', 'Principal', 'Compliance', 'Onboarded', 'Operations'].map(h => (
                                                <th key={h} className="px-8 py-6 text-[10px] font-semibold text-slate-500 uppercase tracking-normal">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y transition-colors duration-300 ${isDarkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                                        {filteredVendors.map((vendor) => (
                                            <tr key={vendor.id} className={`group transition-all hover:translate-x-1 ${isDarkMode ? 'hover:bg-blue-500/5' : 'hover:bg-slate-50/50'}`}>
                                                <td className="px-8 py-7">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-blue-400 group-hover:border-blue-500' : 'bg-slate-50 border border-slate-100 text-blue-600 shadow-sm group-hover:border-blue-200'}`}>
                                                            <Store className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className={`text-sm font-bold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{vendor.storeName}</div>
                                                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mt-0.5">ID: {vendor.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`} />
                                                        <span className="text-sm font-bold text-slate-500">{vendor.owner}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-normal border transition-all ${vendor.status === 'Approved' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100') :
                                                        vendor.status === 'Blocked' ? (isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100') :
                                                            (isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100')
                                                        }`}>
                                                        {vendor.status === 'Approved' ? <CheckCircle2 className="w-2.5 h-2.5" /> : vendor.status === 'Blocked' ? <XCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                                                        {vendor.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal font-mono">
                                                        {vendor.registrationDate}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            onClick={() => {
                                                                if (vendor.status === 'Pending') {
                                                                    navigate(`/vendors/review/${vendor.id}`);
                                                                } else {
                                                                    navigate(`/vendor/${vendor.id}`);
                                                                }
                                                            }}
                                                            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-blue-400 hover:bg-slate-700' : 'bg-slate-50 text-blue-600 hover:bg-blue-100 border border-slate-100 hover:border-blue-200 shadow-sm'}`}
                                                        >
                                                            <ArrowUpRight className="w-5 h-5" />
                                                        </button>
                                                        {vendor.status === 'Approved' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(vendor.id, 'Blocked')}
                                                                className={`px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-normal transition-all ${isDarkMode ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100'}`}
                                                            >
                                                                Restrict
                                                            </button>
                                                        )}
                                                        {vendor.status === 'Blocked' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(vendor.id, 'Approved')}
                                                                className={`px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-normal transition-all ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}
                                                            >
                                                                Reactivate
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredVendors.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-24 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mb-6 border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                                                            <Info className="w-10 h-10 text-slate-300" />
                                                        </div>
                                                        <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Registry Zero</h3>
                                                        <p className="text-xs text-slate-500 font-medium">No merchant protocols detected in current indexing parameters.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorList;

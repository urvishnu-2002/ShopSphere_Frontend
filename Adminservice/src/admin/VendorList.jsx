import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import { useVendors } from '../context/VendorContext';
import { PanelLeftClose, PanelLeftOpen, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

const VendorList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { vendors, updateVendorStatus } = useVendors();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Use location state if available for deep filtering
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

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/');
    };

    const handleStatusUpdate = async (id, status) => {
        await updateVendorStatus(id, status);
    };

    return (
        <div className="flex h-screen bg-black font-sans selection:bg-indigo-500/10 overflow-hidden text-white">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activePage="Vendors"
                onLogout={handleLogout}
            />

            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Header */}
                <header className="bg-black border-b border-white/5 px-8 h-32 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-white/5 rounded-lg transition-all"
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeftOpen className="w-6 h-6" />}
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight uppercase">Vendor Registry</h1>
                            <p className="text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase mt-1">Marketplace Partner Index</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">A</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-black">
                    {/* Search and Filters */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 shadow-sm flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 w-full bg-white/5 rounded-xl border border-white/5">
                            <SearchBar
                                placeholder="Search by store or owner..."
                                value={searchQuery}
                                onChange={setSearchQuery}
                                onClear={() => setSearchQuery('')}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="flex-1 md:w-48 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none p-3.5"
                            >
                                <option className="bg-slate-900">All Partners</option>
                                <option className="bg-emerald-950 text-emerald-400">Approved</option>
                                <option className="bg-rose-950 text-rose-400">Blocked</option>
                                <option className="bg-amber-950 text-amber-400">Pending</option>
                            </select>
                            <button
                                onClick={() => setActiveFilter(filterStatus)}
                                className="px-6 py-3.5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white/5 rounded-3xl border border-white/5 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entity / Store</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Principal</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Compliance</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Onboarded</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredVendors.map((vendor) => (
                                        <tr key={vendor.id} className="hover:bg-white/10 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-bold text-white tracking-tight">{vendor.storeName}</div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mt-1 italic">ID: {vendor.id}</div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-400 text-center">{vendor.owner}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${vendor.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    vendor.status === 'Blocked' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }`}>
                                                    {vendor.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-black text-slate-500 text-center font-mono italic">{vendor.registrationDate}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => {
                                                            if (vendor.status === 'Pending') {
                                                                navigate(`/vendors/review/${vendor.id}`);
                                                            } else {
                                                                navigate(`/vendor/${vendor.id}`);
                                                            }
                                                        }}
                                                        className="px-4 py-2 text-[10px] font-black text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white rounded-lg transition-all uppercase tracking-widest border border-indigo-500/20"
                                                    >
                                                        Details
                                                    </button>
                                                    {vendor.status === 'Approved' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(vendor.id, 'Blocked')}
                                                            className="px-4 py-2 text-[10px] font-black text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-all uppercase tracking-widest shadow-lg shadow-rose-600/20"
                                                        >
                                                            Block
                                                        </button>
                                                    )}
                                                    {vendor.status === 'Blocked' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(vendor.id, 'Approved')}
                                                            className="px-4 py-2 text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                                                        >
                                                            Unblock
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredVendors.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <Info className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Zero Partners found in Index</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VendorList;

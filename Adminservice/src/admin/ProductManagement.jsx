import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    Filter,
    Store,
    PanelLeftClose,
    PanelLeftOpen,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Package,
    ArrowUpRight,
    Activity,
    Box,
    X,
    MoreVertical
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useProducts } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';
import { logout } from '../api/axios';

const DEBOUNCE_MS = 400;

const ProductManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode } = useTheme();
    const {
        products,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalCount,
        goToPage,
        doSearch,
        updateProductStatus,
    } = useProducts();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [searchInput, setSearchInput] = useState(location.state?.searchTerm || '');
    const [statusFilter, setStatusFilter] = useState(location.state?.status || '');
    const debounceRef = useRef(null);

    useEffect(() => {
        if (location.state?.searchTerm) {
            doSearch(location.state.searchTerm);
        }
    }, []);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchInput(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            doSearch(val);
        }, DEBOUNCE_MS);
    };

    const handleStatusChange = (e) => {
        const val = e.target.value;
        setStatusFilter(val);
        doSearch(searchInput, val === 'All States' ? '' : val);
    };

    const handleAction = (productId, newStatus) => {
        updateProductStatus(productId, newStatus);
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount);

    const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * 50 + 1;
    const rangeEnd = Math.min(currentPage * 50, totalCount);

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Products" onLogout={logout} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className={`text-lg font-bold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Market Registry</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Global Inventory Control</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <Box className="w-3.5 h-3.5" /> Sector 7-G Node
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">
                        {/* Summary Bar */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Active Items', value: totalCount, icon: Package, color: 'blue' },
                                { label: 'Market Depth', value: totalPages, icon: Activity, color: 'emerald' },
                                { label: 'Node Status', value: 'Synced', icon: Box, color: 'emerald' },
                                { label: 'Auth Level', value: 'Root', icon: MoreVertical, color: 'amber' }
                            ].map((stat, i) => (
                                <div key={i} className={`p-6 rounded-[2rem] border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color === 'blue' ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') :
                                            stat.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                                                stat.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                                                    (isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600')
                                            }`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-normal text-slate-500 mb-0.5">{stat.label}</p>
                                            <p className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search & Filter Toolbar */}
                        <div className={`p-4 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row gap-4 items-center ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Trace product by name or global ID..."
                                    className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all font-medium ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-white focus:ring-blue-500/10 focus:border-blue-500' : 'bg-slate-50 border-transparent text-slate-900 focus:ring-blue-500/5'
                                        }`}
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <Filter className="w-4 h-4 text-slate-500 ml-2 hidden md:block" />
                                <select
                                    value={statusFilter}
                                    onChange={handleStatusChange}
                                    className={`rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-normal focus:outline-none min-w-[180px] w-full transition-all cursor-pointer ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-transparent text-slate-600'
                                        }`}
                                >
                                    <option value="">Global Filter</option>
                                    <option value="active">Active State</option>
                                    <option value="blocked">Blocked Node</option>
                                    <option value="pending">Verification</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                        <tr>
                                            {['Market Entity', 'Registry Origin', 'Classification', 'Unit Price', 'Stock Level', 'Current State', 'Operations'].map(h => (
                                                <th key={h} className="px-8 py-5 text-[10px] font-semibold text-slate-500 uppercase tracking-normal">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y transition-colors duration-300 ${isDarkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                                        {isLoading ? (
                                            Array(6).fill(0).map((_, i) => (
                                                <tr key={i} className="animate-pulse">
                                                    <td colSpan="7" className="px-8 py-8"><div className={`h-12 rounded-2xl w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} /></td>
                                                </tr>
                                            ))
                                        ) : products.length > 0 ? (
                                            products.map((product) => (
                                                <tr key={product.id} className={`group transition-all hover:translate-x-1 ${isDarkMode ? 'hover:bg-blue-500/5' : 'hover:bg-slate-50/50'}`}>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                                                {product.images?.[0]?.url ? (
                                                                    <img
                                                                        src={product.images[0].url.startsWith('http') ? product.images[0].url : `http://localhost:8000${product.images[0].url}`}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <Package className="w-6 h-6 text-slate-300" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-normal">{product.brand}</span>
                                                                    <p className={`text-sm font-bold truncate max-w-[150px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</p>
                                                                </div>
                                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal leading-none mt-1">ID: {product.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <button
                                                            onClick={() => navigate(`/vendor/${product.vendor}`)}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-normal transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-blue-400 hover:border-blue-400' : 'bg-white border-slate-100 text-blue-600 hover:border-blue-600 shadow-sm'
                                                                }`}
                                                        >
                                                            <Store className="w-3.5 h-3.5" />
                                                            {product.vendor_name || 'ORIGIN'}
                                                        </button>
                                                    </td>
                                                    <td className="px-8 py-6 font-bold text-[11px] text-slate-500 uppercase tracking-normal">{product.category}</td>
                                                    <td className="px-8 py-6 font-semibold text-sm">{formatCurrency(product.price)}</td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${product.quantity > 10 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                                            <span className="text-[11px] font-semibold text-slate-500">{product.quantity} Units</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-normal border transition-all ${product.status?.toLowerCase() === 'active'
                                                            ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100')
                                                            : (isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100')
                                                            }`}>
                                                            {product.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button
                                                                onClick={() => setSelectedProduct(product)}
                                                                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-blue-400 hover:bg-slate-700' : 'bg-slate-50 text-blue-600 hover:bg-blue-100 border border-slate-100 hover:border-blue-200 shadow-sm'}`}
                                                            >
                                                                <ArrowUpRight className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(product.id, product.status?.toLowerCase() === 'active' ? 'inactive' : 'active')}
                                                                className={`p-2 rounded-xl transition-all border ${product.status?.toLowerCase() === 'active'
                                                                    ? (isDarkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20' : 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100')
                                                                    : (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100')
                                                                    }`}
                                                            >
                                                                {product.status?.toLowerCase() === 'active' ? <X className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-8 py-24 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                                                            <Box className="w-10 h-10 text-slate-300" />
                                                        </div>
                                                        <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Empty Sector</h3>
                                                        <p className="text-xs text-slate-500 font-medium">No market data detected for current terminal parameters.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className={`px-8 py-5 border-t flex items-center justify-between transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal hidden sm:block">
                                    Displaying Records <span className="text-slate-400 mx-1.5">{rangeStart} - {rangeEnd}</span> of <span className={`${isDarkMode ? 'text-white' : 'text-slate-900'} ml-1`}>{totalCount}</span>
                                </p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-normal transition-all border disabled:opacity-30 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Trace Back
                                    </button>
                                    <div className={`px-4 py-2 rounded-xl border text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-white'}`}>
                                        PAGE {currentPage} / {totalPages}
                                    </div>
                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage >= totalPages}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-normal transition-all border disabled:opacity-30 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        Advance <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Premium Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className={`relative w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
                        >
                            {/* Left Side: Images */}
                            <div className={`w-full md:w-1/2 p-8 flex flex-col border-b md:border-b-0 md:border-r ${isDarkMode ? 'bg-slate-950/30 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                <div className={`flex-1 min-h-[400px] mb-6 relative rounded-[2.5rem] overflow-hidden border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-inner'}`}>
                                    <img
                                        src={selectedProduct.activeImage ? (selectedProduct.activeImage.startsWith('http') ? selectedProduct.activeImage : `http://localhost:8000${selectedProduct.activeImage}`) : (selectedProduct.images?.[0]?.url ? (selectedProduct.images[0].url.startsWith('http') ? selectedProduct.images[0].url : `http://localhost:8000${selectedProduct.images[0].url}`) : '')}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-contain p-8"
                                    />
                                    {(!selectedProduct.images || selectedProduct.images.length === 0) && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 opacity-20">
                                            <Package size={80} />
                                        </div>
                                    )}
                                </div>

                                {selectedProduct.images?.length > 1 && (
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                                        {selectedProduct.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedProduct({ ...selectedProduct, activeImage: img.url })}
                                                className={`flex-shrink-0 w-20 h-20 rounded-2xl border-4 transition-all overflow-hidden bg-white ${selectedProduct.activeImage === img.url || (!selectedProduct.activeImage && idx === 0) ? 'border-blue-600 scale-95 shadow-xl' : (isDarkMode ? 'border-slate-800 hover:border-slate-700' : 'border-white hover:border-slate-200')}`}
                                            >
                                                <img src={img.url.startsWith('http') ? img.url : `http://localhost:8000${img.url}`} alt="Preview" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Data */}
                            <div className="w-full md:w-1/2 p-12 flex flex-col justify-between">
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-normal border ${selectedProduct.status?.toLowerCase() === 'active'
                                            ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100')
                                            : (isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100')
                                            }`}>
                                            {selectedProduct.status} SYSTEM STATE
                                        </div>
                                        <button onClick={() => setSelectedProduct(null)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}>
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mb-1">{selectedProduct.brand}</p>
                                        <h2 className={`text-3xl font-semibold tracking-normal leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProduct.name}</h2>
                                        <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-normal mt-2">{selectedProduct.category}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mb-2">Market Valuation</p>
                                            <p className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(selectedProduct.price)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mb-2">Node Capacity</p>
                                            <p className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProduct.quantity} <span className="text-sm font-bold text-slate-500">Units</span></p>
                                        </div>
                                    </div>

                                    <div className={`p-6 rounded-[2rem] border mt-10 transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-4">Origin Merchant Protocol</p>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-blue-400' : 'bg-white border-slate-200 text-blue-600 shadow-sm'}`}>
                                                <Store className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{selectedProduct.vendor_name || 'AUTHENTIC MERCHANT'}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase">ID: {selectedProduct.vendor}</p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/vendor/${selectedProduct.vendor}`)}
                                                className={`ml-auto p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-700 text-blue-400' : 'hover:bg-white text-blue-600 shadow-sm'}`}
                                            >
                                                <ArrowUpRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className={`w-full py-5 rounded-2xl mt-12 font-semibold text-[11px] uppercase tracking-normal transition-all shadow-2xl hover:translate-y-[-2px] active:translate-y-[1px] ${isDarkMode
                                        ? 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-500'
                                        : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'
                                        }`}
                                >
                                    Egress to Registry
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductManagement;

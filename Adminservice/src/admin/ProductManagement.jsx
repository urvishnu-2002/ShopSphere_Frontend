import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Filter,
    Eye,
    Store,
    PanelLeftClose,
    PanelLeftOpen,
    ChevronDown,
    Package
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';

import { useProducts } from '../context/ProductContext';

const ProductManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { products, updateProductStatus } = useProducts();
    const [isLoading, setIsLoading] = useState(true);

    // Read search term from navigation state (e.g., from Vendor Details)
    const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');

    const [vendorFilter, setVendorFilter] = useState('All Vendors');

    // Read status from dashboard navigation state
    const initialStatus = location.state?.status || 'All States';
    const [statusFilter, setStatusFilter] = useState(initialStatus);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const vendorsList = useMemo(() => {
        const vendors = Array.from(new Set(products.map(p => p.vendor)));
        return ['All Vendors', ...vendors];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesVendor = vendorFilter === 'All Vendors' || p.vendor === vendorFilter;
            const matchesStatus = statusFilter === 'All States' ||
                (statusFilter === 'Active' && p.status === 'Active') ||
                (statusFilter === 'Blocked' && p.status === 'Blocked');
            return matchesSearch && matchesVendor && matchesStatus;
        });
    }, [products, searchTerm, vendorFilter, statusFilter]);

    const handleAction = (productId, newStatus) => {
        updateProductStatus(productId, newStatus);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-violet-100 overflow-hidden text-slate-900">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Products" onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-500"
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-slate-800" />
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Manage Products</h1>
                            </div>
                            <p className="text-xs text-slate-500 font-medium ml-7">Monitor and control all products from vendors</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-violet-900 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-violet-900/20">A</div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gray-50/50">
                    {/* Filter Container */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search product name..."
                                className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Dropdowns */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative min-w-[140px]">
                                <select
                                    className="appearance-none w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all cursor-pointer"
                                    value={vendorFilter}
                                    onChange={(e) => setVendorFilter(e.target.value)}
                                >
                                    {vendorsList.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>

                            <div className="relative min-w-[140px]">
                                <select
                                    className="appearance-none w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option>All States</option>
                                    <option>Active</option>
                                    <option>Blocked</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Funnel Icon */}
                            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FBFCFD] border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                                <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                                                <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                                                <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-8"></div></td>
                                                <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-12"></div></td>
                                                <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                                            </tr>
                                        ))
                                    ) : filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-600 group-hover:text-slate-900">{product.name}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{product.vendor}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatCurrency(product.price)}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500">{product.stock}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[11px] font-bold ${product.status === 'Active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {product.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => setSelectedProduct(product)}
                                                            className="text-indigo-600 hover:text-indigo-800 text-xs font-bold transition-colors"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(product.id, product.status === 'Active' ? 'Blocked' : 'Active')}
                                                            className={`${product.status === 'Active' ? 'text-rose-500 hover:text-rose-700' : 'text-emerald-500 hover:text-emerald-700'} text-xs font-bold transition-colors`}
                                                        >
                                                            {product.status === 'Active' ? 'Block' : 'Unblock'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-sm">
                                                No products found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl p-8"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Package className="w-6 h-6 text-violet-600" />
                                Product Details
                            </h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Product Name</p>
                                        <p className="text-base font-bold text-slate-900">{selectedProduct.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                        <span className={`text-xs font-bold ${selectedProduct.status === 'Active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {selectedProduct.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                                        <p className="text-base font-bold text-slate-900">{formatCurrency(selectedProduct.price)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Inventory Stock</p>
                                        <p className="text-base font-bold text-slate-900">{selectedProduct.stock} Units</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-100">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Manufacturer / Vendor</p>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Store className="w-5 h-5 text-indigo-500" />
                                        <span className="font-bold text-slate-700">{selectedProduct.vendor}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all mt-4"
                                >
                                    Close Details
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


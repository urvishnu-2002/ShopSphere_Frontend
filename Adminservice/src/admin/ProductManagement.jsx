import React, { useState, useEffect, useMemo } from 'react';
import {
    Package,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Eye,
    MoreVertical,
    Clock,
    Store,
    Tag,
    ChevronDown,
    ArrowUpRight,
    RefreshCcw,
    X,
    MessageSquare,
    ShieldCheck,
    AlertTriangle,
    CheckSquare,
    Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';

// --- Production-Grade Mock Data ---
const MOCK_PRODUCTS = [
    {
        id: 'PRD-001',
        name: 'Backpack',
        vendor: 'Gadget Hub',
        category: 'Accessories',
        price: 45.00,
        status: 'Pending',
        submittedDate: '2024-02-05',
        description: 'Durable, weather-resistant backpack designed for urban explorers and students alike.'
    },
    {
        id: 'PRD-002',
        name: 'Wireless Earbuds',
        vendor: 'SoundWave',
        category: 'Electronics',
        price: 89.99,
        status: 'Approved',
        submittedDate: '2024-02-01',
        description: 'Crystal-clear audio with adaptive noise cancellation and 24-hour battery life.',
        actionBy: 'Admin',
        actionDate: '2024-02-03'
    },
    {
        id: 'PRD-003',
        name: 'Smart Watch Series 5',
        vendor: 'TechNova',
        category: 'Wearables',
        price: 199.00,
        status: 'Approved',
        submittedDate: '2024-01-28',
        description: 'Stay connected and track your health with the latest smart technology.',
        actionBy: 'Admin',
        actionDate: '2024-01-30'
    },
    {
        id: 'PRD-004',
        name: 'Leather Wallet',
        vendor: 'Classic Goods',
        category: 'Accessories',
        price: 35.00,
        status: 'Approved',
        submittedDate: '2024-01-25',
        description: 'Handcrafted genuine leather wallet with RFID protection.',
        actionBy: 'Admin',
        actionDate: '2024-01-27'
    },
    {
        id: 'PRD-005',
        name: 'Minimalist Lamp',
        vendor: 'Pure Living',
        category: 'Home Decor',
        price: 55.00,
        status: 'Approved',
        submittedDate: '2024-01-20',
        description: 'Modern minimalist desk lamp with adjustable brightness settings.',
        actionBy: 'Admin',
        actionDate: '2024-01-22'
    },
    {
        id: 'PRD-006',
        name: 'Ceramic Coffee Set',
        vendor: 'Pure Living',
        category: 'Kitchen',
        price: 42.50,
        status: 'Approved',
        submittedDate: '2024-01-15',
        description: 'Set of 4 handcrafted ceramic mugs perfect for any kitchen aesthetic.',
        actionBy: 'Admin',
        actionDate: '2024-01-17'
    }
];

// REJECTION REASONS CONFIG
const REJECTION_REASONS = [
    'Policy Violation',
    'Duplicate Product',
    'Poor Image Quality',
    'Incorrect Description',
    'Pricing Issue',
    'Other'
];

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // OPTIONAL FEATURE: Bulk Selection State
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    // OPTIONAL FEATURE: Rejection Reason Modal State
    const [rejectionModalData, setRejectionModalData] = useState(null); // { id, isBulk }

    useEffect(() => {
        const timer = setTimeout(() => {
            setProducts(MOCK_PRODUCTS);
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const categories = useMemo(() => {
        return ['All', ...new Set(MOCK_PRODUCTS.map(p => p.category))];
    }, []);

    const stats = useMemo(() => {
        return {
            pending: products.filter(p => p.status === 'Pending').length,
            approved: products.filter(p => p.status === 'Approved').length,
            rejected: products.filter(p => p.status === 'Rejected').length
        }
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.vendor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTab = activeTab === 'All' || p.status === activeTab;
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            return matchesSearch && matchesTab && matchesCategory;
        });
    }, [products, searchTerm, activeTab, selectedCategory]);

    const handleAction = (productId, newStatus, reason = null) => {
        setActionLoading(productId);
        setTimeout(() => {
            setProducts(prev => prev.map(p =>
                p.id === productId ? {
                    ...p,
                    status: newStatus,
                    rejectionReason: reason,
                    // OPTIONAL FEATURE: Admin Audit Metadata
                    actionBy: 'Admin',
                    actionDate: new Date().toISOString().split('T')[0]
                } : p
            ));
            setActionLoading(null);
        }, 800);
    };

    const handleBulkAction = (newStatus, reason = null) => {
        setActionLoading('bulk');
        setTimeout(() => {
            setProducts(prev => prev.map(p =>
                selectedProductIds.includes(p.id) ? {
                    ...p,
                    status: newStatus,
                    rejectionReason: reason,
                    actionBy: 'Admin',
                    actionDate: new Date().toISOString().split('T')[0]
                } : p
            ));
            setSelectedProductIds([]);
            setActionLoading(null);
            setRejectionModalData(null);
        }, 1000);
    };

    const toggleProductSelection = (id) => {
        setSelectedProductIds(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 overflow-hidden">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Products" onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 overflow-hidden relative">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-20">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Product Approval</h1>
                            <p className="text-xs text-slate-500 font-medium">Verify and manage marketplace quality standards</p>
                        </div>
                    </div>

                    <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('Pending')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {stats.pending} Pending
                        </button>
                        <button
                            onClick={() => setActiveTab('Approved')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Approved' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {stats.approved} Approved
                        </button>
                        <button
                            onClick={() => setActiveTab('Rejected')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Rejected' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {stats.rejected} Rejected
                        </button>
                        <button
                            onClick={() => setActiveTab('All')}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'All' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            View All
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8FAFC]">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex items-center gap-4 flex-1 w-full">
                            <div className="relative flex-1 md:max-w-96">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by product or vendor..."
                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-xs font-bold transition-all shadow-sm ${selectedCategory !== 'All' ? 'border-indigo-500 text-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <Filter className="w-4 h-4" />
                                    {selectedCategory === 'All' ? 'Filter Categories' : selectedCategory}
                                    <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isFilterOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2"
                                            >
                                                <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                                                    Select Category
                                                </div>
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => {
                                                            setSelectedCategory(cat);
                                                            setIsFilterOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${selectedCategory === cat
                                                            ? 'bg-indigo-50 text-indigo-600'
                                                            : 'text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* OPTIONAL FEATURE: Bulk Actions Toolbar */}
                        <AnimatePresence>
                            {selectedProductIds.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-3 bg-indigo-600 p-1.5 rounded-2xl shadow-lg shadow-indigo-200 pl-4"
                                >
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest mr-2">{selectedProductIds.length} Selected</span>
                                    <button
                                        onClick={() => handleBulkAction('Approved')}
                                        className="px-4 py-2 bg-white text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                                    </button>
                                    <button
                                        onClick={() => setRejectionModalData({ isBulk: true })}
                                        className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-400 transition-all flex items-center gap-2"
                                    >
                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                    </button>
                                    <button
                                        onClick={() => setSelectedProductIds([])}
                                        className="p-2 text-indigo-200 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Content Section */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(6).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse">
                                    <div className="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/2 mb-2"></div>
                                    <div className="h-10 bg-slate-100 rounded w-full mt-4"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* Pending for Approval Section */}
                            {(activeTab === 'All' || activeTab === 'Pending') && filteredProducts.filter(p => p.status === 'Pending').length > 0 && (
                                <section>
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-amber-500" /> Pending Approval
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredProducts.filter(p => p.status === 'Pending').map((product) => (
                                            <ProductEntry
                                                key={product.id}
                                                product={product}
                                                onAction={(id, status) => status === 'Rejected' ? setRejectionModalData({ id }) : handleAction(id, status)}
                                                actionLoading={actionLoading}
                                                onPreview={setSelectedProduct}
                                                isSelected={selectedProductIds.includes(product.id)}
                                                onSelect={() => toggleProductSelection(product.id)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Catalog Oversight Section */}
                            {(activeTab === 'All' || activeTab === 'Approved' || activeTab === 'Rejected') && filteredProducts.filter(p => p.status !== 'Pending').length > 0 && (
                                <section>
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-emerald-500" /> Catalog Oversight
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredProducts.filter(p => p.status !== 'Pending').map((product) => (
                                            <ProductEntry
                                                key={product.id}
                                                product={product}
                                                onAction={(id, status) => status === 'Rejected' ? setRejectionModalData({ id }) : handleAction(id, status)}
                                                actionLoading={actionLoading}
                                                onPreview={setSelectedProduct}
                                                isSelected={false} // No selection for non-pending
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {filteredProducts.length === 0 && (
                                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <Tag className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">No matching products</h3>
                                    <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* OPTIONAL FEATURE: Rejection Reason Modal */}
            <AnimatePresence>
                {rejectionModalData && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setRejectionModalData(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <button onClick={() => setRejectionModalData(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-8">
                                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 leading-tight">Reason for Rejection</h3>
                                <p className="text-sm font-medium text-slate-500 mt-2">
                                    {rejectionModalData.isBulk
                                        ? `Identify the policy mismatch for ${selectedProductIds.length} assets.`
                                        : 'Identify why this asset does not meet quality standards.'}
                                </p>
                            </div>

                            <div className="space-y-2 mb-10">
                                {REJECTION_REASONS.map(reason => (
                                    <button
                                        key={reason}
                                        onClick={() => {
                                            if (rejectionModalData.isBulk) {
                                                handleBulkAction('Rejected', reason);
                                            } else {
                                                handleAction(rejectionModalData.id, 'Rejected', reason);
                                                setRejectionModalData(null);
                                            }
                                        }}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left text-sm font-bold text-slate-700 hover:bg-white hover:border-rose-200 hover:text-rose-600 transition-all group"
                                    >
                                        {reason}
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setRejectionModalData(null)}
                                className="w-full py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all text-sm uppercase tracking-widest"
                            >
                                Cancel Action
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Product Quick Preview Modal */}
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
                            className="relative bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 p-2 bg-slate-100/80 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-900 z-10 shadow-sm transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="md:w-1/2 aspect-square md:aspect-auto bg-slate-50 border-r border-slate-100 flex items-center justify-center relative">
                                <div className="p-8 bg-white/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center gap-3">
                                    <Package className="w-12 h-12 text-slate-200" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Image Asset<br />Reserved Slot</span>
                                </div>
                            </div>

                            <div className="md:w-1/2 p-10 overflow-y-auto">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-full">
                                        {selectedProduct.category}
                                    </span>
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${selectedProduct.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        selectedProduct.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                        {selectedProduct.status}
                                    </span>
                                </div>

                                <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{selectedProduct.name}</h2>
                                <div className="flex items-center gap-2 text-slate-500 font-bold mb-6">
                                    <Store className="w-4 h-4" />
                                    <span>Vendor: {selectedProduct.vendor}</span>
                                </div>

                                <div className="text-4xl font-black text-slate-900 mb-8">${selectedProduct.price.toFixed(2)}</div>

                                <div className="space-y-6">
                                    {/* OPTIONAL FEATURE: Audit Metadata Display */}
                                    {selectedProduct.actionBy && (
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Moderated By {selectedProduct.actionBy}</p>
                                                <p className="text-sm font-bold text-slate-800">Action logged on {selectedProduct.actionDate}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* OPTIONAL FEATURE: Rejection Reason in Modal */}
                                    {selectedProduct.status === 'Rejected' && selectedProduct.rejectionReason && (
                                        <div className="flex items-start gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-600 shadow-sm shrink-0">
                                                <AlertTriangle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-rose-400 uppercase">Rejection Reason</p>
                                                <p className="text-sm font-bold text-rose-800">{selectedProduct.rejectionReason}</p>
                                                <p className="text-xs font-medium text-rose-600/70 mt-1 italic">Please notify vendor for content correction.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Product Description</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">{selectedProduct.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Product ID</p>
                                            <p className="text-sm font-bold text-slate-800">{selectedProduct.id}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Submitted On</p>
                                            <p className="text-sm font-bold text-slate-800">{selectedProduct.submittedDate}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedProduct.status === 'Pending' && (
                                    <div className="mt-10 flex gap-4">
                                        <button
                                            onClick={() => { handleAction(selectedProduct.id, 'Approved'); setSelectedProduct(null); }}
                                            className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            Approve Product
                                        </button>
                                        <button
                                            onClick={() => { setRejectionModalData({ id: selectedProduct.id }); setSelectedProduct(null); }}
                                            className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            Reject Asset
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Sub-component for Product Card ---
const ProductEntry = ({ product, onAction, actionLoading, onPreview, isSelected, onSelect }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group bg-white rounded-[2.5rem] border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col relative ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/10' : 'border-slate-100'
                }`}
        >
            {/* OPTIONAL FEATURE: Checkbox Selection */}
            {product.status === 'Pending' && (
                <button
                    onClick={(e) => { e.stopPropagation(); onSelect(); }}
                    className="absolute top-4 left-4 z-20 w-8 h-8 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200 flex items-center justify-center group/check transition-all hover:border-indigo-500"
                >
                    {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                    ) : (
                        <Square className="w-5 h-5 text-slate-300 group-hover/check:text-indigo-400" />
                    )}
                </button>
            )}

            {/* Reserved Image Sub-Card Placeholder */}
            <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden border-b border-slate-50 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center text-slate-200 transition-transform group-hover:scale-110">
                    <Package className="w-8 h-8" />
                </div>

                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border shadow-sm ${product.status === 'Approved' ? 'bg-emerald-500 text-white border-emerald-400' :
                        product.status === 'Pending' ? 'bg-amber-500 text-white border-amber-400' :
                            'bg-rose-500 text-white border-rose-400'
                        }`}>
                        {product.status}
                    </span>

                    {/* OPTIONAL FEATURE: Visual Trust Indicators (Badges) */}
                    {product.status === 'Approved' && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-emerald-100 rounded-lg text-[8px] font-black text-emerald-600 shadow-sm">
                            <ShieldCheck className="w-3 h-3" /> REVIEWED
                        </div>
                    )}
                    {product.status === 'Rejected' && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-rose-100 rounded-lg text-[8px] font-black text-rose-600 shadow-sm">
                            <AlertTriangle className="w-3 h-3" /> WARNING
                        </div>
                    )}
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button
                        onClick={() => onPreview(product)}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col cursor-pointer" onClick={() => onPreview(product)}>
                <div className="flex-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{product.category}</div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight truncate">{product.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold overflow-hidden">
                        <Store className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{product.vendor}</span>
                    </div>
                </div>

                {/* OPTIONAL FEATURE: Rejection Reason Tooltip/Label */}
                {product.status === 'Rejected' && product.rejectionReason && (
                    <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
                        <p className="text-[9px] font-black text-rose-400 uppercase mb-1">Issue Detected</p>
                        <p className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" /> {product.rejectionReason}
                        </p>
                    </div>
                )}

                {product.status === 'Pending' ? (
                    <div className="mt-6 flex gap-2">
                        <button
                            disabled={actionLoading === product.id}
                            onClick={(e) => { e.stopPropagation(); onAction(product.id, 'Approved'); }}
                            className="flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                        >
                            {actionLoading === product.id ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : 'Approve'}
                        </button>
                        <button
                            disabled={actionLoading === product.id}
                            onClick={(e) => { e.stopPropagation(); onAction(product.id, 'Rejected'); }}
                            className="flex-1 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase border border-rose-100 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                        >
                            {actionLoading === product.id ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : 'Reject'}
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                        <span className="text-xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                        <div className="relative group/more">
                            <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductManagement;

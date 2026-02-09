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
    AlertCircle,
    ChevronDown,
    ArrowUpRight,
    LayoutGrid,
    List,
    RefreshCcw,
    X,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';

// --- Production-Grade Mock Data ---
const MOCK_PRODUCTS = [
    {
        id: 'PRD-001',
        name: 'Technical Backpack X-1',
        vendor: 'Bharat Electronics',
        category: 'Accessories',
        price: 9999.00,
        status: 'Live',
        submittedDate: '2024-02-05',
        description: 'The X-1 Technical Backpack is engineered for the modern nomad. Crafted from high-density 1000D ballistic nylon.'
    },
    {
        id: 'PRD-EXT-001',
        name: '4K Ultra Slim Monitor',
        vendor: 'Bharat Electronics',
        category: 'Electronics',
        price: 32999.00,
        status: 'Live',
        submittedDate: '2024-02-06',
        description: 'Vibrant 4K display with ultra-thin bezels and color accuracy for professional creative work.'
    },
    {
        id: 'PRD-002',
        name: 'Acoustic Pro Earbuds',
        vendor: 'Mumbai Gadget Mart',
        category: 'Electronics',
        price: 15999.99,
        status: 'Live',
        submittedDate: '2024-02-01',
        description: 'Experience studio-quality sound with custom-engineered 12mm dynamic drivers and ANC.'
    },
    {
        id: 'PRD-EXT-002',
        name: 'Smart Home Hub v2',
        vendor: 'Mumbai Gadget Mart',
        category: 'Gadgets',
        price: 8499.00,
        status: 'Live',
        submittedDate: '2024-02-07',
        description: 'Centralized control for all your smart devices with seamless voice integration support.'
    },
    {
        id: 'PRD-003',
        name: 'EvoWatch Series 7',
        vendor: 'Bharat Electronics',
        category: 'Wearables',
        price: 24999.00,
        status: 'Blocked',
        submittedDate: '2024-01-28',
        description: 'The ultimate health companion with Always-On Retina display and advanced health sensors.'
    },
    {
        id: 'PRD-004',
        name: 'Signature Leather Folio',
        vendor: 'Jaipur Organic Hub',
        category: 'Accessories',
        price: 6999.00,
        status: 'Live',
        submittedDate: '2024-01-25',
        description: 'Handcrafted premium Italian leather folio that develops a unique patina over time.'
    },
    {
        id: 'PRD-005',
        name: 'Lumina Arc Desk Lamp',
        vendor: 'Jaipur Organic Hub',
        category: 'Home Decor',
        price: 11999.00,
        status: 'Live',
        submittedDate: '2024-01-20',
        description: 'Minimalist LED lamp with flexible design and high-fidelity flicker-free lighting.'
    },
    {
        id: 'PRD-EXT-003',
        name: 'Pure Himalayan Honey',
        vendor: 'Jaipur Organic Hub',
        category: 'Organic Foods',
        price: 850.00,
        status: 'Live',
        submittedDate: '2024-02-08',
        description: '100% pure raw honey sourced from the pristine high-altitude valleys of the Himalayas.'
    },
    {
        id: 'PRD-LOG-001',
        name: 'Priority Air Express',
        vendor: 'IndoFlash Logistics',
        category: 'Logistics',
        price: 1500.00,
        status: 'Live',
        submittedDate: '2024-02-10',
        description: 'Premium next-day air delivery service for high-priority shipments across India.'
    },
    {
        id: 'PRD-LOG-002',
        name: 'Secure Cargo Insurance',
        vendor: 'IndoFlash Logistics',
        category: 'Services',
        price: 499.00,
        status: 'Live',
        submittedDate: '2024-02-11',
        description: 'Comprehensive transit insurance covering theft, damage, and accidental loss during shipping.'
    }
];

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All'); // Live, Blocked
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        // Simulate API Fetch
        const timer = setTimeout(() => {
            setProducts(MOCK_PRODUCTS);
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const stats = useMemo(() => {
        return {
            live: products.filter(p => p.status === 'Live').length,
            blocked: products.filter(p => p.status === 'Blocked').length
        }
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.vendor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTab = activeTab === 'All' || p.status === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [products, searchTerm, activeTab]);

    const groupedProducts = useMemo(() => {
        const groups = {};
        filteredProducts.forEach(product => {
            if (!groups[product.vendor]) {
                groups[product.vendor] = [];
            }
            groups[product.vendor].push(product);
        });
        return groups;
    }, [filteredProducts]);

    const handleAction = (productId, newStatus) => {
        setActionLoading(productId);
        // Simulate API Update
        setTimeout(() => {
            setProducts(prev => prev.map(p =>
                p.id === productId ? { ...p, status: newStatus } : p
            ));
            setActionLoading(null);
        }, 800);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 overflow-hidden">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Products" onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-500"
                            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Catalog Management</h1>
                            <p className="text-xs text-slate-500 font-medium">Monitor products and enforce marketplace safety</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('All')}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'All' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {products.length} All
                            </button>
                            <button
                                onClick={() => setActiveTab('Live')}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Live' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {stats.live} Live
                            </button>
                            <button
                                onClick={() => setActiveTab('Blocked')}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Blocked' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {stats.blocked} Blocked
                            </button>
                        </div>
                        <NotificationBell />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8FAFC]">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by product or vendor..."
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                                <Filter className="w-4 h-4" /> Filter Categories
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(6).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 animate-pulse">
                                    <div className="aspect-square bg-slate-100 rounded-2xl mb-6"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/2 mb-3"></div>
                                    <div className="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/3 mb-6"></div>
                                    <div className="h-12 bg-slate-50 rounded-2xl w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {Object.keys(groupedProducts).length > 0 ? (
                                Object.entries(groupedProducts).map(([vendor, vendorProducts]) => (
                                    <section key={vendor} className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                                    <Store className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-black text-slate-800 tracking-tight">{vendor}</h2>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{vendorProducts.length} Items Listed</p>
                                                </div>
                                            </div>
                                            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                                                Manage Vendor Directory
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {vendorProducts.map((product) => (
                                                <ProductEntry key={product.id} product={product} onAction={handleAction} actionLoading={actionLoading} onPreview={setSelectedProduct} />
                                            ))}
                                        </div>
                                    </section>
                                ))
                            ) : (
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

            {/* Product Quick Preview Modal */}
            < AnimatePresence >
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
                            className="relative bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                        >
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 z-10 shadow-sm transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-1/2 min-h-[400px] bg-slate-50 flex flex-col items-center justify-center border-r border-slate-100 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                                    <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                                        <Package className="w-10 h-10" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Image Space</div>
                                        <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">Reserved for Product</div>
                                    </div>
                                </div>
                                <div className="md:w-1/2 p-10 overflow-y-auto">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-full">
                                            {selectedProduct.category}
                                        </span>
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${selectedProduct.status === 'Live' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
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

                                    <div className="text-4xl font-black text-slate-900 mb-8">₹{selectedProduct.price.toFixed(2)}</div>

                                    <div className="space-y-8">
                                        <div className="relative">
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                                                Product Specifications
                                            </h3>
                                            <div className="text-slate-600 leading-relaxed text-sm space-y-4">
                                                {selectedProduct.description.split('\n\n').map((paragraph, idx) => (
                                                    <p key={idx}>{paragraph}</p>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-6">
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

                                    <div className="mt-10">
                                        <button
                                            onClick={() => { handleAction(selectedProduct.id, selectedProduct.status === 'Live' ? 'Blocked' : 'Live'); setSelectedProduct(null); }}
                                            className={`w-full py-4 text-white rounded-2xl font-black text-sm shadow-lg transition-all ${selectedProduct.status === 'Live' ? 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600' : 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600'}`}
                                        >
                                            {selectedProduct.status === 'Live' ? 'Block Product' : 'Unblock Product'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
        </div >
    );
};

// --- Sub-component for Product Card ---
const ProductEntry = ({ product, onAction, actionLoading, onPreview }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 p-6 flex flex-col"
        >
            <div className="relative aspect-[4/5] mb-6 rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 flex flex-col items-center justify-center group-hover:bg-slate-100 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-60"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center justify-center text-slate-200 group-hover:scale-110 group-hover:text-indigo-300 transition-all duration-500">
                        <Package className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-indigo-400 transition-colors">Reserved</div>
                        <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Product Image Card</div>
                    </div>
                </div>

                <div className="absolute top-4 right-4">
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg backdrop-blur-md shadow-sm border transition-colors ${product.status === 'Live' ? 'bg-emerald-500/90 text-white border-emerald-400/50' :
                        'bg-rose-500/90 text-white border-rose-400/50'
                        }`}>
                        {product.status}
                    </span>
                </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col cursor-pointer" onClick={() => onPreview(product)}>
                <div className="flex-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{product.category}</div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{product.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-3">
                        <Store className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{product.vendor}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2">
                        {product.description}
                    </p>
                </div>

                <div className="mt-6">
                    <button
                        disabled={actionLoading === product.id}
                        onClick={(e) => { e.stopPropagation(); onAction(product.id, product.status === 'Live' ? 'Blocked' : 'Live'); }}
                        className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase border transition-all flex items-center justify-center ${product.status === 'Live' ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white'}`}
                    >
                        {actionLoading === product.id ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : (product.status === 'Live' ? 'Block Product' : 'Unblock Access')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductManagement;

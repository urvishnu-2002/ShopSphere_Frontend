import React, { useState, useCallback, useEffect, useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useProducts } from '../context/ProductContext';
import { fetchAllVendors, blockVendor, unblockVendor, approveVendorRequest, fetchProductsByVendor, logout } from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import {
    PanelLeftClose,
    PanelLeftOpen,
    ArrowLeft,
    Lock,
    Unlock,
    ShoppingBag,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    AlertTriangle,
    Store,
    ShieldCheck,
    FileText,
    MapPin,
    Building2,
    CreditCard,
    Banknote,
    ChevronDown,
    Package,
    Activity
} from 'lucide-react';

const VendorDetails = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const dm = isDarkMode;
    const { id } = useParams();
    const [vendor, setVendor] = useState(null);
    const [vendorProducts, setVendorProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { updateProductStatus } = useProducts();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const loadProducts = useCallback(async (vendorId) => {
        setIsLoadingProducts(true);
        try {
            const productData = await fetchProductsByVendor(vendorId);
            setVendorProducts(productData);
        } catch (error) {
            console.error("Failed to load vendor products:", error);
        } finally {
            setIsLoadingProducts(false);
        }
    }, []);

    const loadData = useCallback(async () => {
        try {
            const data = await fetchAllVendors();
            const found = Array.isArray(data) ? data.find(v => v.id.toString() === id.toString()) : null;
            setVendor(found || null);
            if (found) {
                loadProducts(found.id);
            }
        } catch (error) {
            console.error("Failed to load vendor details", error);
        }
    }, [id, loadProducts]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/');
    };

    const updateVendorStatusLocal = async (vendorId, newStatus) => {
        try {
            if (newStatus === 'Blocked') {
                await blockVendor(vendorId, "Policy violation or manual administrative block");
            } else if (newStatus === 'Approved') {
                if (vendor.approval_status === 'pending') {
                    await approveVendorRequest(vendorId);
                } else {
                    await unblockVendor(vendorId);
                }
            }
            await loadData();
        } catch (error) {
            console.error("Action failed:", error);
        }
    };

    const handleStatusToggle = async () => {
        if (!vendor) return;
        const newStatus = vendor.approval_status === 'approved' ? 'Blocked' : 'Approved';
        await updateVendorStatusLocal(vendor.id, newStatus);
    };

    if (!vendor) {
        return (
            <div className={`flex h-screen items-center justify-center ${dm ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
                <div className="text-center space-y-4">
                    <h2 className={`text-2xl font-bold ${dm ? 'text-white' : 'text-gray-800'}`}>Vendor Not Found</h2>
                    <button onClick={() => navigate('/vendors')} className="text-emerald-400 hover:underline font-medium">
                        Go back to Vendors list
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${dm ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Vendors" onLogout={logout} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 overflow-hidden">
                {/* Header */}
                <header className={`border-b px-4 md:px-8 py-4 flex items-center justify-between z-20 transition-colors duration-300 ${dm ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-lg transition-all ${dm ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <Store className={`w-5 h-5 ${dm ? 'text-slate-300' : 'text-slate-800'}`} />
                                <h1 className={`text-xl font-bold tracking-normal ${dm ? 'text-white' : 'text-slate-900'}`}>Vendor Profile</h1>
                            </div>
                            <p className={`text-xs font-medium ml-7 ${dm ? 'text-slate-500' : 'text-slate-500'}`}>Review and manage vendor account details and listings</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-900 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/20">A</div>
                    </div>
                </header>

                <main className={`flex-1 overflow-y-auto transition-colors duration-300 ${dm ? 'bg-[#0f172a]' : 'bg-gray-50/50'}`}>
                    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-500 hover:text-emerald-800 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>

                        {/* Vendor Information Card */}
                        <div className={`rounded-xl border overflow-hidden transition-colors ${dm ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className={`px-4 md:px-8 py-4 border-b ${dm ? 'border-slate-700/50 bg-[#1e293b]' : 'border-gray-100 bg-white'}`}>
                                <h2 className={`text-lg md:text-xl font-bold ${dm ? 'text-white' : 'text-slate-800'}`}>Vendor Information</h2>
                            </div>

                            <div className="p-4 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mb-12">
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-normal mb-1.5 flex items-center gap-2">
                                            <Store size={12} className="text-emerald-500" /> Organizational Identity
                                        </label>
                                        <div className={`p-4 rounded-xl border min-h-[100px] ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal mb-1">Shop Details</p>
                                            <p className={`text-sm font-bold uppercase tracking-normal mb-2 ${dm ? 'text-white' : 'text-slate-900'}`}>{vendor.shop_name}</p>
                                            <p className={`text-xs leading-relaxed ${dm ? 'text-slate-400' : 'text-slate-500'}`}>{vendor.shop_description || 'No description provided'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-normal mb-1.5 flex items-center gap-2">
                                            <Building2 size={12} className="text-blue-500" /> Business Classification
                                        </label>
                                        <div className={`p-4 rounded-xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className={`text-[10px] font-semibold uppercase tracking-normal mb-1 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>Category & Fee</p>
                                            <p className={`text-sm font-bold uppercase tracking-normal mb-1 ${dm ? 'text-white' : 'text-slate-900'}`}>{vendor.business_type}</p>
                                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-normal">Base Shipping: ₹{vendor.shipping_fee || '0.00'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-normal mb-1.5 flex items-center gap-2">
                                            <ShieldCheck size={12} className="text-emerald-500" /> Taxation & Compliance
                                        </label>
                                        <div className={`p-4 rounded-xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className={`text-[10px] font-semibold uppercase tracking-normal mb-1 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>Tax Identifiers</p>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-400 font-bold uppercase tracking-normal text-[9px]">GST</span>
                                                    <span className={`font-mono font-bold ${dm ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.gst_number || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-400 font-bold uppercase tracking-normal text-[9px]">PAN</span>
                                                    <span className={`font-mono font-bold ${dm ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.pan_number || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-normal mb-1.5 flex items-center gap-2">
                                            <CreditCard size={12} className="text-blue-500" /> Settlement Info
                                        </label>
                                        <div className={`p-4 rounded-xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className={`text-[10px] font-semibold uppercase tracking-normal mb-1 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>Beneficiary & Holder</p>
                                            <p className={`text-sm font-bold uppercase tracking-normal mb-1 ${dm ? 'text-white' : 'text-slate-900'}`}>{vendor.bank_holder_name || 'N/A'}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">PAN Name: {vendor.pan_name || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-normal mb-1.5 flex items-center gap-2">
                                            <Banknote size={12} className="text-amber-500" /> Banking Credentials
                                        </label>
                                        <div className={`p-4 rounded-xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className={`text-[10px] font-semibold uppercase tracking-normal mb-1 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>Account / IFSC</p>
                                            <p className={`text-sm font-mono font-bold tracking-normal uppercase whitespace-nowrap mb-1 ${dm ? 'text-white' : 'text-slate-900'}`}>{vendor.bank_account_number || 'N/A'}</p>
                                            <p className="text-[10px] text-slate-400 font-semibold tracking-normal uppercase">IFSC: {vendor.bank_ifsc_code || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-normal mb-1.5 flex items-center gap-2">
                                            <MapPin size={12} className="text-rose-500" /> Operations Hub
                                        </label>
                                        <div className={`p-4 rounded-xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className={`text-[10px] font-semibold uppercase tracking-normal mb-1 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>Physical Address</p>
                                            <p className={`text-xs font-bold leading-relaxed line-clamp-2 ${dm ? 'text-slate-200' : 'text-slate-900'}`}>{vendor.address || 'Address not listed'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t mb-8 ${dm ? 'border-slate-700/50 text-slate-200' : 'border-slate-100 text-slate-900'}`}>
                                    <div className={`flex items-center gap-5 p-4 rounded-2xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-blue-500 overflow-hidden ${dm ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                                            {vendor.user_profile_image ? (
                                                <img src={vendor.user_profile_image} className="w-full h-full object-cover" alt="Profile" />
                                            ) : (
                                                <User className="w-7 h-7" />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold uppercase tracking-normal ${dm ? 'text-white' : 'text-slate-900'}`}>{vendor.user_username || 'User Profile'}</p>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal">{vendor.user_email || 'Identity'}</p>
                                        </div>
                                        {vendor.user_profile_image && (
                                            <button onClick={() => window.open(vendor.user_profile_image.startsWith('http') ? vendor.user_profile_image : `http://localhost:8000${vendor.user_profile_image}`, '_blank')} className={`ml-auto px-4 py-2 rounded-lg text-xs font-semibold text-blue-500 uppercase tracking-normal transition-colors border ${dm ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-white border-slate-200 hover:bg-blue-50'}`}>
                                                View
                                            </button>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-5 p-4 rounded-2xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-blue-500 ${dm ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                                            <FileText className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold uppercase tracking-normal ${dm ? 'text-white' : 'text-slate-900'}`}>{vendor.id_type || 'ID Proof'}</p>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal">{vendor.id_number || 'Verification Doc'}</p>
                                        </div>
                                        {vendor.id_proof_file && (
                                            <button onClick={() => window.open(vendor.id_proof_file.startsWith('http') ? vendor.id_proof_file : `http://localhost:8000${vendor.id_proof_file}`, '_blank')} className={`ml-auto px-4 py-2 rounded-lg text-xs font-semibold text-blue-500 uppercase tracking-normal transition-colors border ${dm ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-white border-slate-200 hover:bg-blue-50'}`}>
                                                Review
                                            </button>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-5 p-4 rounded-2xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-rose-500 ${dm ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                                            <CreditCard className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold uppercase tracking-normal ${dm ? 'text-white' : 'text-slate-900'}`}>PAN Physical Card</p>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal">{vendor.pan_number || 'Taxation ID'}</p>
                                        </div>
                                        {vendor.pan_card_file && (
                                            <button onClick={() => window.open(vendor.pan_card_file.startsWith('http') ? vendor.pan_card_file : `http://localhost:8000${vendor.pan_card_file}`, '_blank')} className={`ml-auto px-4 py-2 rounded-lg text-xs font-semibold text-rose-500 uppercase tracking-normal transition-colors border ${dm ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-white border-slate-200 hover:bg-rose-50'}`}>
                                                Review
                                            </button>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-5 p-4 rounded-2xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-amber-500 ${dm ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                                            <FileText className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold uppercase tracking-normal ${dm ? 'text-white' : 'text-slate-900'}`}>Additional Docs</p>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal">Trade License / Other</p>
                                        </div>
                                        {vendor.additional_documents && (
                                            <button onClick={() => window.open(vendor.additional_documents.startsWith('http') ? vendor.additional_documents : `http://localhost:8000${vendor.additional_documents}`, '_blank')} className={`ml-auto px-4 py-2 rounded-lg text-xs font-semibold text-amber-500 uppercase tracking-normal transition-colors border ${dm ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-white border-slate-200 hover:bg-amber-50'}`}>
                                                Review
                                            </button>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-5 p-4 rounded-2xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-emerald-500 ${dm ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                                            <Activity className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold uppercase tracking-normal ${dm ? 'text-white' : 'text-slate-900'}`}>Selfie with ID</p>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal">Identity Verification</p>
                                        </div>
                                        {vendor.selfie_with_id && (
                                            <button onClick={() => window.open(vendor.selfie_with_id.startsWith('http') ? vendor.selfie_with_id : `http://localhost:8000${vendor.selfie_with_id}`, '_blank')} className={`ml-auto px-4 py-2 rounded-lg text-xs font-semibold text-emerald-500 uppercase tracking-normal transition-colors border ${dm ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-white border-slate-200 hover:bg-emerald-50'}`}>
                                                Review
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {vendor.approval_status === 'pending' ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => updateVendorStatusLocal(vendor.id, 'Approved')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all duration-200 border bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Approve Vendor
                                        </button>
                                        <button
                                            onClick={() => updateVendorStatusLocal(vendor.id, 'Blocked')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all duration-200 border bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject Vendor
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleStatusToggle}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all duration-200 border ${vendor.approval_status === 'approved' && !vendor.is_blocked
                                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100'
                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100'
                                            }`}
                                    >
                                        {vendor.approval_status === 'approved' && !vendor.is_blocked ? (
                                            <>
                                                <Lock className="w-4 h-4" />
                                                Block Vendor
                                            </>
                                        ) : (
                                            <>
                                                <Unlock className="w-4 h-4" />
                                                Unblock Vendor
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={`rounded-xl border overflow-hidden transition-colors ${dm ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className={`px-4 md:px-8 py-4 border-b flex items-center justify-between ${dm ? 'border-slate-700/50 bg-[#1e293b]' : 'border-slate-100 bg-white'}`}>
                                <h2 className={`text-lg md:text-xl font-bold ${dm ? 'text-white' : 'text-slate-800'}`}>Vendor Products ({vendorProducts.length})</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className={`border-b ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-[#FBFCFD] border-slate-100'}`}>
                                        <tr>
                                            {['Product', 'Category', 'Price', 'Quantity', 'Status', 'Actions'].map((h, i) => (
                                                <th key={h} className={`px-6 py-4 text-[10px] font-semibold uppercase tracking-normal ${dm ? 'text-slate-500' : 'text-slate-400'} ${i === 3 || i === 4 ? 'text-center' : ''} ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${dm ? 'divide-slate-700/50' : 'divide-slate-50'}`}>
                                        {isLoadingProducts ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-[10px] font-semibold uppercase tracking-normal animate-pulse">
                                                    Streaming database inventory...
                                                </td>
                                            </tr>
                                        ) : vendorProducts.length > 0 ? (
                                            vendorProducts.map((product) => (
                                                <tr key={product.id} className={`transition-colors group ${dm ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            {product.images && product.images.length > 0 ? (
                                                                <img
                                                                    src={product.images[0]?.url}
                                                                    alt={product.name}
                                                                    className="w-10 h-10 rounded-lg object-cover border border-slate-100 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                                                    onClick={() => setSelectedProduct(product)}
                                                                />
                                                            ) : (
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${dm ? 'bg-slate-700 border-slate-600 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                                                                    <ShoppingBag size={14} />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className={`text-sm font-bold leading-tight uppercase tracking-normal ${dm ? 'text-slate-200' : 'text-slate-800'}`}>{product.name}</p>
                                                                <p className="text-[9px] font-semibold text-slate-400 uppercase">ID: {product.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`px-6 py-4 text-[10px] font-semibold uppercase tracking-normal ${dm ? 'text-slate-400' : 'text-slate-500'}`}>{product.category}</td>
                                                    <td className={`px-6 py-4 text-sm font-semibold ${dm ? 'text-slate-200' : 'text-slate-900'}`}>
                                                        {new Intl.NumberFormat('en-IN', {
                                                            style: 'currency',
                                                            currency: 'INR',
                                                            minimumFractionDigits: 2
                                                        }).format(product.price)}
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm font-bold text-center ${dm ? 'text-slate-400' : 'text-slate-500'}`}>{product.quantity}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-normal border ${product.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                            {product.status || 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button
                                                                onClick={() => setSelectedProduct(product)}
                                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-semibold uppercase tracking-normal hover:bg-white hover:border-blue-100 border border-transparent transition-all"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => updateProductStatus(product.id, product.status === 'active' ? 'inactive' : 'active')}
                                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-normal transition-all border border-transparent ${product.status === 'active' ? 'bg-rose-50 text-rose-600 hover:bg-white hover:border-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-white hover:border-emerald-100'}`}
                                                            >
                                                                {product.status === 'active' ? 'Block' : 'Unblock'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-16 text-center text-slate-400 text-[10px] font-semibold uppercase tracking-normal opacity-50">
                                                    Zero initial inventory detected
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>



                        {/* Business Documents (Optional Section) */}
                        {/* {vendor.documents && vendor.documents.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden opacity-80">
                                <div className="px-8 py-4 border-b border-gray-100 bg-white">
                                    <h2 className="text-lg font-bold text-slate-700 tracking-normal">Business Documents</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {vendor.documents.map((doc, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-200 text-slate-600 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors font-bold text-[10px]">
                                                    {doc.type}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{doc.name}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">{doc.size}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}
                    </div>
                </main>
            </div>

            {/* Product Detail Modal */}
            < AnimatePresence >
                {selectedProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className={`relative rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto max-h-[90vh] ${dm ? 'bg-[#1e293b]' : 'bg-white'}`}
                        >
                            {/* Image Section */}
                            <div className={`w-full md:w-1/2 p-6 flex flex-col border-b md:border-b-0 md:border-r ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex-1 min-h-[300px] mb-4 relative rounded-2xl overflow-hidden bg-white border border-slate-200">
                                    <img
                                        src={selectedProduct.activeImage || (selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0].url : '')}
                                        alt={selectedProduct.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                    {!selectedProduct.images || selectedProduct.images.length === 0 && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                                            <Package size={48} className="mb-2 opacity-20" />
                                            <p className="text-[10px] font-semibold uppercase tracking-normal opacity-40">No Visual Assets</p>
                                        </div>
                                    )}
                                </div>

                                {/* Scrolling Image Gallery */}
                                {selectedProduct.images && selectedProduct.images.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                        {selectedProduct.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedProduct({ ...selectedProduct, activeImage: img.url })}
                                                className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 transition-all overflow-hidden bg-white ${selectedProduct.activeImage === img.url || (!selectedProduct.activeImage && idx === 0) ? 'border-emerald-600 scale-95 shadow-lg' : 'border-transparent hover:border-slate-200'}`}
                                            >
                                                <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className={`w-full md:w-1/2 p-8 flex flex-col ${dm ? 'bg-[#1e293b]' : 'bg-white'}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-xl font-semibold flex items-center gap-2 ${dm ? 'text-white' : 'text-slate-900'}`}>
                                        <Package className="w-5 h-5 text-emerald-500" />
                                        Product Details
                                    </h2>
                                    <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                        <ChevronDown className="w-5 h-5 text-slate-400 rotate-90" />
                                    </button>
                                </div>

                                <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                                    <div>
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal mb-1.5">Product Name</p>
                                        <p className={`text-lg font-bold leading-tight uppercase ${dm ? 'text-white' : 'text-slate-900'}`}>{selectedProduct.name}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal mb-1">Status</p>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-normal border ${selectedProduct.status?.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                {selectedProduct.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal mb-1">Category</p>
                                            <p className="text-xs font-bold text-slate-700">{selectedProduct.category}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal mb-1">Market Price</p>
                                            <p className="text-lg font-semibold text-slate-900 font-mono">₹{selectedProduct.price?.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal mb-1">Available Units</p>
                                            <p className="text-lg font-semibold text-slate-900">{selectedProduct.quantity}</p>
                                        </div>
                                    </div>

                                    <div className={`pt-6 border-t ${dm ? 'border-slate-700/50' : 'border-slate-100'}`}>
                                        <p className={`text-[10px] font-semibold uppercase tracking-normal mb-3 ${dm ? 'text-slate-500' : 'text-slate-300'}`}>Seller</p>
                                        <div className={`flex items-center gap-3 p-4 rounded-2xl border ${dm ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'}`}>
                                            <Store className="w-5 h-5 text-blue-500" />
                                            <div className="flex flex-col">
                                                <span className={`font-bold text-sm leading-none mb-1 ${dm ? 'text-slate-200' : 'text-slate-700'}`}>{vendor.shop_name}</span>
                                                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-normal">ID: {vendor.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className={`w-full py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-normal transition-all mt-8 ${dm ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'}`}
                                >
                                    Dismiss Profile
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorDetails;

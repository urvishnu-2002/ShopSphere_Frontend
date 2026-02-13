import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useVendors } from '../context/VendorContext';
import { useProducts } from '../context/ProductContext';
import { PanelLeftClose, PanelLeftOpen, ArrowLeft, Lock, Unlock, ShoppingBag, Clock, CheckCircle2, XCircle, AlertCircle, AlertTriangle, Store } from 'lucide-react';

const VendorDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { vendors, updateVendorStatus } = useVendors();
    const { products, updateProductStatus } = useProducts();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const vendor = useMemo(() => {
        return vendors.find(v => v.id === id);
    }, [vendors, id]);

    const vendorProducts = useMemo(() => {
        if (!vendor) return [];
        return products.filter(p => p.vendor === vendor.storeName);
    }, [products, vendor]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/');
    };

    const handleStatusToggle = async () => {
        if (!vendor) return;
        const newStatus = vendor.status === 'Approved' ? 'Blocked' : 'Approved';
        await updateVendorStatus(vendor.id, newStatus);
    };

    if (!vendor) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">Vendor Not Found</h2>
                    <button
                        onClick={() => navigate('/vendors')}
                        className="text-violet-600 hover:underline font-medium"
                    >
                        Go back to Vendors list
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-violet-100 overflow-hidden text-slate-900">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Vendors" onLogout={handleLogout} />

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
                                <Store className="w-5 h-5 text-slate-800" />
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vendor Profile</h1>
                            </div>
                            <p className="text-xs text-slate-500 font-medium ml-7">Review and manage vendor account details and listings</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-violet-900 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-violet-900/20">A</div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-gray-50/50">
                    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-500 hover:text-violet-800 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>

                        {/* Vendor Information Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-4 md:px-8 py-4 border-b border-gray-100 bg-white">
                                <h2 className="text-lg md:text-xl font-bold text-slate-800">Vendor Information</h2>
                            </div>

                            <div className="p-4 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-24 gap-y-6 md:gap-y-8 mb-8">
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shop Name</label>
                                        <p className="text-lg font-semibold text-slate-900">{vendor.storeName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Owner</label>
                                        <p className="text-lg font-semibold text-slate-900">{vendor.owner}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                                        <p className="text-lg font-semibold text-slate-900">{vendor.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approval Status</label>
                                        <div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${vendor.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                                {vendor.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Status</label>
                                        <div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${vendor.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : (vendor.status === 'Blocked' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200')}`}>
                                                {vendor.status === 'Approved' ? 'Active' : vendor.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
                                        <p className="text-lg font-semibold text-slate-900">{vendor.phone}</p>
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Store Address</label>
                                        <p className="text-lg font-semibold text-slate-900">{vendor.address}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registered Date</label>
                                        <p className="text-lg font-semibold text-slate-900">{vendor.registrationDate}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {vendor.status === 'Pending' ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => updateVendorStatus(vendor.id, 'Approved')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all duration-200 border bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Approve Vendor
                                        </button>
                                        <button
                                            onClick={() => updateVendorStatus(vendor.id, 'Blocked')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all duration-200 border bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject Vendor
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleStatusToggle}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all duration-200 border ${vendor.status === 'Approved'
                                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100'
                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100'
                                            }`}
                                    >
                                        {vendor.status === 'Approved' ? (
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

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-4 md:px-8 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
                                <h2 className="text-lg md:text-xl font-bold text-slate-800">Vendor Products ({vendorProducts.length})</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FBFCFD] border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {vendorProducts.length > 0 ? (
                                            vendorProducts.map((product) => (
                                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-4 text-sm font-semibold text-slate-600 group-hover:text-slate-900">{product.name}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                        {new Intl.NumberFormat('en-IN', {
                                                            style: 'currency',
                                                            currency: 'INR',
                                                            minimumFractionDigits: 2
                                                        }).format(product.price)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">{product.stock}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-[11px] font-bold ${product.status === 'Active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                            {product.status || 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                onClick={() => navigate('/products', { state: { searchTerm: product.name } })}
                                                                className="text-indigo-600 hover:text-indigo-800 text-xs font-bold transition-colors"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => updateProductStatus(product.id, product.status === 'Active' ? 'Blocked' : 'Active')}
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
                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm italic font-medium">
                                                    No products have been listed by this vendor yet.
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
                                    <h2 className="text-lg font-bold text-slate-700 tracking-tight">Business Documents</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {vendor.documents.map((doc, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-200 text-slate-600 rounded-lg group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors font-bold text-[10px]">
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
                </div>
            </div>
        </div>
    );
};

export default VendorDetails;

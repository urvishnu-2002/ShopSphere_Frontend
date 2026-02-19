import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    Store,
    PanelLeftClose,
    PanelLeftOpen,
    ChevronDown,
    Package
} from 'lucide-react';

import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useProducts } from '../context/ProductContext';

const ProductManagement = () => {

    const location = useLocation();

    // Context data from axios API
    const {
        products = [],
        loading = false,
        error = null,
        updateProductStatus
    } = useProducts();

    // State
    const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
    const [vendorFilter, setVendorFilter] = useState('All Vendors');
    const [statusFilter, setStatusFilter] = useState(location.state?.status || 'All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Vendor list
    const vendorsList = useMemo(() => {
        if (!products.length) return ['All Vendors'];

        const vendors = [...new Set(products.map(p => p.vendor || 'Unknown Vendor'))];

        return ['All Vendors', ...vendors];
    }, [products]);

    // Filter logic
    const filteredProducts = useMemo(() => {

        if (!products.length) return [];

        return products.filter(product => {

            const name = product.name || '';
            const vendor = product.vendor || '';
            const status = product.status || '';

            const matchesSearch =
                name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesVendor =
                vendorFilter === 'All Vendors' ||
                vendor === vendorFilter;

            const matchesStatus =
                statusFilter === 'All' ||
                status === statusFilter;

            return matchesSearch && matchesVendor && matchesStatus;

        });

    }, [products, searchTerm, vendorFilter, statusFilter]);

    // Block / Unblock handler
    const handleAction = (productId, currentStatus) => {

        const newStatus =
            currentStatus === 'Active'
                ? 'Blocked'
                : 'Active';

        updateProductStatus(productId, newStatus);

    };

    // Logout
    const handleLogout = () => {

        sessionStorage.clear();
        localStorage.clear();

        window.location.href = '/';

    };

    // Currency formatter
    const formatCurrency = (amount) => {

        const value = Number(amount) || 0;

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(value);

    };

    return (

        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">

            <Sidebar
                isSidebarOpen={isSidebarOpen}
                activePage="Products"
                onLogout={handleLogout}
            />

            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="bg-white border-b px-6 py-4 flex justify-between">

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                setIsSidebarOpen(!isSidebarOpen)
                            }
                        >
                            {isSidebarOpen
                                ? <PanelLeftClose size={20} />
                                : <PanelLeftOpen size={20} />
                            }
                        </button>

                        <div className="flex items-center gap-2">
                            <Package size={20} />
                            <h1 className="font-bold">
                                Manage Products
                            </h1>
                        </div>

                    </div>

                </header>

                {/* Main */}
                <main className="flex-1 p-6 overflow-y-auto">

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4">

                        {/* Search */}
                        <div className="relative flex-1">

                            <Search className="absolute left-2 top-2.5" size={16} />

                            <input
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                placeholder="Search product..."
                                className="pl-8 border rounded px-3 py-2 w-full"
                            />

                        </div>

                        {/* Vendor filter */}
                        <select
                            value={vendorFilter}
                            onChange={(e) =>
                                setVendorFilter(e.target.value)
                            }
                            className="border px-3 py-2 rounded"
                        >
                            {vendorsList.map(v => (
                                <option key={v}>{v}</option>
                            ))}
                        </select>

                        {/* Status filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="border px-3 py-2 rounded"
                        >
                            <option value="All">All</option>
                            <option value="Active">Active</option>
                            <option value="Blocked">Blocked</option>
                        </select>

                    </div>

                    {/* Table */}
                    <div className="bg-white rounded shadow-sm">

                        <table className="w-full">

                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Vendor</th>
                                    <th className="p-3">Price</th>
                                    <th className="p-3">Stock</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {/* Loading */}
                                {loading && (
                                    <tr>
                                        <td colSpan="6" className="p-6 text-center">
                                            Loading products...
                                        </td>
                                    </tr>
                                )}

                                {/* Error */}
                                {error && (
                                    <tr>
                                        <td colSpan="6" className="p-6 text-red-500 text-center">
                                            {error}
                                        </td>
                                    </tr>
                                )}

                                {/* Data */}
                                {!loading && !error && filteredProducts.map(product => (

                                    <tr key={product.id} className="border-b">

                                        <td className="p-3">
                                            {product.name}
                                        </td>

                                        <td className="p-3">
                                            {product.vendor}
                                        </td>

                                        <td className="p-3">
                                            {formatCurrency(product.price)}
                                        </td>

                                        <td className="p-3">
                                            {product.stock}
                                        </td>

                                        <td className="p-3">
                                            {product.status}
                                        </td>

                                        <td className="p-3">

                                            <button
                                                onClick={() =>
                                                    handleAction(
                                                        product.id,
                                                        product.status
                                                    )
                                                }
                                                className="text-blue-600"
                                            >
                                                {product.status === 'Active'
                                                    ? 'Block'
                                                    : 'Unblock'}
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </main>

            </div>

        </div>

    );

};

export default ProductManagement;

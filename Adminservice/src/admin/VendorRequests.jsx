import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVendors } from '../context/VendorContext';
import Sidebar from '../components/Sidebar';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const VendorRequests = () => {
    const navigate = useNavigate();
    const { vendors, updateVendorStatus } = useVendors();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Filter to show ONLY pending requests
    const pendingRequests = vendors.filter(vendor => vendor.status === 'Pending');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/');
    };

    const handleAction = async (id, status, name) => {
        const success = await updateVendorStatus(id, status);
        if (success) {
            // Toast is handled by context
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-slate-800">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                activePage="Vendor Requests"
                onLogout={handleLogout}
            />

            <main className="flex-1 overflow-y-auto transition-all duration-300">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-violet-100 hover:text-violet-950 rounded-lg transition-all duration-200"
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5 md:w-6 md:h-6" /> : <PanelLeftOpen className="w-5 h-5 md:w-6 md:h-6" />}
                        </button>
                        <h1 className="text-lg md:text-2xl font-bold text-slate-800 truncate">Manage Vendor Requests</h1>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-auto">
                        <div className="w-8 h-8 bg-violet-900 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-violet-900/20">A</div>
                    </div>
                </header>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {/* Pending Requests Header */}
                    <div className="mb-6">
                        <div className="inline-block px-4 py-2 bg-violet-800 text-white rounded-lg font-medium shadow-lg shadow-violet-900/20">
                            Pending Requests
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Shop Name</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Owner</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Applied On</th>
                                        <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {pendingRequests.map((vendor) => (
                                        <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 md:px-6 py-4 text-sm font-medium text-gray-900">{vendor.storeName}</td>
                                            <td className="px-4 md:px-6 py-4 text-sm text-gray-600">{vendor.owner}</td>
                                            <td className="px-4 md:px-6 py-4">
                                                <span className="text-xs font-medium px-2.5 py-0.5 rounded border bg-yellow-100 text-yellow-800 border-yellow-200">
                                                    PENDING
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 text-sm text-gray-500">{vendor.registrationDate}</td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/vendors/review/${vendor.id}`)}
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(vendor.id, 'Approved', vendor.storeName)}
                                                        className="px-3 py-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(vendor.id, 'Blocked', vendor.storeName)}
                                                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingRequests.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                No pending vendor requests at this time.
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

export default VendorRequests;

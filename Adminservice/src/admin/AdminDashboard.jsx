import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, PanelLeftClose, PanelLeftOpen, ClipboardList, Truck } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { motion as Motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { fetchDashboardStats } from '../api/axios';
import { useEffect } from 'react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [dashData, setDashData] = useState(null);
    const { products } = useProducts();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchDashboardStats();
                setDashData(data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };
        loadStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        window.location.href = '/';
    };
    // dummydata
    const stats = [
        {
            title: 'Total Vendors',
            value: dashData?.vendors.total || 0,
            icon: Store,
            color: 'text-violet-600',
            bgColor: 'bg-violet-50',
            route: '/vendors'
        },
        {
            title: 'Pending Vendors',
            value: dashData?.vendors.pending || 0,
            icon: ClipboardList,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            route: '/vendors/requests'
        },
        {
            title: 'Approved Vendors',
            value: dashData?.vendors.approved || 0,
            icon: Store,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            route: '/vendors',
            routeState: { filter: 'approved' }
        },
        {
            title: 'Blocked Vendors',
            value: dashData?.vendors.blocked || 0,
            icon: Store,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            route: '/vendors',
            routeState: { filter: 'blocked' }
        },
        {
            title: 'Total Products',
            value: products.length,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            route: '/products'
        },
        {
            title: 'Blocked Products',
            value: products.filter(p => p.status === 'Blocked').length,
            icon: ShoppingCart,
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            route: '/products',
            routeState: { status: 'Blocked' }
        },
        {
            title: 'Total Agents',
            value: dashData?.delivery.total || 0,
            icon: Truck,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            route: '/delivery-agents'
        },
        {
            title: 'Pending Agents',
            value: dashData?.delivery.pending || 0,
            icon: ClipboardList,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            route: '/delivery/requests'
        },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-slate-800">

            <Sidebar
                isSidebarOpen={isSidebarOpen}
                activePage="Dashboard"
                onLogout={handleLogout}
            />

            {/* main */}
            <main className="flex-1 overflow-y-auto transition-all duration-300">
                {/* header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg transition-all duration-200"
                            title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
                        >
                            {isSidebarOpen ? (
                                <PanelLeftClose className="w-6 h-6" />
                            ) : (
                                <PanelLeftOpen className="w-6 h-6" />
                            )}
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <NotificationBell />
                    </div>
                </header>

                <div className="p-8 space-y-8 max-w-7xl mx-auto">

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={stat.title}
                                onClick={() => navigate(stat.route, stat.routeState ? { state: stat.routeState } : undefined)}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
                                        <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                        {/* Vendor Management */}
                        <Motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Vendor Management</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => navigate('/vendors/requests')}
                                    className="bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700 rounded-xl p-6 shadow-sm transition-all duration-200 flex flex-col items-center gap-3 font-semibold"
                                >
                                    <ClipboardList className="w-8 h-8 text-violet-600" />
                                    <span className="text-sm uppercase tracking-widest">New Requests</span>
                                </button>
                                <button
                                    onClick={() => navigate('/vendors')}
                                    className="bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700 rounded-xl p-6 shadow-sm transition-all duration-200 flex flex-col items-center gap-3 font-semibold"
                                >
                                    <Store className="w-8 h-8 text-violet-600" />
                                    <span className="text-sm uppercase tracking-widest">All Vendors</span>
                                </button>
                            </div>
                        </Motion.div>

                        {/* Delivery Management */}
                        <Motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Delivery Management</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => navigate('/delivery/requests')}
                                    className="bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 rounded-xl p-6 shadow-sm transition-all duration-200 flex flex-col items-center gap-3 font-semibold"
                                >
                                    <ClipboardList className="w-8 h-8 text-indigo-600" />
                                    <span className="text-sm uppercase tracking-widest">Join Requests</span>
                                </button>
                                <button
                                    onClick={() => navigate('/delivery-agents')}
                                    className="bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 rounded-xl p-6 shadow-sm transition-all duration-200 flex flex-col items-center gap-3 font-semibold"
                                >
                                    <Truck className="w-8 h-8 text-indigo-600" />
                                    <span className="text-sm uppercase tracking-widest">All Agents</span>
                                </button>
                            </div>
                        </Motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

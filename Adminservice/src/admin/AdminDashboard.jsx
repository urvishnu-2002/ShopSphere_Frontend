import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Store,
    ShoppingCart,
    PanelLeftClose,
    PanelLeftOpen,
    ClipboardList,
    Users,
    ShieldCheck,
    Sun,
    Moon,
    Activity,
    ArrowUpRight,
    LayoutDashboard,
    Zap,
    Target,
    BarChart3
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';
import { fetchDashboardStats, logout } from '../api/axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [dashData, setDashData] = useState(null);
    const { isDarkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const adminUsername = localStorage.getItem("adminUsername") || "Admin User";

    useEffect(() => {
        const loadStats = async () => {
            setIsLoading(true);
            try {
                const data = await fetchDashboardStats();
                setDashData(data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    const stats = [
        {
            title: 'Total Vendors',
            value: dashData?.vendors?.total || 0,
            subtitle: 'Registered vendors',
            icon: Store,
            color: 'blue',
            route: '/vendors'
        },
        {
            title: 'Total Customers',
            value: dashData?.customers?.total || 0,
            subtitle: 'Registered users',
            icon: Users,
            color: 'sky',
            route: '/users'
        },
        {
            title: 'Total Products',
            value: dashData?.products?.total || 0,
            subtitle: 'Active listings',
            icon: ShoppingCart,
            color: 'emerald',
            route: '/products'
        },
        {
            title: 'Total Orders',
            value: dashData?.orders?.total || 0,
            subtitle: 'All-time orders',
            icon: Activity,
            color: 'emerald',
            route: '/orders'
        },
        {
            title: 'Delivery Agents',
            value: dashData?.agents?.total || 0,
            subtitle: 'Registered agents',
            icon: Zap,
            color: 'blue',
            route: '/delivery/agents'
        },
        {
            title: 'Deletion Requests',
            value: dashData?.deletion_requests || 0,
            subtitle: 'Pending requests',
            icon: Target,
            color: 'rose',
            route: '/deletion-requests'
        },
    ];

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Dashboard" onLogout={logout} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className={`text-lg font-bold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Admin Operations</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Overview &amp; Quick Actions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">

                            <div className="text-right hidden sm:block">
                                <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{adminUsername}</p>
                                <div className="flex items-center justify-end gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-normal">Authenticated</p>
                                </div>
                            </div>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}>
                                {adminUsername.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-12 transition-all">
                    <div className="max-w-7xl mx-auto space-y-12 pb-12">
                        {/* Welcome Hero */}
                        <div className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-12">
                            <div className={`absolute inset-0 opacity-10 transition-colors ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                            <div className={`absolute inset-0 backdrop-blur-3xl transition-colors ${isDarkMode ? 'bg-[#1e293b]/40' : 'bg-white/40'}`}></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-normal mb-4 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                        <ShieldCheck className="w-3.5 h-3.5" /> Sector 01 Status: Optimal
                                    </div>
                                    <h2 className={`text-3xl md:text-4xl font-semibold tracking-normal mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Welcome, {adminUsername}</h2>
                                    <p className="text-slate-500 font-medium max-w-xl text-sm leading-relaxed">
                                        Monitor platform revenue, oversee vendor operations, and manage user governance in real-time.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className={`w-36 h-32 rounded-[2.5rem] border flex flex-col items-center justify-center transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mb-1">Platform Revenue</p>
                                        <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            ₹{(dashData?.total_revenue || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className={`w-36 h-32 rounded-[2.5rem] border flex flex-col items-center justify-center transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-normal mb-1">Settled Orders</p>
                                        <p className={`text-xl font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                            {dashData?.orders?.delivered || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <Motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => navigate(stat.route)}
                                    className={`group p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer relative overflow-hidden ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 hover:border-blue-500/50 hover:bg-[#1e293b]' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/20'
                                        }`}
                                >
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${stat.color === 'blue' ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') :
                                                stat.color === 'sky' ? (isDarkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600') :
                                                    stat.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                                                        stat.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                                                            stat.color === 'blue' ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') :
                                                                (isDarkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600')
                                                }`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <ArrowUpRight className={`w-5 h-5 opacity-0 group-hover:opacity-40 transition-all ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-500 uppercase tracking-normal mb-1">{stat.title}</p>
                                        <div className="flex items-end gap-3 mt-auto">
                                            <h3 className={`text-4xl font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {isLoading ? '...' : stat.value}
                                            </h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-normal mb-2">{stat.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-5 transition-transform group-hover:scale-150 duration-700 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                                </Motion.div>
                            ))}
                        </div>

                        {/* Strategy Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                            <Motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className={`rounded-[2.5rem] p-10 border transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20'}`}
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold tracking-normal text-white">Vendors</h3>
                                        <p className="text-[10px] text-blue-200 font-bold uppercase tracking-normal">Governance</p>
                                    </div>
                                </div>
                                <p className={`text-sm leading-relaxed mb-10 ${isDarkMode ? 'text-slate-400' : 'text-blue-50'}`}>
                                    Approve new applications, monitor performance, and manage the full vendor network.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => navigate('/vendors/requests')} className="bg-white text-blue-600 py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-normal hover:scale-[1.02] transition-all shadow-lg active:scale-95">Approvals</button>
                                    <button onClick={() => navigate('/vendors')} className="bg-blue-500 text-white py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-normal hover:bg-blue-400 transition-all border border-blue-400/30 active:scale-95">Directory</button>
                                </div>
                            </Motion.div>

                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className={`rounded-[2.5rem] p-10 border transition-all ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20'}`}
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/10 border-white/20 text-white'}`}>
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-white'}`}>Customer Access</h3>
                                        <p className={`text-[10px] font-bold uppercase tracking-normal ${isDarkMode ? 'text-emerald-500/60' : 'text-emerald-100'}`}>Governance</p>
                                    </div>
                                </div>
                                <p className={`text-sm leading-relaxed mb-10 ${isDarkMode ? 'text-slate-400' : 'text-emerald-50'}`}>
                                    Monitor user risk scores, restrict suspicious accounts, and manage global customer directory.
                                </p>
                                <button onClick={() => navigate('/users')} className={`w-full py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-normal transition-all shadow-lg active:scale-95 ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-white text-emerald-600 hover:scale-[1.02]'}`}>Advanced Controls</button>
                            </Motion.div>

                            <Motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className={`rounded-[2.5rem] p-10 border transition-all ${isDarkMode ? 'bg-slate-800/20 border-slate-800 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Logistics Fleet</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Global Network</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed mb-10">
                                    Review new delivery agent applications and manage all active agents on the platform.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => navigate('/delivery/requests')} className={`py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-normal transition-all active:scale-95 ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'}`}>Review</button>
                                    <button onClick={() => navigate('/delivery/agents')} className={`py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-normal transition-all border active:scale-95 ${isDarkMode ? 'bg-transparent border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Directory</button>
                                </div>
                            </Motion.div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;

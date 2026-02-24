import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    PanelLeftClose,
    PanelLeftOpen,
    Users,
    ShieldCheck,
    ShieldAlert,
    Eye,
    Truck,
    Activity,
    Search,
    Filter,
    ArrowUpRight
} from 'lucide-react';
import { fetchAllDeliveryAgents, blockDeliveryAgent, unblockDeliveryAgent } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from '../components/NotificationBell';
import { logout } from '../api/axios';

const DeliveryList = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const loadAgents = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAllDeliveryAgents();
            setAgents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch delivery agents", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAgents();
    }, []);

    const handleBlockAction = async (id, isBlocked) => {
        try {
            if (isBlocked) {
                await unblockDeliveryAgent(id);
            } else {
                const reason = prompt("Enter blocking reason:") || "Blocked by administrator";
                await blockDeliveryAgent(id, reason);
            }
            await loadAgents();
        } catch (error) {
            console.error("Block action failed:", error);
        }
    };

    const filteredAgents = agents.filter(agent => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'approved' && agent.approval_status === 'approved') ||
            (filter === 'pending' && agent.approval_status === 'pending') ||
            (filter === 'blocked' && agent.is_blocked);

        const matchesSearch =
            agent.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.phone_number?.includes(searchQuery);

        return matchesFilter && matchesSearch;
    });

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                activePage="Delivery Agents"
                onLogout={logout}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className={`text-lg font-bold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Logistics Fleet</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Global Fulfillment Registry</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <Truck className="w-3.5 h-3.5" /> Fleet Ops Active
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">
                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Active Units', value: agents.filter(a => !a.is_blocked && a.approval_status === 'approved').length, icon: Truck, color: 'emerald' },
                                { label: 'Total Fleet', value: agents.length, icon: Users, color: 'blue' },
                                { label: 'Approval Queue', value: agents.filter(a => a.approval_status === 'pending').length, icon: Activity, color: 'amber' },
                                { label: 'Restricted Nodes', value: agents.filter(a => a.is_blocked).length, icon: ShieldAlert, color: 'rose' }
                            ].map((stat, i) => (
                                <div key={i} className={`p-6 rounded-[2rem] border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color === 'blue' ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600') :
                                            stat.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') :
                                                stat.color === 'amber' ? (isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600') :
                                                    (isDarkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600')
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

                        {/* Toolbar */}
                        <div className={`p-4 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row gap-4 items-center ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Trace agent by email or protocol ID..."
                                    className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all font-medium ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-white focus:ring-blue-500/10 focus:border-blue-500' : 'bg-slate-50 border-transparent text-slate-900 focus:ring-blue-500/5'
                                        }`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                {['all', 'approved', 'pending', 'blocked'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-5 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-normal transition-all border ${filter === f
                                            ? (isDarkMode ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 border-slate-800 text-white shadow-lg shadow-slate-900/20')
                                            : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50')
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className={`border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                                        <tr>
                                            {['Agent Protocol', 'Vehicle Config', 'Compliance State', 'Grid Access', 'Operations'].map(h => (
                                                <th key={h} className="px-8 py-5 text-[10px] font-semibold text-slate-500 uppercase tracking-normal">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y transition-colors duration-300 ${isDarkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
                                        {isLoading ? (
                                            Array(6).fill(0).map((_, i) => (
                                                <tr key={i} className="animate-pulse">
                                                    <td colSpan="5" className="px-8 py-8"><div className={`h-12 rounded-2xl w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} /></td>
                                                </tr>
                                            ))
                                        ) : filteredAgents.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-24 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                                                            <Truck className="w-10 h-10 text-slate-300" />
                                                        </div>
                                                        <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fleet Ghosted</h3>
                                                        <p className="text-xs text-slate-500 font-medium">No active units detected for current parameters.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredAgents.map((agent) => (
                                            <tr key={agent.id} className={`group transition-all hover:translate-x-1 ${isDarkMode ? 'hover:bg-blue-500/5' : 'hover:bg-slate-50/50'}`}>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-blue-400' : 'bg-slate-50 border-slate-100 text-blue-600 shadow-sm'}`}>
                                                            <Users className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className={`text-sm font-bold truncate max-w-[200px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{agent.user_email}</div>
                                                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-normal leading-none mt-1">{agent.phone_number}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-normal border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-100 text-slate-600 shadow-sm'
                                                        }`}>
                                                        {agent.vehicle_type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-normal border transition-all ${agent.approval_status === 'approved' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100') :
                                                        agent.approval_status === 'pending' ? (isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100') :
                                                            (isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100')
                                                        }`}>
                                                        {agent.approval_status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {agent.is_blocked ? (
                                                        <span className="text-rose-500 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-normal">
                                                            <ShieldAlert className="w-3.5 h-3.5" /> Blocked
                                                        </span>
                                                    ) : (
                                                        <span className="text-emerald-500 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-normal">
                                                            <ShieldCheck className="w-3.5 h-3.5" /> Fully Active
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            onClick={() => navigate(`/delivery/review/${agent.id}`)}
                                                            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-blue-400 hover:bg-slate-700' : 'bg-slate-50 text-blue-600 hover:bg-blue-100 border border-slate-100 hover:border-blue-200 shadow-sm'}`}
                                                        >
                                                            <ArrowUpRight className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleBlockAction(agent.id, agent.is_blocked)}
                                                            className={`p-2 rounded-xl transition-all border ${agent.is_blocked
                                                                ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600')
                                                                : (isDarkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-600')
                                                                }`}
                                                        >
                                                            {agent.is_blocked ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DeliveryList;

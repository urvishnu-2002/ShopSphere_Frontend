import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    CheckCircle,
    AlertTriangle,
    Ban,
    Activity,
    FileText,
    PanelLeftClose,
    PanelLeftOpen,
    ShieldCheck,
    Truck,
    Clock,
    User,
    Mail,
    ArrowRight,
    Loader2,
    Star,
    MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import axios from '../api/axios';

const DeliveryAgentsManagement = () => {
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All Agents');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const loadAgents = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get('/superAdmin/api/delivery-agents/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAgents(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to load agents:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAgents();
    }, []);

    const filteredAgents = useMemo(() => {
        return agents.filter(a => {
            const matchesSearch = a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'All Agents' || a.approval_status === filterStatus.toLowerCase();
            return matchesSearch && matchesFilter;
        });
    }, [agents, searchTerm, filterStatus]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'text-emerald-500 bg-emerald-50 border-emerald-100/50';
            case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100/50';
            case 'blocked': return 'text-rose-500 bg-rose-50 border-rose-100/50';
            default: return 'text-slate-500 bg-slate-50 border-slate-100/50';
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-900">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Delivery Agents" onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Delivery Personnel</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">A</div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Toolbar */}
                    <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email or ID..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-slate-50 border-transparent rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none min-w-[150px]"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option>All Agents</option>
                            <option>Approved</option>
                            <option>Pending</option>
                            <option>Blocked</option>
                        </select>
                        <button onClick={loadAgents} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">
                            Refresh
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#FBFCFD] border-b border-slate-100">
                                    <tr>
                                        {['AGENT', 'TERRITORY', 'VEHICLE', 'PERFORMANCE', 'STATUS', 'ACTIONS'].map(h => (
                                            <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="6" className="px-8 py-8"><div className="h-10 bg-slate-100 rounded-2xl w-full" /></td>
                                            </tr>
                                        ))
                                    ) : filteredAgents.length > 0 ? (
                                        filteredAgents.map(agent => (
                                            <tr key={agent.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-[1rem] bg-indigo-50 flex items-center justify-center font-black text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                                            {agent.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{agent.username}</div>
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                                                <Mail className="w-3 h-3" /> {agent.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                        {agent.city || 'Not specified'}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest">{agent.state || '-'}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                                        {agent.vehicle_type || 'Scooter'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                            <span className="text-[10px] font-black text-yellow-700">{agent.average_rating || '5.0'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                        {agent.completed_deliveries || 0} deliveries
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getStatusColor(agent.is_blocked ? 'blocked' : agent.approval_status)}`}>
                                                        {agent.is_blocked ? 'Blocked' : agent.approval_status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <button
                                                        onClick={() => navigate(`/delivery-agents/review/${agent.id}`)}
                                                        className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:scale-105 transition-all shadow-lg shadow-slate-200"
                                                    >
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                                        <Truck className="w-8 h-8 text-slate-300" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900 uppercase">No agents matched</h3>
                                                    <p className="text-sm text-slate-400 font-medium">Refine your search parameters.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-[#FBFCFD] px-8 py-4 border-t border-slate-100 flex justify-between items-center">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Total {filteredAgents.length} Agents Managed
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DeliveryAgentsManagement;

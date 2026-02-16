import React, { useState, useMemo } from 'react';
import {
    Users,
    Search,
    PanelLeftClose,
    PanelLeftOpen,
    Ban,
    UserCheck,
    Filter,
    ShieldCheck,
    ArrowUpRight,
    SearchX,
    Clock,
    Mail,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { useUsers } from '../context/UserContext';

const UserManagement = () => {
    const { users, isLoading, updateUserStatus } = useUsers();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ALL'); // ALL, ACTIVE, BLOCKED
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [isActioning, setIsActioning] = useState(false);

    // Derived Stats
    const stats = useMemo(() => ({
        total: users.length,
        active: users.filter(u => u.status === 'ACTIVE').length,
        blocked: users.filter(u => u.status === 'BLOCKED').length
    }), [users]);

    // Filtering Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTab = activeTab === 'ALL' || user.status === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [users, searchTerm, activeTab]);

    const handleActionClick = (user, action) => {
        setPendingAction({ user, action });
        setIsActionModalOpen(true);
    };

    const confirmAction = async () => {
        if (!pendingAction) return;
        setIsActioning(true);
        const { user, action } = pendingAction;
        const newStatus = action === 'BLOCK' ? 'BLOCKED' : 'ACTIVE';

        const success = await updateUserStatus(user.id, newStatus);

        setIsActioning(false);
        setIsActionModalOpen(false);
        setPendingAction(null);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'BLOCKED': return 'bg-rose-50 text-rose-500 border-rose-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    const getRiskStyles = (score) => {
        if (score >= 70) return 'text-rose-600 font-bold';
        return 'text-slate-600 font-medium';
    };

    const getRiskBarColor = (score) => {
        if (score >= 70) return 'bg-rose-500';
        return 'bg-violet-600';
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-900">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Users" onLogout={() => window.location.href = '/'} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">User Governance</h1>
                            <p className="text-xs text-slate-500 font-medium tracking-tight uppercase tracking-widest">Access control and status management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="hidden lg:flex items-center bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest gap-2">
                            <ShieldCheck className="w-3.5 h-3.5" /> SuperAdmin
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard label="Total Registered" value={stats.total} icon={Users} color="indigo" />
                        <StatCard label="Active Users" value={stats.active} icon={UserCheck} color="emerald" />
                        <StatCard label="Restricted Access" value={stats.blocked} icon={Ban} color="rose" />
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">
                        {/* Tabs */}
                        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full xl:w-auto overflow-x-auto">
                            {['ALL', 'ACTIVE', 'BLOCKED'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    {tab} List
                                    <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab ? 'bg-white/20' : 'bg-slate-100'}`}>
                                        {tab === 'ALL' ? users.length : users.filter(u => u.status === tab).length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search and Filters */}
                        <div className="flex items-center gap-4 w-full xl:w-auto">
                            <div className="relative flex-1 xl:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-500 shadow-sm">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        {['User Details', 'Contact Root', 'Risk Potential', 'Account Status', 'Registration Date', 'Governance'].map(h => (
                                            <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
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
                                    ) : filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => (
                                            <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 font-black text-lg group-hover:scale-110 transition-transform">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900 mb-0.5">{user.name}</div>
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-2 min-w-[100px]">
                                                        <div className="flex items-center justify-between text-[11px] font-bold tracking-tight">
                                                            <span className={getRiskStyles(user.riskScore)}>{user.riskScore}%</span>
                                                            {user.riskScore >= 70 && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                                                        </div>
                                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-1000 ease-out ${getRiskBarColor(user.riskScore)}`}
                                                                style={{ width: `${user.riskScore}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(user.status)}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                        <Clock className="w-3.5 h-3.5 text-slate-300" /> {user.joinDate}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={`flex items-center gap-3 transition-all duration-300 ${user.status === 'ACTIVE' && user.riskScore >= 70 ? 'opacity-100 scale-105' : 'opacity-0 group-hover:opacity-100'}`}>
                                                        {user.status === 'ACTIVE' ? (
                                                            <button
                                                                onClick={() => handleActionClick(user, 'BLOCK')}
                                                                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${user.riskScore >= 70
                                                                    ? 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-200 animate-pulse'
                                                                    : 'bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-500 hover:text-white'}`}
                                                            >
                                                                <Ban className="w-3.5 h-3.5" /> Block Account
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleActionClick(user, 'UNBLOCK')}
                                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-100"
                                                            >
                                                                <UserCheck className="w-3.5 h-3.5" /> Restore Access
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20">
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                                                        <SearchX className="w-10 h-10 text-slate-300" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-1">No matches found</h3>
                                                    <p className="text-sm text-slate-400 font-medium max-w-xs">Broaden your search criteria or adjust the filters to find the intended accounts.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-50/50 px-8 py-4 flex items-center justify-between border-t border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Verified Directory • {filteredUsers.length} Nodes
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                                ISO Compliance Secured <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isActionModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => !isActioning && setIsActionModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 shadow-2xl border border-slate-100"
                        >
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 border mx-auto ${pendingAction?.action === 'BLOCK' ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                {pendingAction?.action === 'BLOCK' ? <AlertTriangle className="w-10 h-10 text-rose-500" /> : <ShieldCheck className="w-10 h-10 text-emerald-500" />}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 text-center mb-3">Governance Event</h2>
                            <p className="text-sm text-slate-500 text-center font-medium leading-relaxed mb-10 px-4">
                                {pendingAction?.action === 'BLOCK' ? (
                                    <>You are about to <span className="text-rose-500 font-bold">Restrict Access</span> for <span className="text-slate-900 font-bold">{pendingAction?.user.name}</span>. This will prevent logins and transactions immediately.</>
                                ) : (
                                    <>You are about to <span className="text-emerald-500 font-bold">Restore Access</span> for <span className="text-slate-900 font-bold">{pendingAction?.user.name}</span>. All platform features will be re-enabled.</>
                                )}
                            </p>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={confirmAction}
                                    disabled={isActioning}
                                    className={`w-full py-4 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${pendingAction?.action === 'BLOCK' ? 'bg-rose-500 shadow-rose-100 hover:bg-rose-600' : 'bg-slate-900 shadow-slate-100 hover:bg-slate-800'}`}
                                >
                                    {isActioning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Authorization'}
                                </button>
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    disabled={isActioning}
                                    className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
    const colors = {
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100 shadow-indigo-500/5',
        rose: 'text-rose-500 bg-rose-50 border-rose-100 shadow-rose-500/5',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-500/5',
    };

    return (
        <div className={`p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm relative group overflow-hidden`}>
            <div className={`absolute top-0 right-0 p-8 scale-150 opacity-5 group-hover:scale-125 transition-transform duration-1000 ${colors[color].split(' ')[0]}`}>
                <Icon className="w-24 h-24" />
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</div>
            <div className="flex items-end justify-between">
                <div className="text-3xl font-black text-slate-900 leading-none">{value}</div>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight className="w-3 h-3" /> LIVE
                </div>
            </div>
        </div>
    );
};

export default UserManagement;

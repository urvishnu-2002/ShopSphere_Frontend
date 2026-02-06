import React, { useState } from 'react';
import {
    Users,
    Search,
    Bell,
    PanelLeftClose,
    PanelLeftOpen,
    Eye,
    Ban,
    UserCheck,
    Filter
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { motion as Motion } from 'framer-motion';

/** 
 * --- DUMMY DATA / FALLBACK_USERS ---
 * Note: This is temporary mock data for UI/UX demonstration.
 * In a production environment, this will be replaced by an actual API call.
 */
const FALLBACK_USERS = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Vendor', status: 'Active', joinDate: '2024-02-01' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Customer', status: 'Blocked', joinDate: '2024-02-10' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Admin', status: 'Active', joinDate: '2023-12-05' },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'Customer', status: 'Active', joinDate: '2024-03-20' },
    { id: 6, name: 'Evelyn Garcia', email: 'evelyn@example.com', role: 'Vendor', status: 'Active', joinDate: '2024-04-05' },
];

const UserManagement = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Fetch Simulation
    React.useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                // Simulate API latency
                await new Promise(resolve => setTimeout(resolve, 1000));

                // --- EXCLUDE ADMIN ACCOUNTS ---
                // Filter out 'Admin' role as they usually manage from a different panel or scope.
                const ecommerceUsers = FALLBACK_USERS.filter(user => user.role !== 'Admin');
                setUsers(ecommerceUsers);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const getRoleColor = (role) => {
        switch (role) {
            case 'Vendor': return 'bg-blue-100 text-blue-600';
            case 'Customer': return 'bg-orange-100 text-orange-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusColor = (status) => {
        return status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        window.location.href = '/';
    };

    // --- FRONTEND ONLY STATUS TOGGLE (BLOCK/UNBLOCK) ---
    const toggleUserStatus = (id) => {
        setUsers(prevUsers =>
            prevUsers.map(user => {
                if (user.id === id) {
                    return {
                        ...user,
                        status: user.status === 'Active' ? 'Blocked' : 'Active'
                    };
                }
                return user;
            })
        );
    };

    // UI-only view action
    const handleViewUser = (name) => {
        alert(`Viewing details for ${name} (UI Mock)`);
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-slate-800">
            {/* Sidebar */}
            {isSidebarOpen && (
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    activePage="Users"
                    onLogout={handleLogout}
                />
            )}

            {/* Main Content */}
            <main className={`flex-1 overflow-y-auto transition-all duration-300 ${!isSidebarOpen ? 'ml-0' : ''}`}>
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 rounded-lg transition-all duration-200"
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeftOpen className="w-6 h-6" />}
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none w-72 text-sm transition-all shadow-sm"
                            />
                        </div>
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="relative p-2 text-slate-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Users Table Card */}
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">System Marketplace Users</h2>
                                <p className="text-sm text-slate-500">View and manage customer & vendor account statuses</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                                    <Filter className="w-4 h-4" />
                                    <span>Filter</span>
                                </button>
                                {/* "Add User" removed per requirements as users self-register */}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">User Profile</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Account Type</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Joined At</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Administrative Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isLoading ? (
                                        [1, 2, 3, 4, 5].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100" />
                                                        <div className="space-y-2">
                                                            <div className="h-4 w-24 bg-gray-100 rounded" />
                                                            <div className="h-3 w-32 bg-gray-50 rounded" />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded-full" /></td>
                                                <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded-full" /></td>
                                                <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 rounded" /></td>
                                                <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><div className="h-8 w-8 bg-gray-100 rounded" /><div className="h-8 w-8 bg-gray-100 rounded" /></div></td>
                                            </tr>
                                        ))
                                    ) : users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id} className="group hover:bg-indigo-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-inner">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-800">{user.name}</p>
                                                            <p className="text-xs text-slate-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${getRoleColor(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase transition-all duration-300 ${getStatusColor(user.status)}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 text-sm">
                                                    {user.joinDate}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        {/* "Edit" replaced with "View" */}
                                                        <button
                                                            onClick={() => handleViewUser(user.name)}
                                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                            title="View Profile"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {/* "Delete" replaced with Block/Unblock logic */}
                                                        <button
                                                            onClick={() => toggleUserStatus(user.id)}
                                                            className={`p-2 rounded-lg transition-all ${user.status === 'Active'
                                                                    ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                                                    : 'text-red-500 hover:text-green-600 hover:bg-green-50'
                                                                }`}
                                                            title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                                                        >
                                                            {user.status === 'Active' ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                <p className="text-sm font-medium">No system users found.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-center">
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="text-xs text-indigo-600 font-bold hover:underline tracking-tight"
                            >
                                SHOW ALL MARKETPLACE ACCOUNTS
                            </button>
                        </div>
                    </Motion.div>
                </div>
            </main>
        </div>
    );
};

export default UserManagement;

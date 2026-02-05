import React, { useState } from 'react';
import {
    Users,
    Search,
    Bell,
    PanelLeftClose,
    PanelLeftOpen,
    MoreVertical,
    Mail,
    Phone,
    Shield,
    Trash2,
    Edit
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';

const UserManagement = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Mock User Data
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active', joinDate: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Vendor', status: 'Active', joinDate: '2024-02-01' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Customer', status: 'Inactive', joinDate: '2024-02-10' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Admin', status: 'Active', joinDate: '2023-12-05' },
        { id: 5, name: 'David Brown', email: 'david@example.com', role: 'Customer', status: 'Active', joinDate: '2024-03-20' },
    ];

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin': return 'bg-purple-100 text-purple-600';
            case 'Vendor': return 'bg-blue-100 text-blue-600';
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
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none w-64 text-sm transition-all"
                            />
                        </div>
                        <button className="relative p-2 text-slate-500 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Users Table Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">All Users</h2>
                                <p className="text-sm text-slate-500">Manage your system users</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                                <Users className="w-4 h-4" />
                                <span>Add User</span>
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 font-medium text-slate-500 text-sm">User</th>
                                        <th className="px-6 py-4 font-medium text-slate-500 text-sm">Role</th>
                                        <th className="px-6 py-4 font-medium text-slate-500 text-sm">Status</th>
                                        <th className="px-6 py-4 font-medium text-slate-500 text-sm">Joined Date</th>
                                        <th className="px-6 py-4 font-medium text-slate-500 text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((user) => (
                                        <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">{user.name}</p>
                                                        <p className="text-sm text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 text-sm">
                                                {user.joinDate}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-center">
                            <button className="text-sm text-indigo-600 font-medium hover:underline">
                                View All Users
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default UserManagement;

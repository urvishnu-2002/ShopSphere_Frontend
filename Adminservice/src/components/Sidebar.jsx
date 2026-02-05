import React from 'react';
import {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingCart,
    BarChart3,
    LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isSidebarOpen, activePage = 'Dashboard', onLogout }) => {
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Users', icon: Users },
        { name: 'Vendors', icon: Store },
        { name: 'Products', icon: Package },
        { name: 'Orders', icon: ShoppingCart },
        { name: 'Reports', icon: BarChart3 },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{
                x: isSidebarOpen ? 0 : -256,
                opacity: isSidebarOpen ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 md:relative"
        >
            <div className="flex flex-col h-full bg-slate-50">
                <div className="flex items-center justify-between p-6 border-b border-white/50">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
                        <div className="p-1.5 bg-indigo-600 rounded-lg">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span>Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = item.name === activePage;
                        return (
                            <a
                                key={item.name}
                                href="#"
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                    : 'text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-md'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                                {item.name}
                            </a>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">Admin User</p>
                            <p className="text-xs text-slate-500 truncate">admin@shopsphere.com</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;

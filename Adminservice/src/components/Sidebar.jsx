import React from 'react';
import {
    LayoutDashboard,
    Users,
    Store,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    ArrowRight,
    ClipboardList
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, activePage = 'Dashboard', onLogout }) => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Users', icon: Users, path: '/users' },
        { name: 'Vendors', icon: Store, path: '/vendors' },
        { name: 'Vendor Requests', icon: ClipboardList, path: '/vendors/requests' },
        { name: 'Products', icon: Package, path: '/products' },
        { name: 'Reports', icon: BarChart3, path: '/reports' },
        { name: 'Commission Settings', icon: Settings, path: '/settings/commission' },
    ];

    return (
        <Motion.aside
            initial={false}
            animate={{
                width: isSidebarOpen ? '16rem' : '0rem',
                opacity: isSidebarOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 z-50 bg-white border-r border-white/5 md:relative overflow-hidden"
        >
            <div className="flex flex-col h-full bg-white w-64">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-2 text-indigo-500 font-bold text-xl">
                        <div className="p-0 flex items-center justify-center">
                            <img src="/s_logo.png" alt="ShopSphere Logo" className="w-20 h-20 object-contain" />
                        </div>
                        <span className="tracking-tight text-[25px] text-black">Admin</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = item.name === activePage;
                        return (
                            <button
                                key={item.name}
                                onClick={() => !item.isPlaceholder ? navigate(item.path) : null}
                                title={item.isPlaceholder ? "Coming Soon" : ""}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group w-full text-left ${isActive
                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-black'
                                    } ${item.isPlaceholder ? 'cursor-default' : ''}`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-black'}`} />
                                {item.name}
                                {item.isPlaceholder && (
                                    <span className="ml-auto text-[10px] bg-white/10 text-slate-500 px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">Admin User</p>
                            <p className="text-xs text-slate-500 truncate">admin@shopsphere.com</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-1.5 hover:bg-white/5 text-slate-500 hover:text-white rounded-lg transition-colors"
                            title="Logout"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Motion.aside>
    );
};

export default Sidebar;

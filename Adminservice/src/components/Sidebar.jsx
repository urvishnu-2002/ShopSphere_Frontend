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
    ClipboardList,
    Sun,
    Moon,
    LogOut
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isSidebarOpen, activePage = 'Dashboard', onLogout }) => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Users', icon: Users, path: '/users' },
        { name: 'Vendors', icon: Store, path: '/vendors' },
        { name: 'Vendor Requests', icon: ClipboardList, path: '/vendors/requests' },
        { name: 'Orders', icon: ClipboardList, path: '/orders' },
        { name: 'Delivery Agents', icon: Store, path: '/delivery/agents' },

        { name: 'Delivery Requests', icon: ClipboardList, path: '/delivery/requests' },
        { name: 'Products', icon: Package, path: '/products' },
        { name: 'Reports', icon: BarChart3, path: '/reports' },
        { name: 'Deletion Requests', icon: ClipboardList, path: '/deletion-requests' },
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
            className={`fixed inset-y-0 left-0 z-50 border-r md:relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'}`}
        >
            <div className={`flex flex-col h-full w-64 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
                <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-0 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <img src="/s_logo.png" alt="ShopSphere" className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-105" />
                        <div className="flex flex-col -ml-5">
                            <span className={`text-xl font-bold leading-none tracking-wide transition-colors duration-300 group-hover:text-blue-400 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                hopSphere
                            </span>
                            <span className="text-[9px] font-semibold uppercase tracking-normal mt-0.5 text-slate-500">Admin Portal</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = item.name === activePage;
                        return (
                            <button
                                key={item.name}
                                onClick={() => !item.isPlaceholder ? navigate(item.path) : null}
                                title={item.isPlaceholder ? "Coming Soon" : ""}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group w-full text-left ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg shadow-blue-500/20'
                                    : isDarkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                                    } ${item.isPlaceholder ? 'cursor-default' : ''}`}
                            >
                                <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : isDarkMode ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'}`} />
                                <span className="flex-1">{item.name}</span>
                                {item.isPlaceholder && (
                                    <span className="ml-auto text-[10px] bg-white/10 text-slate-500 px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Soon</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto space-y-3">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 group ${isDarkMode
                            ? 'bg-slate-800/40 border-slate-700 text-amber-400 hover:bg-slate-800 hover:border-amber-400/50'
                            : 'bg-slate-50 border-slate-100 text-blue-600 hover:bg-white hover:border-blue-200 shadow-sm'
                            }`}
                    >
                        {isDarkMode ? (
                            <div className="flex items-center gap-3 w-full">
                                <Sun className="w-4 h-4 transition-transform group-hover:rotate-45" />
                                <span className="text-xs font-bold uppercase tracking-normal">Light Mode</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 w-full">
                                <Moon className="w-4 h-4 transition-transform group-hover:-rotate-12" />
                                <span className="text-xs font-bold uppercase tracking-normal text-slate-600">Dark Mode</span>
                            </div>
                        )}
                    </button>

                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="relative group">
                            <div className={`absolute inset-0 blur-md opacity-20 bg-blue-600 rounded-full transition-opacity group-hover:opacity-40`}></div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 relative z-10">
                                A
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold truncate transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ADMIN USER</p>
                            <p className="text-[10px] text-slate-500 font-bold truncate">SUPER ADMIN</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-slate-700 text-slate-500 hover:text-rose-400' : 'hover:bg-white text-slate-400 hover:text-rose-600 shadow-sm hover:shadow-md'}`}
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Motion.aside>

    );
};

export default Sidebar;

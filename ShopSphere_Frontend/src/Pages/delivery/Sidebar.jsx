import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaClipboardList,
    FaMoneyBillWave,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaUser,
    FaListUl
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

export default function DeliverySidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopCollapsed, setDesktopCollapsed] = useState(false);
    const { isDarkMode } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    // Notify layout of desktop width
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('deliverySidebarToggle', {
            detail: { open: !desktopCollapsed }
        }));
    }, [desktopCollapsed]);

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const onLogout = () => {
        localStorage.removeItem("accessToken");
        navigate('/delivery');
    };

    const menu = [
        { label: 'Dashboard', icon: FaTachometerAlt, path: '/delivery/dashboard' },
        { label: 'Active Orders', icon: FaClipboardList, path: '/delivery/assigned' },
        { label: 'Past Deliveries', icon: FaListUl, path: '/delivery/history' },
        { label: 'My Earnings', icon: FaMoneyBillWave, path: '/delivery/earnings' },
        { label: 'My Profile', icon: FaUser, path: '/delivery/profile' },
    ];

    const SidebarContent = ({ collapsed }) => (
        <div className="relative h-full flex flex-col p-4 z-10">
            {/* Logo */}
            <div className="flex justify-between items-center mb-10 px-2 h-16">
                <Link to="/delivery/dashboard" className="flex items-center gap-0 group">
                    <img src="/s_logo.png" alt="ShopSphere" className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110 mb-3 mr-0.5" />
                    {!collapsed && (
                        <div className="flex flex-col -ml-5">
                            <span className={`text-xl font-bold leading-none tracking-wide transition-colors duration-300 group-hover:text-orange-400 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                hopSphere
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] mt-0.5 text-slate-500">Delivery Fleet</span>
                        </div>
                    )}
                </Link>
                {/* Desktop collapse */}
                <button
                    onClick={() => setDesktopCollapsed(!desktopCollapsed)}
                    className={`hidden md:flex p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500 hover:text-white' : 'hover:bg-orange-50 text-slate-400 hover:text-orange-500'}`}
                >
                    {collapsed ? <FaBars size={16} /> : <FaTimes size={16} />}
                </button>
                {/* Mobile close */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className={`md:hidden p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-500 hover:text-white' : 'hover:bg-orange-50 text-slate-400 hover:text-orange-500'}`}
                >
                    <FaTimes size={16} />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto no-scrollbar">
                <ul className="space-y-2">
                    {menu.map(item => {
                        const active = location.pathname.startsWith(item.path);
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    title={collapsed ? item.label : undefined}
                                    className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                                        ${active
                                            ? "bg-gradient-to-r from-orange-400 to-purple-500 text-white shadow-lg shadow-orange-400/20"
                                            : isDarkMode ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                                        }`}
                                >
                                    {active && (
                                        <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                                    )}
                                    <div className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110
                                        ${active ? "text-white" : isDarkMode ? "text-slate-500 group-hover:text-orange-400" : "text-slate-400 group-hover:text-orange-500"}`}
                                    >
                                        <Icon size={18} />
                                    </div>
                                    {!collapsed && (
                                        <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${active ? 'opacity-100' : 'opacity-80'}`}>
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className={`mt-auto border-t pt-5 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <button
                    onClick={onLogout}
                    title={collapsed ? "Logout" : undefined}
                    className="w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-bold uppercase tracking-wider text-[11px]"
                >
                    <FaSignOutAlt className="flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className={`md:hidden fixed top-4 left-4 z-50 w-10 h-10 border rounded-xl flex items-center justify-center shadow-lg transition-colors ${isDarkMode ? 'bg-[#0f172a] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                aria-label="Open menu"
            >
                <FaBars size={16} />
            </button>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`md:hidden fixed top-0 left-0 h-screen w-64 z-50 transition-all duration-300 border-r
                    ${isDarkMode ? 'bg-[#0f172a] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {isDarkMode && <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />}
                <SidebarContent collapsed={false} />
            </aside>

            {/* Desktop sidebar */}
            <aside
                className={`hidden md:block fixed top-0 left-0 h-screen transition-all duration-500 z-40 border-r
                    ${isDarkMode ? 'bg-[#0f172a] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}
                    ${desktopCollapsed ? 'w-20' : 'w-64'}`}
            >
                {isDarkMode && <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />}
                <SidebarContent collapsed={desktopCollapsed} />
            </aside>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
}

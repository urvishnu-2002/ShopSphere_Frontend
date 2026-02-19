import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaTachometerAlt,
    FaClipboardList,
    FaMoneyBillWave,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaHistory,
    FaCheck
} from "react-icons/fa";

export default function DeliverySidebar() {
    const [desktopOpen, setDesktopOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // notify layout about current sidebar state
        window.dispatchEvent(new CustomEvent('deliverySidebarToggle', { detail: { open: desktopOpen } }));
    }, [desktopOpen]);

    const onLogout = () => {
        localStorage.removeItem("accessToken");
        navigate('/delivery');
    };

    const menu = [
        { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, path: '/delivery/dashboard' },
        { id: 'assigned', label: 'Assigned Orders', icon: FaClipboardList, path: '/delivery/assigned' },
        { id: 'history', label: 'History', icon: FaHistory, path: '/delivery/history' },
        { id: 'earnings', label: 'Earnings', icon: FaMoneyBillWave, path: '/delivery/earnings' },
    ];

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-white shadow-lg p-4 transition-all duration-300 z-30 ${desktopOpen ? 'w-64' : 'w-20'}`}
        >
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <img src="/s_logo.png" alt="S" className="w-8 h-8 object-contain" />
                    {desktopOpen && <h2 className="font-bold text-xl text-purple-900 tracking-tight">ShopSphere</h2>}
                </div>
                <button onClick={() => setDesktopOpen(!desktopOpen)} aria-label="Toggle sidebar">
                    <FaBars
                        className="h-6 w-6 cursor-pointer text-gray-500 hover:text-purple-600"
                    />
                </button>
            </div>

            <ul className="space-y-2">
                {menu.map(item => {
                    const active = location.pathname.startsWith(item.path);
                    const Icon = item.icon;

                    return (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300
                ${active ? "bg-purple-600 text-white shadow-lg shadow-purple-200" : "text-gray-500 hover:bg-purple-50 hover:text-purple-600"}`}
                            >
                                <Icon className="h-5 w-5" />
                                {desktopOpen && <span className="font-semibold">{item.label}</span>}
                            </Link>
                        </li>
                    );
                })}

                <li className="mt-8 pt-4 border-t border-gray-100">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 text-red-500 transition-all"
                    >
                        <FaSignOutAlt className="h-5 w-5" />
                        {desktopOpen && <span className="font-semibold">Logout</span>}
                    </button>
                </li>
            </ul>
        </aside>
    );
}

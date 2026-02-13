import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaBars, FaSignOutAlt, FaTachometerAlt, FaClipboardList, FaMoneyBillWave, FaClock } from 'react-icons/fa';

export default function EarningsPage() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const onLogout = () => {
        localStorage.removeItem("accessToken");
        navigate('/login');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, path: '/delivery/dashboard' },
        { id: 'assigned', label: 'Assigned Orders', icon: FaClipboardList, path: '/delivery/assigned' },
        { id: 'earnings', label: 'Earnings', icon: FaMoneyBillWave, path: '/delivery/earnings' },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50 font-sans text-slate-800">
            
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white flex flex-col transition-all duration-300 fixed h-full z-20`}>
                <div className="p-4 flex items-center gap-3 border-b border-gray-700">
                    <FaTruck className="w-6 h-6 text-purple-400" />
                    {sidebarOpen && <span className="font-bold text-lg">Delivery Portal</span>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-gray-400 hover:text-white">
                        <FaBars className="w-5 h-5" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.id === 'earnings';
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <Icon className="w-5 h-5" />
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                        <FaSignOutAlt className="w-5 h-5" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8 flex items-center justify-center`}>
                <div className="text-center max-w-md animate-pulse">
                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaClock className="w-10 h-10 text-purple-600" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Work in Progress</h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        We're currently building a more detailed earnings dashboard for you. Check back soon for deeper insights!
                    </p>
                    <button
                        onClick={() => navigate('/delivery/dashboard')}
                        className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </main>
        </div>
    );
}

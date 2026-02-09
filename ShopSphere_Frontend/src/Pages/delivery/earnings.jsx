import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { FaTruck, FaBars, FaSignOutAlt, FaTachometerAlt, FaClipboardList, FaMoneyBillWave, FaWallet, FaArrowUp, FaDownload } from 'react-icons/fa';

// --- MOCK DATA FOR CHARTS ---
const yearlyData = [
    { name: 'Jan', earnings: 2400 }, { name: 'Feb', earnings: 1398 },
    { name: 'Mar', earnings: 9800 }, { name: 'Apr', earnings: 3908 },
    { name: 'May', earnings: 4800 }, { name: 'Jun', earnings: 3800 },
    { name: 'Jul', earnings: 4300 }, { name: 'Aug', earnings: 5300 },
    { name: 'Sep', earnings: 6100 }, { name: 'Oct', earnings: 5100 },
    { name: 'Nov', earnings: 4600 }, { name: 'Dec', earnings: 7200 },
];

const monthlyData = Array.from({ length: 30 }, (_, i) => ({
    name: `${i + 1}`,
    earnings: Math.floor(Math.random() * 200) + 50
}));

const weeklyData = [
    { name: 'Mon', earnings: 120 }, { name: 'Tue', earnings: 150 },
    { name: 'Wed', earnings: 180 }, { name: 'Thu', earnings: 140 },
    { name: 'Fri', earnings: 250 }, { name: 'Sat', earnings: 320 },
    { name: 'Sun', earnings: 290 },
];

const hourlyData = [
    { name: '9AM', earnings: 0 }, { name: '10AM', earnings: 20 },
    { name: '11AM', earnings: 45 }, { name: '12PM', earnings: 80 },
    { name: '1PM', earnings: 60 }, { name: '2PM', earnings: 30 },
    { name: '3PM', earnings: 50 }, { name: '4PM', earnings: 90 },
    { name: '5PM', earnings: 120 }, { name: '6PM', earnings: 150 },
    { name: '7PM', earnings: 110 }, { name: '8PM', earnings: 80 },
];

const transactionHistory = [
    { id: 1, date: 'Today, 2:30 PM', desc: 'Order #1024 Delivery', amount: 15.50, type: 'credit' },
    { id: 2, date: 'Today, 1:15 PM', desc: 'Order #1023 Delivery', amount: 12.00, type: 'credit' },
    { id: 3, date: 'Yesterday', desc: 'Weekly Payout', amount: -450.00, type: 'debit' },
    { id: 4, date: 'Yesterday', desc: 'Order #1020 Delivery', amount: 18.00, type: 'credit' },
];

export default function EarningsPage() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [timeFilter, setTimeFilter] = useState('weekly'); // 'yearly', 'monthly', 'weekly', 'today'

    const onLogout = () => navigate('/login');

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, path: '/delivery/dashboard' },
        { id: 'assigned', label: 'Assigned Orders', icon: FaClipboardList, path: '/delivery/assigned' },
        { id: 'earnings', label: 'Earnings', icon: FaMoneyBillWave, path: '/delivery/earnings' },
    ];

    // Helper to get current chart data and type
    const getChartConfig = () => {
        switch (timeFilter) {
            case 'yearly':
                return { data: yearlyData, type: 'bar', color: '#8b5cf6' }; // Purple
            case 'monthly':
                return { data: monthlyData, type: 'line', color: '#10b981' }; // Emerald
            case 'weekly':
                return { data: weeklyData, type: 'bar', color: '#3b82f6' }; // Blue
            case 'today':
                return { data: hourlyData, type: 'area', color: '#f59e0b' }; // Amber
            default:
                return { data: weeklyData, type: 'bar', color: '#3b82f6' };
        }
    };

    const { data, type, color } = getChartConfig();

    return (
        <div className="min-h-screen flex bg-gray-50 font-sans text-slate-800">
            {/* Sidebar */}
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

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Earnings & Payouts</h1>
                        <p className="text-gray-500 mt-1">Track your financial growth.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition shadow-lg shadow-gray-200">
                            <FaWallet /> Withdraw Funds
                        </button>
                        <button className="px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition">
                            <FaDownload />
                        </button>
                    </div>
                </header>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-purple-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12"></div>
                        <p className="text-purple-100 font-bold text-xs uppercase tracking-widest mb-1">Available Balance</p>
                        <h2 className="text-4xl font-black mb-4">$1,250.50</h2>
                        <div className="flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1 rounded-lg backdrop-blur-sm">
                            <FaArrowUp className="text-green-300" /> <span className="font-bold">+12%</span> from last week
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Today's Earnings</p>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">$85.20</h2>
                        <p className="text-green-600 text-sm font-bold">5 Orders Completed</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Pending Tips</p>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">$32.00</h2>
                        <p className="text-gray-400 text-sm">Processing in 24h</p>
                    </div>
                </div>

                {/* Main Graphic Section */}
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-100 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <h3 className="text-xl font-bold text-gray-900">Earnings Analytics</h3>

                        {/* Time Filter Buttons */}
                        <div className="bg-gray-100 p-1.5 rounded-xl flex">
                            {['today', 'weekly', 'monthly', 'yearly'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setTimeFilter(filter)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${timeFilter === filter
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {filter === 'today' ? 'Hourly' : filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Chart Area */}
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {type === 'bar' ? (
                                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        cursor={{ fill: '#f9fafb' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="earnings" fill={color} radius={[6, 6, 0, 0]} barSize={40} animationDuration={1000} />
                                </BarChart>
                            ) : type === 'line' ? (
                                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Line type="monotone" dataKey="earnings" stroke={color} strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} animationDuration={1500} />
                                </LineChart>
                            ) : (
                                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Area type="monotone" dataKey="earnings" stroke={color} fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={3} animationDuration={1500} />
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {transactionHistory.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.type === 'debit' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                        {item.type === 'debit' ? '🏦' : '💰'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.desc}</h4>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.date}</p>
                                    </div>
                                </div>
                                <span className={`font-black text-lg ${item.type === 'debit' ? 'text-gray-900' : 'text-green-500'}`}>
                                    {item.type === 'debit' ? '-' : '+'}${Math.abs(item.amount).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

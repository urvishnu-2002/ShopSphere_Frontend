import React, { useState } from 'react';
import {
    Users,
    Store,
    ShoppingCart,
    PanelLeftClose,
    PanelLeftOpen,
    Bell,
    Search,
    ChevronDown,
    DollarSign,
    TrendingUp,
    UserPlus,
    Download,
    Calendar,
    Filter
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import { motion } from 'framer-motion';

// Mock Data based on time ranges
const allSalesData = {
    '1month': [
        { name: 'Week 1', sales: 1200, revenue: 800 },
        { name: 'Week 2', sales: 1500, revenue: 1100 },
        { name: 'Week 3', sales: 1800, revenue: 1400 },
        { name: 'Week 4', sales: 2000, revenue: 1600 },
    ],
    '3months': [
        { name: 'Apr', sales: 2780, revenue: 3908 },
        { name: 'May', sales: 1890, revenue: 4800 },
        { name: 'Jun', sales: 2390, revenue: 3800 },
    ],
    '6months': [
        { name: 'Jan', sales: 4000, revenue: 2400 },
        { name: 'Feb', sales: 3000, revenue: 1398 },
        { name: 'Mar', sales: 2000, revenue: 9800 },
        { name: 'Apr', sales: 2780, revenue: 3908 },
        { name: 'May', sales: 1890, revenue: 4800 },
        { name: 'Jun', sales: 2390, revenue: 3800 },
    ],
    '1year': [
        { name: 'Jan', sales: 4000, revenue: 2400 },
        { name: 'Feb', sales: 3000, revenue: 1398 },
        { name: 'Mar', sales: 2000, revenue: 9800 },
        { name: 'Apr', sales: 2780, revenue: 3908 },
        { name: 'May', sales: 1890, revenue: 4800 },
        { name: 'Jun', sales: 2390, revenue: 3800 },
        { name: 'Jul', sales: 3490, revenue: 4300 },
        { name: 'Aug', sales: 4200, revenue: 5100 },
    ]
};

const stats = [
    {
        title: 'Total Revenue',
        value: '$949.93',
        change: '+12.5% from last month',
        icon: DollarSign,
        color: 'text-green-500',
        bgColor: 'bg-green-50'
    },
    {
        title: 'Total Orders',
        value: '4',
        change: '+8.2% from last month',
        icon: ShoppingCart,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50'
    },
    {
        title: 'Total Users',
        value: '2',
        change: '+5.1% from last month',
        icon: Users,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50'
    },
    {
        title: 'Active Vendors',
        value: '3',
        change: '+3 new this month',
        icon: Store,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50'
    },
];

const productData = [
    { name: 'Electronics', value: 45, fill: '#8884d8' },
    { name: 'Fashion', value: 30, fill: '#8884d8' },
    { name: 'Home', value: 15, fill: '#8884d8' },
    { name: 'Sports', value: 10, fill: '#8884d8' },
];

const recentOrders = [
    { id: 'ORD001', user: 'John Doe', amount: '299.99', status: 'shipped' },
    { id: 'ORD002', user: 'Jane Smith', amount: '399.98', status: 'processing' },
    { id: 'ORD003', user: 'Mike Johnson', amount: '150.00', status: 'delivered' },
    { id: 'ORD004', user: 'Sarah Wilson', amount: '89.50', status: 'shipped' },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'shipped': return 'text-blue-600 bg-blue-50';
        case 'processing': return 'text-amber-600 bg-amber-50';
        case 'delivered': return 'text-green-600 bg-green-50';
        default: return 'text-slate-600 bg-slate-50';
    }
};

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedMetric, setSelectedMetric] = useState('both'); // 'sales', 'revenue', 'both'
    const [dateRange, setDateRange] = useState('6months'); // '1month', '3months', '6months', '1year'

    // Derived state
    const salesData = allSalesData[dateRange] || allSalesData['6months'];

    console.log('Rendering AdminDashboard with data:', { salesData, productData, recentOrders });

    const handleLogout = () => {
        // Clear any stored authentication tokens or user data
        localStorage.removeItem('authToken');
        sessionStorage.clear();

        // Navigate to login page
        window.location.href = '/';
    };

    const handleExport = () => {
        const csvContent = [
            ['Month', 'Sales', 'Revenue'],
            ...salesData.map(item => [item.name, item.sales, item.revenue])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales-overview-${dateRange}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-slate-800">
            {/* Sidebar */}
            {isSidebarOpen && (
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    activePage="Dashboard"
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
                            title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
                        >
                            {isSidebarOpen ? (
                                <PanelLeftClose className="w-6 h-6" />
                            ) : (
                                <PanelLeftOpen className="w-6 h-6" />
                            )}
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none w-64 text-sm transition-all"
                            />
                        </div>
                        <button className="relative p-2 text-slate-500 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="p-8 space-y-8 max-w-7xl mx-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {
                            stats.map((stat, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={stat.title}
                                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
                                            <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                                        </div>
                                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        <span className="text-emerald-500 font-medium whitespace-nowrap">{stat.change}</span>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </div>

                    {/* Sales Overview Section */}
                    <div className="grid grid-cols-1 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Sales Overview</h2>
                                    <p className="text-sm text-slate-500">Compare Sales & Revenue performance</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Metric Toggle */}
                                    <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                                        <button
                                            onClick={() => setSelectedMetric('sales')}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${selectedMetric === 'sales' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Sales
                                        </button>
                                        <button
                                            onClick={() => setSelectedMetric('revenue')}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${selectedMetric === 'revenue' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Revenue
                                        </button>
                                        <button
                                            onClick={() => setSelectedMetric('both')}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${selectedMetric === 'both' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Both
                                        </button>
                                    </div>

                                    {/* Date Range */}
                                    <div className="relative hidden sm:block">
                                        <select
                                            value={dateRange}
                                            onChange={(e) => setDateRange(e.target.value)}
                                            className="appearance-none pl-9 pr-8 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:bg-gray-50 transition-all cursor-pointer"
                                        >
                                            <option value="1month">Last 30 Days</option>
                                            <option value="3months">Last 3 Months</option>
                                            <option value="6months">Last 6 Months</option>
                                            <option value="1year">Last Year</option>
                                        </select>
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>

                                    {/* Export */}
                                    <button
                                        onClick={handleExport}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="hidden sm:inline">Export</span>
                                    </button>
                                </div>
                            </div>

                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value, name) => [`$${value}`, name === 'sales' ? 'Sales' : 'Revenue']}
                                        />
                                        <Legend verticalAlign="top" height={36} iconType="circle" />

                                        {(selectedMetric === 'sales' || selectedMetric === 'both') && (
                                            <Area
                                                type="monotone"
                                                dataKey="sales"
                                                name="Sales"
                                                stroke="#6366f1"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorSales)"
                                                animationDuration={1500}
                                            />
                                        )}

                                        {(selectedMetric === 'revenue' || selectedMetric === 'both') && (
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                name="Revenue"
                                                stroke="#10b981"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                                animationDuration={1500}
                                            />
                                        )}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    {/* Products and Recent Orders Section */}
                    <div className="grid grid-cols-1 gap-8">
                        {/* Products by Category Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <h2 className="text-lg font-bold text-slate-800 mb-6">Products by Category</h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={productData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                        <Tooltip
                                            cursor={{ fill: '#f1f5f9' }}
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                            }}
                                        />
                                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={60} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Orders List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Orders</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="pb-4 pt-2 font-medium text-slate-500">Order ID</th>
                                            <th className="pb-4 pt-2 font-medium text-slate-500">Customer</th>
                                            <th className="pb-4 pt-2 font-medium text-slate-500">Amount</th>
                                            <th className="pb-4 pt-2 font-medium text-slate-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 font-medium text-slate-800">{order.id}</td>
                                                <td className="py-4 text-slate-600">{order.user}</td>
                                                <td className="py-4 font-medium text-slate-800">${order.amount}</td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

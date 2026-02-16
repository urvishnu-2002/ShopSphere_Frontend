import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    Store,
    ShoppingCart,
    ArrowDownRight,
    Download,
    Calendar,
    ShieldCheck,
    PanelLeftClose,
    PanelLeftOpen,
    IndianRupee,
    CheckCircle,
    XCircle,
    RefreshCcw,
    Clock,
    UserCheck,
    Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';

// --- MOCK DATA FOR FUTURE API INTEGRATION ---
// This mock data is structured to mimic a potential REST API response.
// Replace with actual API calls once backend is ready.

const MOCK_SALES_REVENUE = {
    summary: {
        totalOrders: 1240,
        totalRevenue: 89400.50,
        paidOrders: 1150,
        refundedOrders: 90
    },
    daily: [
        { date: '2024-02-01', orders: 45, revenue: 3200.00 },
        { date: '2024-02-02', orders: 52, revenue: 4100.50 },
        { date: '2024-02-03', orders: 38, revenue: 2900.00 },
        { date: '2024-02-04', orders: 61, revenue: 4800.75 },
        { date: '2024-02-05', orders: 55, revenue: 3950.00 },
        { date: '2024-02-06', orders: 48, revenue: 3500.25 },
        { date: '2024-02-07', orders: 50, revenue: 3700.00 },
    ]
};

const MOCK_COMMISSION = [
    { id: 1, vendor: 'TechNova Solutions', sales: 12500, rate: 10, earnings: 1250 },
    { id: 2, vendor: 'Urban Threads', sales: 8400, rate: 12, earnings: 1008 },
    { id: 3, vendor: 'Zen Living', sales: 15600, rate: 8, earnings: 1248 },
    { id: 4, vendor: 'Velvet Charm', sales: 5200, rate: 15, earnings: 780 },
    { id: 5, vendor: 'Pure Grocers', sales: 3400, rate: 5, earnings: 170 },
];

const MOCK_VENDOR_PERFORMANCE = {
    stats: {
        approved: 142,
        pending: 28,
        blocked: 12
    },
    list: [
        { name: 'TechNova Solutions', orders: 450, status: 'Approved' },
        { name: 'Urban Threads', orders: 310, status: 'Approved' },
        { name: 'Pure Grocers', orders: 120, status: 'Pending' },
        { name: 'Velvet Charm', orders: 85, status: 'Blocked' },
        { name: 'Zen Living', orders: 600, status: 'Approved' },
    ]
};

const MOCK_ORDER_STATUS = {
    total: 1240,
    delivered: 1100,
    pending: 85,
    cancelled: 55
};

const MOCK_USERS = {
    stats: {
        total: 5800,
        active: 5200,
        blocked: 150
    },
    types: [
        { type: 'Premium Customers', count: 1200 },
        { type: 'Standard Customers', count: 4600 },
    ]
};

const Reports = () => {
    const [activeReport, setActiveReport] = useState('Sales'); // Sales, Commission, Vendor, Order, User
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Simulate switching reports with loading state
    const handleSwitchReport = (report) => {
        setIsLoading(true);
        setActiveReport(report);
        setTimeout(() => setIsLoading(false), 500);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 overflow-hidden">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Reports" onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-500"
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise Reporting</h1>
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-indigo-100 tracking-widest leading-none">SuperAdmin Insights</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium italic mt-0.5">Read-Only Oversight: Financials, Compliance & Performance Monitoring</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                            {['Sales', 'Commission', 'Vendor', 'Order', 'User'].map((report) => (
                                <button
                                    key={report}
                                    onClick={() => handleSwitchReport(report)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeReport === report ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {report === 'Sales' ? 'Sales & Revenue' :
                                        report === 'Order' ? 'Order Status' :
                                            report === 'User' ? 'User Growth' :
                                                report === 'Vendor' ? 'Vendor Performance' : report}
                                </button>
                            ))}
                        </div>
                        <NotificationBell />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 space-y-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px]">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <RefreshCcw className="w-10 h-10 text-indigo-500 opacity-20" />
                            </motion.div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mt-4">Generating Aggregated Report...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeReport}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {activeReport === 'Sales' && <SalesReport data={MOCK_SALES_REVENUE} />}
                                {activeReport === 'Commission' && <CommissionReport data={MOCK_COMMISSION} />}
                                {activeReport === 'Vendor' && <VendorReport data={MOCK_VENDOR_PERFORMANCE} />}
                                {activeReport === 'Order' && <OrderStatusReport data={MOCK_ORDER_STATUS} />}
                                {activeReport === 'User' && <UserReport data={MOCK_USERS} />}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </main>
            </div>
        </div>
    );
};

// --- SUB-REPORT COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, color, prefix = '' }) => {
    const colorMap = {
        indigo: 'bg-indigo-500/5 bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-500/5 bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-500/5 bg-amber-50 text-amber-600',
        rose: 'bg-rose-500/5 bg-rose-50 text-rose-600'
    };

    const styles = colorMap[color] || colorMap.indigo;
    const bgOpacity = styles.split(' ')[0];
    const bgBase = styles.split(' ')[1];
    const textColor = styles.split(' ')[2];

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${bgOpacity} rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className={`w-12 h-12 ${bgBase} rounded-2xl flex items-center justify-center ${textColor} mb-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-3xl font-black text-slate-900">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</div>
        </div>
    );
};

const SalesReport = ({ data }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="Total Orders" value={data.summary.totalOrders} icon={ShoppingCart} color="indigo" />
            <StatCard label="Total Revenue" value={data.summary.totalRevenue} icon={TrendingUp} color="emerald" prefix="₹" />
            <StatCard label="Paid Volume" value={data.summary.paidOrders} icon={CheckCircle} color="indigo" />
            <StatCard label="Refund Volume" value={data.summary.refundedOrders} icon={ArrowDownRight} color="rose" />
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                    <Calendar className="w-4 h-4 text-indigo-500" /> Daily Revenue Summary (Read-Only)
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase shadow-xl shadow-slate-200">
                    <Download className="w-3.5 h-3.5" /> Export Data
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Order Count</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Gross Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.daily.map((day, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-slate-700 font-mono italic">{day.date}</td>
                                <td className="px-6 py-4 text-sm font-black text-slate-900 text-center">{day.orders}</td>
                                <td className="px-6 py-4 text-sm font-black text-emerald-600 text-right">₹{day.revenue.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const CommissionReport = ({ data }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Processed Sales" value={MOCK_SALES_REVENUE.summary.totalRevenue} icon={TrendingUp} color="indigo" prefix="₹" />
            <StatCard label="Avg Commission" value="9.4%" icon={BarChart3} color="amber" />
            <StatCard label="Admin Earnings" value={data.reduce((acc, curr) => acc + curr.earnings, 0)} icon={IndianRupee} color="emerald" prefix="₹" />
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tight">
                <Store className="w-4 h-4 text-indigo-500" /> Vendor Commission Ledger
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor Entity</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Sales</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rate</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Admin Profit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-slate-900">{item.vendor}</div>
                                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Verified Partner</div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-700">₹{item.sales.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full border border-indigo-100">{item.rate}%</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-black text-indigo-600 text-right font-mono">₹{item.earnings.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const VendorReport = ({ data }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Approved Partners" value={data.stats.approved} icon={CheckCircle} color="emerald" />
            <StatCard label="Pending Approval" value={data.stats.pending} icon={Clock} color="amber" />
            <StatCard label="Compliance Blocks" value={data.stats.blocked} icon={Ban} color="rose" />
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tight">
                <Users className="w-4 h-4 text-indigo-500" /> Marketplace Performance Monitoring
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor Name</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Order Count</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Compliance Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.list.map((vendor, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{vendor.name}</td>
                                <td className="px-6 py-4 text-sm font-black text-slate-700 text-center font-mono">{vendor.orders}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-tighter ${vendor.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        vendor.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                        {vendor.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const OrderStatusReport = ({ data }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="Lifetime Orders" value={data.total} icon={ShoppingCart} color="indigo" />
            <StatCard label="Delivered" value={data.delivered} icon={CheckCircle} color="emerald" />
            <StatCard label="Processing" value={data.pending} icon={Clock} color="amber" />
            <StatCard label="Cancelled" value={data.cancelled} icon={XCircle} color="rose" />
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                    <BarChart3 className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Fulfillment Accuracy: 88.7%</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">SuperAdmin monitoring of system-wide delivery standards and vendor-level fulfillment delays.</p>
            </div>
        </div>
    </div>
);

const UserReport = ({ data }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Customer Base" value={data.stats.total} icon={Users} color="indigo" />
            <StatCard label="Active Sessions" value={data.stats.active} icon={UserCheck} color="emerald" />
            <StatCard label="Access Blocks" value={data.stats.blocked} icon={Ban} color="rose" />
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tight">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> Administrative User Tier Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.types.map((tier, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{tier.type}</div>
                            <div className="text-2xl font-black text-slate-900">{tier.count.toLocaleString()}</div>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                            <TrendingUp className="w-5 h-5 text-indigo-500" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default Reports;

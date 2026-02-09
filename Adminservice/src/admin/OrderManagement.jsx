import React, { useState, useMemo, useEffect } from 'react';
import {
    ShoppingCart,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    RefreshCcw,
    Clock,
    User,
    Store,
    CreditCard,
    Shield,
    FileText,
    History,
    TrendingUp,
    Users,
    ChevronRight,
    ArrowUpRight,
    AlertCircle,
    Ban,
    IndianRupee,
    Layers,
    X,
    PanelLeftClose,
    PanelLeftOpen,
    Eye,
    Download,
    Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';

const INITIAL_ORDERS = [
    {
        id: 'ORD-9921',
        customer: 'Sarah Jenkins',
        email: 'sarah.j@gmail.com',
        date: '2024-02-07 14:22',
        amount: 28420.50,
        status: 'Processing',
        payment: 'Paid',
        paymentMethod: 'Credit Card',
        assignedTeam: 'Fulfillment A',
        refundStatus: null,
        items: 3
    },
    {
        id: 'ORD-9922',
        customer: 'Michael Ross',
        email: 'mike.ross@legal.com',
        date: '2024-02-07 15:45',
        amount: 8499.00,
        status: 'Shipped',
        payment: 'Paid',
        paymentMethod: 'PayPal',
        assignedTeam: 'Logistics North',
        refundStatus: null,
        items: 1
    },
    {
        id: 'ORD-9923',
        customer: 'Elena Gilbert',
        email: 'elena.g@vmail.com',
        date: '2024-02-06 10:15',
        amount: 125000.00,
        status: 'Delivered',
        payment: 'Paid',
        paymentMethod: 'Bank Transfer',
        assignedTeam: 'Prime Delivery',
        refundStatus: 'Pending',
        items: 5
    },
    {
        id: 'ORD-9924',
        customer: 'John Smith',
        email: 'john.smith@tech.com',
        date: '2024-02-06 11:30',
        amount: 4500.00,
        status: 'Cancelled',
        payment: 'Refunded',
        paymentMethod: 'Credit Card',
        assignedTeam: null,
        refundStatus: 'Approved',
        items: 2
    },
    {
        id: 'ORD-9925',
        customer: 'David Miller',
        email: 'd.miller@outlook.com',
        date: '2024-02-05 09:20',
        amount: 21040.00,
        status: 'On Hold',
        payment: 'Pending',
        paymentMethod: 'Debit Card',
        assignedTeam: 'Customer Support',
        refundStatus: null,
        items: 4
    }
];

const AUDIT_LOGS = [
    { id: 1, action: 'Status Update', description: 'ORD-9922 status changed to Shipped', user: 'Admin User', time: '1 hour ago' },
    { id: 2, action: 'Refund Approved', description: 'Refund for ORD-9924 approved', user: 'Admin User', time: '3 hours ago' },
    { id: 3, action: 'Manual Assignment', description: 'ORD-9921 assigned to Fulfillment A', user: 'System', time: '4 hours ago' },
    { id: 4, action: 'Payment Override', description: 'Payment status of ORD-9925 overridden by Admin', user: 'Admin User', time: 'Yesterday' }
];

const OrderManagement = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [financialData] = useState({
        summary: {
            totalSales: INITIAL_ORDERS.reduce((acc, curr) => curr.payment === 'Paid' ? acc + curr.amount : acc, 0),
            refunds: INITIAL_ORDERS.reduce((acc, curr) => curr.payment === 'Refunded' ? acc + curr.amount : acc, 0),
            pending: INITIAL_ORDERS.reduce((acc, curr) => curr.payment === 'Pending' ? acc + curr.amount : acc, 0)
        },
        settlements: INITIAL_ORDERS
    });
    const [auditLogs] = useState(AUDIT_LOGS);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            if (activeTab === 'Refunds') {
                setOrders(INITIAL_ORDERS.filter(o => o.refundStatus !== null));
            } else {
                setOrders(INITIAL_ORDERS);
            }
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.customer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, filterStatus]);

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    const flagOrder = (orderId) => {
        alert(`Order ${orderId} has been flagged for internal SuperAdmin review.`);
    };

    const viewOrderDetails = (orderId) => {
        alert(`Opening read-only audit view for Order ${orderId}`);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Processing': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'On Hold': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 overflow-hidden">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Orders" onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 overflow-hidden">
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-500"
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Oversight</h1>
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-indigo-100">Read-Only (SuperAdmin)</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Monitoring marketplace transactions & compliance</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                            {['All', 'Refunds', 'Financials', 'Audit'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <NotificationBell />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 space-y-6">
                    {isLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <RefreshCcw className="w-10 h-10 text-indigo-500 opacity-20" />
                            </motion.div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mt-4">Analyzing Data Ledger...</div>
                        </div>
                    ) : activeTab === 'All' || activeTab === 'Refunds' ? (
                        <>
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search order ID or customer..."
                                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm shadow-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none shadow-sm"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            getStatusStyle={getStatusStyle}
                                            onFlag={flagOrder}
                                            onView={viewOrderDetails}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center">
                                        <div className="text-slate-300 mb-2 font-black uppercase tracking-widest text-[10px]">No Records Found</div>
                                        <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : activeTab === 'Financials' ? (
                        <FinancialView data={financialData} />
                    ) : (
                        <AuditView logs={auditLogs} />
                    )}
                </main>
            </div>
        </div>
    );
};

const OrderCard = ({ order, getStatusStyle, onFlag, onView }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{order.id}</span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{order.date}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{order.customer}</h3>
                    <p className="text-xs text-slate-400 font-medium">{order.email}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border ${getStatusStyle(order.status)}`}>
                        {order.status}
                    </span>
                    <span className="text-xl font-black text-slate-900">₹{order.amount.toFixed(2)}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
                        <CreditCard className="w-3 h-3 text-indigo-500" /> Payment Status
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${order.payment === 'Paid' ? 'text-emerald-600' : order.payment === 'Refunded' ? 'text-rose-600' : 'text-amber-600'}`}>
                            {order.payment}
                        </span>
                        <span className="text-[9px] font-black text-slate-300 uppercase">Verified</span>
                    </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
                        <Users className="w-3 h-3 text-indigo-500" /> Assigned Fulfillment
                    </div>
                    <p className="text-xs font-bold text-slate-700">{order.assignedTeam || 'Automated Processing'}</p>
                </div>
            </div>

            {order.refundStatus && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                            <RefreshCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider leading-none mb-1">Refund Status</div>
                            <div className="text-xs font-bold text-slate-700">{order.refundStatus === 'Pending' ? 'Awaiting Vendor Action' : `Resolution: ${order.refundStatus}`}</div>
                        </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase bg-white px-2 py-1 rounded-md border border-slate-100">Audit Only</span>
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-2">
                    <button
                        onClick={() => onView(order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-100 transition-all border border-indigo-100"
                    >
                        <Eye className="w-3.5 h-3.5" /> Order Insight
                    </button>
                </div>
                <div className="flex gap-2 relative">
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-xl transition-all ${isMenuOpen ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <>
                                    {/* Transparent Backdrop to close on click outside */}
                                    <div
                                        className="fixed inset-0 z-[60]"
                                        onClick={() => setIsMenuOpen(false)}
                                    />

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 bottom-full mb-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-[70] py-2 overflow-hidden"
                                    >
                                        <button onClick={() => { onView(order.id); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                            <FileText className="w-3.5 h-3.5 text-indigo-500" /> Digital Receipt
                                        </button>
                                        <button onClick={() => setIsMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                                            <Printer className="w-3.5 h-3.5 text-slate-400" /> Print Manifest
                                        </button>
                                        <button onClick={() => setIsMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors border-t border-slate-50">
                                            <Download className="w-3.5 h-3.5 text-slate-400" /> Export JSON
                                        </button>
                                        <button
                                            onClick={() => { onFlag(order.id); setIsMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors border-t border-slate-50"
                                        >
                                            <AlertCircle className="w-3.5 h-3.5" /> Escalation Flag
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const FinancialView = ({ data }) => {
    if (!data) return null;
    const { summary, settlements } = data;
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Revenue Oversight', value: summary.totalSales, icon: TrendingUp, color: 'emerald' },
                    { label: 'Refund Liquidity', value: summary.refunds, icon: RefreshCcw, color: 'rose' },
                    { label: 'Unsettled Ledger', value: summary.pending, icon: Clock, color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -mr-8 -mt-8`}></div>
                        <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 mb-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                        <div className="text-3xl font-black text-slate-900">₹{stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-indigo-500" /> Marketplace Transaction Audit
                </h3>
                <div className="space-y-6">
                    {settlements.map((order, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 ${order.payment === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} rounded-xl flex items-center justify-center`}><Layers className="w-5 h-5" /></div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">{order.id} • {order.customer}</div>
                                    <div className="text-[10px] font-black text-slate-400 tracking-wider uppercase">{order.paymentMethod}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-slate-900">₹{order.amount.toFixed(2)}</div>
                                <div className={`text-[10px] font-black uppercase ${order.payment === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>{order.payment}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AuditView = ({ logs }) => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm animate-in zoom-in-95 duration-500">
            <h3 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" /> Immutable Governance Log
            </h3>
            <div className="space-y-8">
                {logs.map((log) => (
                    <div key={log.id} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-[-2rem] before:w-px before:bg-slate-100 last:before:hidden">
                        <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></div>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg"><History className="w-4 h-4 text-slate-400" /></div>
                                <div>
                                    <div className="text-[11px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">{log.action}</div>
                                    <div className="text-sm font-bold text-slate-800 leading-tight">{log.description}</div>
                                    <div className="text-[10px] text-slate-400 font-medium mt-1 font-mono uppercase tracking-tighter">Auth ID: {log.user.replace(' ', '_')}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-md">{log.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderManagement;

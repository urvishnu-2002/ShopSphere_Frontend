import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart3, TrendingUp, Users, Store, ShoppingCart, ArrowDownRight,
    Calendar, ShieldCheck, PanelLeftClose, PanelLeftOpen, IndianRupee,
    CheckCircle, XCircle, RefreshCcw, Clock, UserCheck, Ban, Package,
    Truck, Activity, AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { fetchReports, logout } from '../api/axios';
import { useTheme } from '../context/ThemeContext';

// ─────────────────────────────────────────────────
// Shared stat card — dark mode aware
// ─────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, prefix = '', sub = '', isDark }) => {
    const colorMap = {
        blue: { bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50', text: 'text-blue-400' },
        emerald: { bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', text: 'text-emerald-400' },
        amber: { bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', text: 'text-amber-400' },
        rose: { bg: isDark ? 'bg-rose-500/10' : 'bg-rose-50', text: 'text-rose-400' },
        emerald: { bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', text: 'text-emerald-400' },
        sky: { bg: isDark ? 'bg-sky-500/10' : 'bg-sky-50', text: 'text-sky-400' },
    };
    const c = colorMap[color] || colorMap.blue;

    return (
        <div className={`p-6 rounded-[2rem] border relative overflow-hidden group transition-colors
            ${isDark ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center ${c.text} mb-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className={`text-xs font-semibold uppercase tracking-normal mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</div>
            <div className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : (value ?? '—')}
            </div>
            {sub && <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</div>}
        </div>
    );
};

const rupee = (n) =>
    '₹' + (n ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const StatusBadge = ({ status, isDark }) => {
    const map = {
        delivered: isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-100',
        completed: isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-100',
        approved: isDark ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-sky-50 text-sky-700 border-sky-100',
        pending: isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-100',
        cancelled: isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-100',
        failed: isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-100',
        blocked: isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-100',
        processing: isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-100',
    };
    const cls = map[status?.toLowerCase()] || (isDark ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-slate-50 text-slate-600 border-slate-100');
    return <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase border tracking-normal ${cls}`}>{status}</span>;
};

const ProgressRow = ({ label, count, max, color = '#6366f1', isDark }) => (
    <div className={`flex items-center gap-3 py-2.5 border-b last:border-0 ${isDark ? 'border-slate-700/50' : 'border-slate-50'}`}>
        <div className="w-28 shrink-0"><StatusBadge status={label} isDark={isDark} /></div>
        <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <div className="h-full rounded-full transition-all duration-700"
                style={{ width: max ? `${(count / max) * 100}%` : '0%', background: color }} />
        </div>
        <div className={`w-10 text-right text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{count}</div>
    </div>
);

// Panel card wrapper for dark mode
const Panel = ({ children, className = '', isDark }) => (
    <div className={`rounded-[2rem] border p-6 md:p-8 transition-colors
        ${isDark ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'} ${className}`}>
        {children}
    </div>
);

const PanelTitle = ({ children, icon: Icon, iconClass = 'text-blue-500', isDark }) => (
    <h3 className={`text-sm font-semibold mb-5 flex items-center gap-2 uppercase tracking-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <Icon className={`w-4 h-4 ${iconClass}`} /> {children}
    </h3>
);

// ─────────────────────────────────────────────────
// 1. SALES & REVENUE
// ─────────────────────────────────────────────────
const SalesReport = ({ data, isDark }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard label="Total Orders" value={data.total_orders} icon={ShoppingCart} color="blue" isDark={isDark} />
            <StatCard label="Total Revenue" value={data.total_revenue} icon={TrendingUp} color="emerald" prefix="₹" isDark={isDark} />
            <StatCard label="Avg Order Value" value={data.avg_order_value} icon={IndianRupee} color="emerald" prefix="₹" isDark={isDark} />
            <StatCard label="Revenue (7 days)" value={data.revenue_week} icon={Calendar} color="sky" prefix="₹" isDark={isDark} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Panel isDark={isDark}>
                <PanelTitle icon={TrendingUp} iconClass="text-emerald-500" isDark={isDark}>Revenue Snapshot</PanelTitle>
                {[
                    { label: 'Today', value: data.revenue_today },
                    { label: 'This Week', value: data.revenue_week },
                    { label: 'This Month', value: data.revenue_month },
                    { label: 'All Time', value: data.total_revenue },
                ].map(({ label, value }) => (
                    <div key={label} className={`flex justify-between items-center py-2.5 border-b last:border-0 ${isDark ? 'border-slate-700/50' : 'border-slate-50'}`}>
                        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
                        <span className="text-sm font-semibold text-emerald-500">{rupee(value)}</span>
                    </div>
                ))}
            </Panel>

            <Panel className="md:col-span-2" isDark={isDark}>
                <PanelTitle icon={Calendar} isDark={isDark}>Daily Revenue — Last 30 Days</PanelTitle>
                <div className="overflow-y-auto max-h-56">
                    <table className="w-full text-left">
                        <thead className={`sticky top-0 border-b ${isDark ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-slate-100'}`}>
                            <tr>
                                <th className={`pb-3 text-[10px] font-semibold uppercase tracking-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Date</th>
                                <th className={`pb-3 text-[10px] font-semibold uppercase tracking-normal text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Orders</th>
                                <th className={`pb-3 text-[10px] font-semibold uppercase tracking-normal text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Revenue</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-50'}`}>
                            {(data.daily_revenue ?? []).length === 0 ? (
                                <tr><td colSpan={3} className={`py-8 text-center text-sm ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>No completed orders in the last 30 days</td></tr>
                            ) : (
                                (data.daily_revenue ?? []).map((d, i) => (
                                    <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'}`}>
                                        <td className={`py-2.5 text-sm font-bold font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{d.day}</td>
                                        <td className={`py-2.5 text-sm font-semibold text-center ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{d.orders}</td>
                                        <td className="py-2.5 text-sm font-semibold text-emerald-500 text-right">{rupee(d.revenue)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Panel>
        </div>
    </div>
);

// ─────────────────────────────────────────────────
// 2. COMMISSION
// ─────────────────────────────────────────────────
const CommissionReport = ({ data, isDark }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Gross Sales" value={data.total_gross} icon={TrendingUp} color="blue" prefix="₹" isDark={isDark} />
            <StatCard label="Platform Commission" value={data.total_platform_commission} icon={IndianRupee} color="rose" prefix="₹" isDark={isDark} />
            <StatCard label="Net to Vendors" value={data.total_net} icon={Activity} color="emerald" prefix="₹" isDark={isDark} />
        </div>

        <Panel isDark={isDark}>
            <PanelTitle icon={Store} isDark={isDark}>Top Vendor Commission Ledger</PanelTitle>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className={`border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50/70 border-slate-100'}`}>
                        <tr>
                            {['#', 'Vendor', 'Gross (₹)', 'Commission (₹)', 'Net (₹)', 'Orders'].map((h, i) => (
                                <th key={h} className={`px-4 py-4 text-[10px] font-semibold uppercase tracking-normal ${isDark ? 'text-slate-500' : 'text-slate-400'} ${i >= 2 ? 'text-right' : ''} ${i === 5 ? 'text-center' : ''}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-50'}`}>
                        {(data.top_vendors ?? []).length === 0 ? (
                            <tr><td colSpan={6} className={`py-10 text-center text-sm ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>No vendor earnings recorded yet</td></tr>
                        ) : (
                            (data.top_vendors ?? []).map((v, i) => (
                                <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'}`}>
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-semibold
                                            ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600') : i === 2 ? 'bg-blue-100 text-blue-700' : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-400')}`}>
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-3.5 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{v.vendor__shop_name || '—'}</td>
                                    <td className={`px-4 py-3.5 text-sm font-bold text-right ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{rupee(v.total_gross)}</td>
                                    <td className="px-4 py-3.5 text-sm font-semibold text-rose-500 text-right">{rupee(v.total_commission)}</td>
                                    <td className="px-4 py-3.5 text-sm font-semibold text-emerald-500 text-right">{rupee(v.total_net)}</td>
                                    <td className={`px-4 py-3.5 text-sm font-semibold text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{v.order_count}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Panel>
    </div>
);

// ─────────────────────────────────────────────────
// 3. VENDOR
// ─────────────────────────────────────────────────
const VendorReport = ({ data, isDark }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard label="Total Vendors" value={data.total_vendors} icon={Store} color="blue" isDark={isDark} />
            <StatCard label="Approved Partners" value={data.approved_vendors} icon={CheckCircle} color="emerald" isDark={isDark} />
            <StatCard label="Blocked Vendors" value={data.blocked_vendors} icon={Ban} color="rose" isDark={isDark} />
            <StatCard label="Active Products" value={data.active_products} icon={Package} color="sky" sub={`${data.blocked_products ?? 0} blocked`} isDark={isDark} />
        </div>

        <Panel isDark={isDark}>
            <PanelTitle icon={Users} isDark={isDark}>Top 10 Vendors by Net Earnings</PanelTitle>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className={`border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50/70 border-slate-100'}`}>
                        <tr>
                            {['#', 'Shop Name', 'Net Earnings (₹)', 'Orders'].map((h, i) => (
                                <th key={h} className={`px-4 py-4 text-[10px] font-semibold uppercase tracking-normal ${isDark ? 'text-slate-500' : 'text-slate-400'} ${i === 2 ? 'text-right' : ''} ${i === 3 ? 'text-center' : ''}`}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-50'}`}>
                        {(data.top_vendors ?? []).length === 0 ? (
                            <tr><td colSpan={4} className={`py-10 text-center text-sm ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>No vendors with earnings yet</td></tr>
                        ) : (
                            (data.top_vendors ?? []).map((v, i) => (
                                <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'}`}>
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-semibold
                                            ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? (isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600') : i === 2 ? 'bg-blue-100 text-blue-700' : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-400')}`}>
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-3.5 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{v.vendor__shop_name || '—'}</td>
                                    <td className="px-4 py-3.5 text-sm font-semibold text-emerald-500 text-right">{rupee(v.total_net)}</td>
                                    <td className={`px-4 py-3.5 text-sm font-semibold text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{v.order_count}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Panel>
    </div>
);

// ─────────────────────────────────────────────────
// 4. ORDER STATUS
// ─────────────────────────────────────────────────
const statusColor = (s) => {
    const m = { delivered: '#10b981', completed: '#10b981', pending: '#f59e0b', cancelled: '#ef4444', failed: '#ef4444', processing: '#6366f1' };
    return m[s?.toLowerCase()] || '#94a3b8';
};

const OrderStatusReport = ({ data, isDark }) => {
    const maxOrderStatus = Math.max(...(data.order_status_breakdown ?? []).map(r => r.count), 1);
    const maxPayStatus = Math.max(...(data.payment_status_breakdown ?? []).map(r => r.count), 1);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard label="Total Orders" value={data.total_orders} icon={ShoppingCart} color="blue" isDark={isDark} />
                <StatCard label="Orders Today" value={data.orders_today} icon={Calendar} color="sky" isDark={isDark} />
                <StatCard label="Orders (7 days)" value={data.orders_this_week} icon={Clock} color="amber" isDark={isDark} />
                <StatCard label="Orders (30 days)" value={data.orders_this_month} icon={Activity} color="emerald" isDark={isDark} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Panel isDark={isDark}>
                    <PanelTitle icon={BarChart3} isDark={isDark}>Order Status Breakdown</PanelTitle>
                    {(data.order_status_breakdown ?? []).length === 0 ? (
                        <div className={`py-10 text-center text-sm ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>No order data yet</div>
                    ) : (
                        (data.order_status_breakdown ?? []).map(r => (
                            <ProgressRow key={r.status} label={r.status} count={r.count} max={maxOrderStatus} color={statusColor(r.status)} isDark={isDark} />
                        ))
                    )}
                </Panel>

                <Panel isDark={isDark}>
                    <PanelTitle icon={CheckCircle} iconClass="text-emerald-500" isDark={isDark}>Payment Status Breakdown</PanelTitle>
                    {(data.payment_status_breakdown ?? []).length === 0 ? (
                        <div className={`py-10 text-center text-sm ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>No payment data yet</div>
                    ) : (
                        (data.payment_status_breakdown ?? []).map(r => (
                            <ProgressRow key={r.payment_status} label={r.payment_status} count={r.count} max={maxPayStatus} color={statusColor(r.payment_status)} isDark={isDark} />
                        ))
                    )}
                </Panel>
            </div>

            <Panel isDark={isDark}>
                <PanelTitle icon={Package} iconClass="text-amber-500" isDark={isDark}>Top 10 Products by Qty Sold</PanelTitle>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className={`border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50/70 border-slate-100'}`}>
                            <tr>
                                {['#', 'Product', 'Qty Sold', 'Revenue (₹)'].map((h, i) => (
                                    <th key={h} className={`px-4 py-4 text-[10px] font-semibold uppercase tracking-normal ${isDark ? 'text-slate-500' : 'text-slate-400'} ${i === 2 ? 'text-center' : ''} ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-50'}`}>
                            {(data.top_products ?? []).length === 0 ? (
                                <tr><td colSpan={4} className={`py-10 text-center text-sm ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>No product order data yet</td></tr>
                            ) : (
                                (data.top_products ?? []).map((p, i) => (
                                    <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'}`}>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-semibold
                                                ${i === 0 ? 'bg-amber-100 text-amber-700' : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-50 text-slate-400')}`}>{i + 1}</span>
                                        </td>
                                        <td className={`px-4 py-3 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{p.product_name}</td>
                                        <td className={`px-4 py-3 text-sm font-semibold text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{p.total_qty}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-emerald-500 text-right">{rupee(p.total_revenue)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Panel>
        </div>
    );
};

// ─────────────────────────────────────────────────
// 5. DELIVERY
// ─────────────────────────────────────────────────
const DeliveryReport = ({ data, isDark }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard label="Total Agents" value={data.total_agents} icon={Users} color="blue" isDark={isDark} />
            <StatCard label="Approved Agents" value={data.approved_agents} icon={UserCheck} color="emerald" isDark={isDark} />
            <StatCard label="Deliveries Done" value={data.total_deliveries_done} icon={Truck} color="sky" isDark={isDark} />
            <StatCard label="Failed Deliveries" value={data.total_deliveries_failed} icon={XCircle} color="rose" isDark={isDark} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Panel isDark={isDark}>
                <PanelTitle icon={IndianRupee} iconClass="text-amber-500" isDark={isDark}>Commission Payouts</PanelTitle>
                {[
                    { label: 'Paid to Agents', value: data.total_delivery_commissions_paid, color: 'text-emerald-500' },
                    { label: 'Pending / Approved', value: data.total_delivery_commissions_pending, color: 'text-amber-500' },
                ].map(({ label, value, color }) => (
                    <div key={label} className={`flex justify-between items-center py-3.5 border-b last:border-0 ${isDark ? 'border-slate-700/50' : 'border-slate-50'}`}>
                        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
                        <span className={`text-sm font-semibold ${color}`}>{rupee(value)}</span>
                    </div>
                ))}
            </Panel>

            <Panel isDark={isDark}>
                <PanelTitle icon={ShieldCheck} isDark={isDark}>Delivery Fulfillment Rate</PanelTitle>
                {(() => {
                    const total = (data.total_deliveries_done ?? 0) + (data.total_deliveries_failed ?? 0);
                    const rate = total > 0 ? ((data.total_deliveries_done / total) * 100).toFixed(1) : null;
                    return (
                        <div className="text-center py-4">
                            <div className={`text-6xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {rate !== null ? `${rate}%` : '—'}
                            </div>
                            <div className={`text-xs uppercase tracking-normal font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {total > 0 ? `${data.total_deliveries_done} delivered of ${total} assigned` : 'No assignments yet'}
                            </div>
                        </div>
                    );
                })()}
            </Panel>
        </div>
    </div>
);

// ─────────────────────────────────────────────────
// 6. PLATFORM & USERS
// ─────────────────────────────────────────────────
const PlatformReport = ({ data, isDark }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard label="Total Customers" value={data.total_customers} icon={Users} color="blue" isDark={isDark} />
            <StatCard label="New Customers (7d)" value={data.new_users_week} icon={UserCheck} color="emerald" isDark={isDark} />
            <StatCard label="Joined Today" value={data.new_users_today} icon={Clock} color="sky" isDark={isDark} />
            <StatCard label="Active Status" value="Healthy" icon={ShieldCheck} color="emerald" isDark={isDark} />
        </div>

        <Panel isDark={isDark}>
            <PanelTitle icon={TrendingUp} iconClass="text-emerald-500" isDark={isDark}>Customer Growth Trace — Last 30 Days</PanelTitle>
            <div className="overflow-y-auto max-h-64 pr-2">
                <table className="w-full text-left">
                    <thead className={`sticky top-0 border-b ${isDark ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-slate-100'}`}>
                        <tr>
                            <th className={`pb-3 text-[10px] font-semibold uppercase tracking-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Registration Date</th>
                            <th className={`pb-3 text-[10px] font-semibold uppercase tracking-normal text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>New Sign-ups</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-50'}`}>
                        {(data.user_growth ?? []).length === 0 ? (
                            <tr><td colSpan={2} className={`py-10 text-center text-sm ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>No customer growth data for this period</td></tr>
                        ) : (
                            (data.user_growth ?? []).map((u, i) => (
                                <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50/50'}`}>
                                    <td className={`py-3 text-sm font-bold font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{u.day}</td>
                                    <td className="py-3 text-sm font-semibold text-blue-500 text-right">+{u.count}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Panel>
    </div>
);

// ─────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────
const TABS = [
    { key: 'Sales', label: 'Sales & Revenue' },
    { key: 'Commission', label: 'Commission' },
    { key: 'Vendor', label: 'Vendor Performance' },
    { key: 'Platform', label: 'Platform & Users' },
    { key: 'Order', label: 'Order Status' },
    { key: 'Delivery', label: 'Delivery' },
];

const Reports = () => {
    const { isDarkMode } = useTheme();
    const [activeReport, setActiveReport] = useState('Sales');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const loadReports = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchReports();
            setReportData(data);
            setLastRefreshed(new Date());
        } catch (err) {
            setError(err?.response?.data?.detail || 'Failed to load report data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadReports(); }, [loadReports]);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300
            ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Reports" onLogout={handleLogout} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Header */}
                <header className={`border-b px-8 py-5 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300
                    ${isDarkMode ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                        >
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-xl font-bold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Reports</h1>
                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase border border-emerald-500/20 tracking-normal leading-none">Live Data</span>
                            </div>
                            {lastRefreshed && (
                                <p className={`text-xs font-medium mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Last refreshed: {lastRefreshed.toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`flex items-center rounded-xl p-1 gap-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            {TABS.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveReport(key)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all
                                        ${activeReport === key
                                            ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm')
                                            : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700')}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={loadReports}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <NotificationBell />
                    </div>
                </header>

                <main className={`flex-1 overflow-y-auto p-8 space-y-8 transition-colors duration-300
                    ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
                    {isLoading && !reportData ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <RefreshCcw className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-300'}`} />
                            </motion.div>
                            <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>Loading Report Data...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-rose-400 ${isDarkMode ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Failed to Load Reports</p>
                                <p className={`text-xs max-w-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{error}</p>
                            </div>
                            <button onClick={loadReports} className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all">
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeReport}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-8"
                            >
                                {activeReport === 'Sales' && <SalesReport data={reportData} isDark={isDarkMode} />}
                                {activeReport === 'Commission' && <CommissionReport data={reportData} isDark={isDarkMode} />}
                                {activeReport === 'Vendor' && <VendorReport data={reportData} isDark={isDarkMode} />}
                                {activeReport === 'Platform' && <PlatformReport data={reportData} isDark={isDarkMode} />}
                                {activeReport === 'Order' && <OrderStatusReport data={reportData} isDark={isDarkMode} />}
                                {activeReport === 'Delivery' && <DeliveryReport data={reportData} isDark={isDarkMode} />}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Reports;

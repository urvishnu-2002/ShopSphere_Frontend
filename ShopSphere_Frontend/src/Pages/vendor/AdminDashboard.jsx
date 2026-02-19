import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import { fetchAdminDashboard } from "../../api/vendor_axios";
import { toast } from "react-hot-toast";
import { Users, Store, ShoppingBag, Truck, ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            setLoading(true);
            const res = await fetchAdminDashboard();
            setData(res);
        } catch (error) {
            toast.error("Failed to load admin dashboard");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!data) return <div className="p-8 text-center text-red-500 font-bold">Failed to load admin session.</div>;

    const orderStats = [
        { name: 'Pending', value: data.orders.status_counts.pending, color: '#f59e0b' },
        { name: 'Confirmed', value: data.orders.status_counts.confirmed, color: '#3b82f6' },
        { name: 'Shipping', value: data.orders.status_counts.shipping, color: '#8b5cf6' },
        { name: 'Delivered', value: data.orders.status_counts.delivered, color: '#10b981' },
        { name: 'Cancelled', value: data.orders.status_counts.cancelled, color: '#ef4444' },
    ];

    return (
        <div className="max-w-7xl mx-auto p-2 sm:p-6">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Overview</h1>
                <p className="text-gray-500 mt-1 font-medium">Control center for ShopSphere marketplace</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    label="Total Users"
                    value={data.users.total}
                    icon={<Users className="text-blue-600" size={24} />}
                    sub={`${data.users.new_today} joined today`}
                    color="bg-blue-50"
                />
                <StatCard
                    label="Active Vendors"
                    value={data.vendors.approved}
                    icon={<Store className="text-emerald-600" size={24} />}
                    sub={`${data.vendors.pending} pending approval`}
                    color="bg-emerald-50"
                />
                <StatCard
                    label="Total Revenue"
                    value={`₹${parseFloat(data.orders.revenue).toLocaleString()}`}
                    icon={<ShoppingBag className="text-amber-600" size={24} />}
                    sub={`Across ${data.orders.total} orders`}
                    color="bg-amber-50"
                />
                <StatCard
                    label="Active Agents"
                    value={data.delivery.approved}
                    icon={<Truck className="text-purple-600" size={24} />}
                    sub={`${data.delivery.pending} waiting`}
                    color="bg-purple-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Status Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-800">Order Progress</h2>
                        <Link to="/adminorders" className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">
                            View All Orders <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={orderStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={45}>
                                    {orderStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-8">Latest Orders</h2>
                    <div className="space-y-6">
                        {data.recent_orders.length > 0 ? data.recent_orders.map(order => (
                            <div key={order.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${order.status === 'shipping' ? 'bg-purple-50 text-purple-600' :
                                            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'
                                        }`}>
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">#{order.order_number}</h4>
                                        <p className="text-xs text-gray-400 font-bold uppercase">{order.customer}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900">₹{parseFloat(order.total).toLocaleString()}</p>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{order.status}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-400 font-medium">No recent orders</div>
                        )}
                    </div>
                    <Link to="/adminorders" className="block w-full text-center mt-10 py-4 bg-gray-50 rounded-2xl text-gray-600 font-bold hover:bg-gray-100 transition-colors">
                        Manage All Shipments
                    </Link>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, sub, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{label}</p>
            <h2 className="text-3xl font-black text-gray-900 mt-1 mb-1">{value}</h2>
            <p className="text-xs text-gray-500 font-medium">{sub}</p>
        </div>
    );
}

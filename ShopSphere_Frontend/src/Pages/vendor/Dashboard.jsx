import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { fetchVendorDashboard } from "../../api/vendor_axios";
import { getUserInfo } from "../../api/axios";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin and redirect
    getUserInfo().then(u => {
      if (u?.role === 'admin' || u?.is_staff) {
        window.location.href = '/admindashboard';
      } else {
        loadDashboardData();
      }
    });
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetchVendorDashboard();
      setData(res);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load data. Please check your vendor approval status.</div>;
  if (!data.profile) return <div className="p-8 text-center text-red-500">Vendor profile data is missing. Please contact support.</div>;

  const { profile } = data;
  const order_summary = data.order_summary || {
    delivered_orders: 0,
    processing_orders: 0,
    pending_orders: 0,
    cancelled_orders: 0,
    total_orders: 0
  };
  const recent_orders = data.recent_orders || [];
  const recent_analytics = data.recent_analytics || [];

  // Format analytics for chart
  const chartData = recent_analytics.length > 0 ? recent_analytics.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: parseFloat(item.total_revenue || 0)
  })).reverse() : [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* WELCOME */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile.shop_name}!</h1>
          <p className="text-gray-500 mt-1">
            Here's how your business is performing.
          </p>
        </div>
        <div className="text-right">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${profile.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {profile.approval_status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">
        <Card title="Total Revenue" value={`₹${parseFloat(profile.total_revenue).toLocaleString()}`} color="bg-emerald-500" />
        <Card title="Total Products" value={profile.total_products} color="bg-blue-500" />
        <Card title="Total Orders" value={profile.total_orders} color="bg-purple-500" />
        <Card title="Pending Commission" value={`₹${parseFloat(profile.pending_commission).toLocaleString()}`} color="bg-amber-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* RECENT SALES CHART */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Revenue (Last 7 Days)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDER STATS SUMMARY */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
          <div className="space-y-4">
            <StatRow label="Delivered" value={order_summary.delivered_orders} total={order_summary.total_orders} color="bg-emerald-500" />
            <StatRow label="Processing" value={order_summary.processing_orders} total={order_summary.total_orders} color="bg-blue-500" />
            <StatRow label="Pending" value={order_summary.pending_orders} total={order_summary.total_orders} color="bg-amber-500" />
            <StatRow label="Cancelled" value={order_summary.cancelled_orders} total={order_summary.total_orders} color="bg-red-500" />
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500 mb-1">Store Rating</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">{profile.average_rating}</span>
              <span className="text-amber-400 text-2xl font-bold">★</span>
            </div>
            <p className="text-xs text-gray-400">{profile.total_reviews} reviews</p>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
          <button
            onClick={() => window.location.href = '/vendororders'}
            className="text-emerald-600 font-semibold text-sm hover:underline"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
                <th className="pb-4">Product</th>
                <th className="pb-4 text-center">Qty</th>
                <th className="pb-4 text-right">Amount</th>
                <th className="pb-4 text-center">Status</th>
                <th className="pb-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recent_orders.map((order, i) => (
                <tr key={i} className="group">
                  <td className="py-4">
                    <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{order.product}</p>
                  </td>
                  <td className="py-4 text-center text-gray-500">
                    {order.quantity}
                  </td>
                  <td className="py-4 text-right font-bold text-gray-900">
                    ₹{parseFloat(order.total_price).toLocaleString()}
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.vendor_status)}`}>
                      {order.vendor_status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 text-right text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recent_orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      <div className="flex items-center gap-3 mt-3">
        <div className={`w-1.5 h-6 rounded-full ${color}`} />
        <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
      </div>
    </div>
  );
}

function StatRow({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="text-gray-900 font-bold">{value}</span>
      </div>
      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function getStatusStyle(status) {
  switch (status.toLowerCase()) {
    case 'delivered': return 'bg-emerald-100 text-emerald-700';
    case 'processing': return 'bg-blue-100 text-blue-700';
    case 'shipped': return 'bg-purple-100 text-purple-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

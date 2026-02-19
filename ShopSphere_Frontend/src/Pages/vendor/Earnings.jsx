import { useEffect, useState } from "react";
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
} from "recharts";
import { FaWallet, FaDownload, FaArrowUp } from 'react-icons/fa';
import { fetchVendorProducts, fetchAdminRevenueReport } from "../../api/vendor_axios";
import { getUserInfo } from "../../api/axios";

// vendor earnings page styled like delivery earnings
export default function Earnings() {
  const [timeFilter, setTimeFilter] = useState('weekly');
  const [products, setProducts] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const userInfo = await getUserInfo();
        setUser(userInfo);

        if (userInfo?.role === 'admin') {
          const stats = await fetchAdminRevenueReport(30);
          setAdminStats(stats);
        } else {
          const data = await fetchVendorProducts();
          const productList = data.results || data || [];
          setProducts(productList.map(p => ({
            ...p,
            price: Number(p.price) || 0,
            approved: p.status === 'active'
          })));
        }
      } catch (error) {
        console.error("Error loading earnings data:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // derive simple stats
  const totalRevenue = user?.role === 'admin'
    ? parseFloat(adminStats?.total_revenue || 0)
    : products.reduce((s, p) => s + p.price, 0);

  const totalOrders = user?.role === 'admin'
    ? adminStats?.total_count || 0
    : products.length;

  const getChartData = () => {
    if (user?.role === 'admin' && adminStats?.chart_data) {
      return adminStats.chart_data.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        earnings: parseFloat(item.revenue)
      }));
    }

    // Fallback/Vendor logic
    return products.slice(0, 10).map(p => ({
      name: p.name.slice(0, 8),
      earnings: p.price
    }));
  };

  const chartData = getChartData();
  const type = 'bar'; // Simplified for consistency
  const color = user?.role === 'admin' ? '#6366f1' : '#3b82f6';

  // build transactions
  const transactions = user?.role === 'admin' ? [] :
    products.slice().reverse().slice(0, 6).map((p, idx) => ({
      id: idx + 1,
      date: 'Recent',
      desc: `Sale: ${p.name}`,
      amount: p.price,
      type: 'credit'
    }));

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Earnings & Payouts</h1>
          <p className="text-gray-500 mt-1">Overview of your store earnings</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-purple-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12"></div>
          <p className="text-purple-100 font-bold text-xs uppercase tracking-widest mb-1">Available Balance</p>
          <h2 className="text-4xl font-black mb-4">₹{totalRevenue.toFixed(2)}</h2>
          <div className="flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1 rounded-lg backdrop-blur-sm">
            <FaArrowUp className="text-green-300" /> <span className="font-bold">+12%</span> from last week
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Total Orders</p>
          <h2 className="text-3xl font-black text-gray-900 mb-2">{totalOrders}</h2>
          <p className="text-green-600 text-sm font-bold">Recent sales</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Pending Payouts</p>
          <h2 className="text-3xl font-black text-gray-900 mb-2">₹0.00</h2>
          <p className="text-gray-400 text-sm">Processing in 24h</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-100 border border-gray-100 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h3 className="text-xl font-bold text-gray-900">Earnings Analytics</h3>
          <div className="bg-gray-100 p-1.5 rounded-xl flex">
            {['today', 'weekly', 'monthly', 'yearly'].map(filter => (
              <button key={filter} onClick={() => setTimeFilter(filter)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${timeFilter === filter ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {filter === 'today' ? 'Hourly' : filter}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey={type === 'bar' ? (data[0] && data[0].earnings !== undefined ? 'earnings' : 'value') : 'earnings'} fill={color} radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            ) : type === 'line' ? (
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Line type="monotone" dataKey="earnings" stroke={color} strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
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
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Area type="monotone" dataKey="earnings" stroke={color} fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={3} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {transactions.length ? transactions.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-green-50 text-green-500`}>
                  💰
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.desc}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.date}</p>
                </div>
              </div>
              <span className="font-black text-lg text-green-500">+₹{item.amount.toFixed(2)}</span>
            </div>
          )) : (
            <p className="text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}

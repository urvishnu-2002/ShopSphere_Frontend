import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVendorProducts, getVendorOrders, getVendorProfile, getVendorEarningsSummary } from "../../api/vendor_axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import {
  FaStore,
  FaBox,
  FaShoppingCart,
  FaWallet,
  FaChartLine,
  FaClock,
  FaFileInvoice,
  FaPercentage,
  FaBoxOpen,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({ revenue: "0.00", products: 0, orders: 0, available: "0.00", uncleared: "0.00" });
  const [salesChart, setSalesChart] = useState([
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch profile first to see if they are actually a vendor
        let profile;
        try {
          profile = await getVendorProfile();
          setVendor(profile);
        } catch (err) {
          if (err.response?.status === 404) {
            toast.error("Vendor profile not found. Please complete your registration.");
            navigate('/account-verification');
            return;
          }
          throw err;
        }

        const [products, orders] = await Promise.all([
          getVendorProducts().catch(() => []),
          getVendorOrders().catch(() => [])
        ]);

        let earningsSummary = {
          lifetime_earnings: 0,
          available_balance: 0,
          uncleared_balance: 0,
          total_gross: 0,
          total_commission: 0,
          total_net: 0
        };
        try {
          earningsSummary = await getVendorEarningsSummary();
        } catch (err) {
          console.warn("Could not fetch earnings summary", err);
        }

        setStats({
          revenue: parseFloat(earningsSummary.lifetime_earnings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          products: products.length,
          orders: orders.length,
          available: parseFloat(earningsSummary.available_balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          uncleared: parseFloat(earningsSummary.uncleared_balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          totalGross: parseFloat(earningsSummary.total_gross || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          totalCommission: parseFloat(earningsSummary.total_commission || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          totalNet: parseFloat(earningsSummary.total_net || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
        });

        setRecentOrders(orders.slice(0, 5).map(o => ({
          id: o.order_id,
          order_number: o.order_number,
          name: o.product,
          amount: (parseFloat(o.price) * o.quantity).toFixed(2),
          status: o.status
        })));

      } catch (error) {
        console.error("Dashboard error:", error);
        if (error.response?.status === 403) {
          toast.error(error.response?.data?.error || "Access Denied");
          navigate('/login');
        } else {
          toast.error("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] transition-colors duration-300 ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
        <div className={`w-16 h-16 border-4 rounded-full animate-spin mb-6 ${isDarkMode ? 'border-teal-400/20 border-t-teal-400' : 'border-slate-200 border-t-teal-500'}`}></div>
        <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading your store...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in duration-700 font-['Inter']">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="relative">
          <h1 className={`text-4xl md:text-5xl font-semibold tracking-normal flex items-center gap-5 uppercase ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-sky-400 to-blue-500 rounded-[22px] flex items-center justify-center text-white shadow-2xl shadow-sky-500/20 rotate-3">
              <FaStore size={26} />
            </div>
            Command Center
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-normal text-sky-500 mt-4 ml-1 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
            Merchant: {vendor?.shop_name || "Nexus Node"}
          </p>
        </div>
        <div className={`flex p-1.5 rounded-[24px] border backdrop-blur-xl w-full md:w-auto transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-white border-orange-100 shadow-xl shadow-sky-500/5'}`}>
          <button className={`flex-1 md:flex-none px-8 py-3 rounded-2xl text-[11px] font-semibold uppercase tracking-normal shadow-lg transition-all ${isDarkMode ? 'bg-sky-500 text-white shadow-sky-900/20' : 'bg-slate-800 text-white shadow-gray-200'}`}>Real-time Live</button>
        </div>
      </header>

      {/* KPI CLUSTER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <KPICard title="My Balance" value={`₹${stats.available}`} icon={FaWallet} color="orange" subtitle="Available now" isDarkMode={isDarkMode} />
        <KPICard title="Pending" value={`₹${stats.uncleared}`} icon={FaClock} color="purple" subtitle="Next payout" isDarkMode={isDarkMode} />
        <KPICard title="Total Sales" value={`₹${stats.revenue}`} icon={FaChartLine} color="indigo" subtitle="All-time resonance" isDarkMode={isDarkMode} />
        <KPICard title="Orders" value={stats.orders} icon={FaShoppingCart} color="emerald" subtitle="Completed nodes" isDarkMode={isDarkMode} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* GRAPH */}
        <div className={`rounded-[48px] p-8 md:p-12 border shadow-2xl relative overflow-hidden group transition-all duration-500 lg:col-span-2 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-xl shadow-sky-500/5' : 'bg-white border-orange-50/50 shadow-xl shadow-sky-500/5'}`}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50"></div>
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isDarkMode ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                  <FaChartLine size={22} />
                </div>
                <h3 className={`text-2xl font-semibold tracking-normal  uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Market Trajectory</h3>
              </div>
              <div className={`px-5 py-2.5 border rounded-2xl text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'bg-slate-900 border-slate-800 text-sky-500' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
                Last 6 Cycles
              </div>
            </div>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChart}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: isDarkMode ? '#475569' : '#94a3b8' }} dy={10} />
                  <Tooltip
                    contentStyle={{
                      background: isDarkMode ? '#0f172a' : '#fff',
                      border: 'none',
                      borderRadius: '24px',
                      boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.2)',
                      padding: '20px',
                      fontFamily: 'Inter'
                    }}
                    itemStyle={{ color: isDarkMode ? '#fff' : '#111827', fontWeight: '900' }}
                    cursor={{ stroke: '#f97316', strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={5} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className={`rounded-[48px] p-8 md:p-10 border shadow-2xl flex flex-col transition-all duration-500 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-xl' : 'bg-white border-orange-50/50 shadow-xl shadow-sky-500/5'}`}>
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isDarkMode ? 'bg-blue-400/10 text-purple-400 border-blue-400/20' : 'bg-purple-50 text-blue-500 border-purple-100'}`}>
              <FaShoppingCart size={22} />
            </div>
            <h3 className={`text-2xl font-semibold tracking-normal  uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Active Stream</h3>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto max-h-[450px] no-scrollbar pr-1">
            {recentOrders.length > 0 ? recentOrders.map((order, idx) => (
              <div key={idx} className={`p-5 flex justify-between items-center border rounded-[30px] transition-all duration-300 group ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-sky-500/30' : 'bg-orange-50/50 border-orange-100 hover:bg-white hover:border-orange-200 shadow-sm'}`}>
                <div className="min-w-0 flex-1 pr-3">
                  <p className={`text-xs font-semibold tracking-normal  uppercase truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>#{order.order_number}</p>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest truncate mt-1">{order.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-sky-500 tracking-normal ">₹{order.amount}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest mt-1.5 ${order.status === 'received' ? 'bg-blue-500/10 text-blue-400' :
                    order.status === 'processing' ? 'bg-amber-500/10 text-amber-400' :
                      order.status === 'shipped' ? 'bg-blue-400/10 text-purple-400' :
                        'bg-emerald-500/10 text-emerald-400'
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 opacity-30">
                <FaBoxOpen size={40} className="mx-auto mb-4" />
                <p className="text-[10px] font-semibold uppercase tracking-normal ">No active nodes</p>
              </div>
            )}
          </div>

          <button onClick={() => navigate('/vendororders')} className={`mt-8 w-full py-5 text-[11px] font-semibold uppercase tracking-normal rounded-[28px] transition-all duration-500 shadow-2xl ${isDarkMode ? 'bg-sky-500 text-white shadow-sky-900/20 hover:bg-sky-400' : 'bg-slate-800 text-white hover:bg-sky-500 shadow-orange-200'}`}>
            Audit All Requests
          </button>
        </div>
      </div>

      {/* FINANCIAL SUMMARY */}
      <div className={`rounded-[48px] p-8 md:p-12 border shadow-2xl transition-all duration-500 relative overflow-hidden ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-xl' : 'bg-white border-orange-50/50 shadow-xl shadow-sky-500/5'}`}>
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50"></div>
        <div className="flex items-center gap-4 mb-10 md:mb-12 relative z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
            <FaPercentage size={22} />
          </div>
          <h3 className={`text-2xl font-semibold tracking-normal  uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Liquidity Matrix</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-10">
          <SettlementMetric label="Total Distribution" value={`₹${stats.totalGross}`} color={isDarkMode ? 'white' : 'gray'} isDarkMode={isDarkMode} />
          <SettlementMetric label="Marketplace Fee" value={`−₹${stats.totalCommission}`} color="rose" isDarkMode={isDarkMode} />
          <SettlementMetric label="Direct Earnings" value={`₹${stats.totalNet}`} color="emerald" isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, subtitle, isDarkMode }) {
  const themes = {
    orange: isDarkMode ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-sky-500/5' : 'bg-orange-50 text-orange-600 border-orange-100 shadow-orange-100',
    purple: isDarkMode ? 'bg-blue-400/10 text-purple-400 border-blue-400/20 shadow-blue-400/5' : 'bg-purple-50 text-blue-500 border-purple-100 shadow-purple-100',
    indigo: isDarkMode ? 'bg-teal-400/10 text-indigo-400 border-teal-400/20 shadow-teal-400/5' : 'bg-indigo-50 text-teal-500 border-indigo-100 shadow-indigo-100',
    emerald: isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5' : 'bg-emerald-50 text-emerald-500 border-emerald-100 shadow-emerald-100'
  };

  const bgGradients = {
    orange: 'from-sky-500 to-orange-600',
    purple: 'from-blue-400 to-blue-500',
    indigo: 'from-teal-400 to-teal-500',
    emerald: 'from-emerald-500 to-emerald-500'
  };

  return (
    <div className={`p-8 rounded-[48px] border-2 shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between hover:scale-[1.02] ${isDarkMode ? 'bg-[#0f172a] border-slate-800 hover:border-sky-500/30' : 'bg-white border-orange-50 hover:border-orange-200'}`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bgGradients[color]} opacity-[0.03] rounded-full translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-150`}></div>
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center text-white bg-gradient-to-br ${bgGradients[color]} shadow-xl transition-transform duration-500 group-hover:rotate-6`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-normal mb-2 ml-1">{title}</p>
        <p className={`text-3xl font-semibold tracking-normal  ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full bg-sky-500`}></div>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function SettlementMetric({ label, value, color, isDarkMode }) {
  const colors = {
    white: 'text-white',
    gray: 'text-slate-800',
    rose: 'text-rose-500',
    emerald: 'text-sky-500' // Using orange for emerald to match theme
  };

  return (
    <div className={`space-y-4 p-8 rounded-[40px] border-2 transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-sky-500/20' : 'bg-orange-50/50 border-orange-100 hover:bg-white hover:border-orange-200 shadow-sm'}`}>
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-normal ">{label}</p>
      <p className={`text-3xl md:text-4xl font-semibold tracking-normal ${colors[color]} truncate `}>{value}</p>
      <div className={`w-16 h-1.5 rounded-full ${isDarkMode ? 'bg-sky-500/20' : 'bg-orange-200/50'}`}></div>
    </div>
  );
}

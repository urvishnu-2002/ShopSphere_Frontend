import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaWallet, FaDownload, FaArrowUp, FaChartPie, FaHistory, FaFileInvoiceDollar, FaExchangeAlt } from 'react-icons/fa';
import { getVendorEarningsSummary, getVendorEarningsAnalytics } from "../../api/vendor_axios";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function Earnings() {
  const [timeFilter, setTimeFilter] = useState('weekly');
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getVendorEarningsSummary();
        setSummary(data);
      } catch (err) {
        console.error("Error loading earnings:", err);
      }
    };
    loadSummary();
  }, []);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getVendorEarningsAnalytics(timeFilter);
        setChartData(data);
      } catch (err) {
        console.error("Error loading graph data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [timeFilter]);

  const totalRevenue = summary?.available_balance ? parseFloat(summary.available_balance) : 0.00;
  const unclearedBalance = summary?.uncleared_balance ? parseFloat(summary.uncleared_balance) : 0.00;
  const lifetimeEarnings = summary?.lifetime_earnings ? parseFloat(summary.lifetime_earnings) : 0.00;
  const pendingPayouts = summary?.pending_payouts ? parseFloat(summary.pending_payouts) : 0.00;
  const transactions = summary?.recent_activities || [];

  const getChartConfig = () => {
    switch (timeFilter) {
      case 'yearly': return { type: 'bar', color: '#6366f1' }; // indigo
      case 'monthly': return { type: 'line', color: '#10b981' }; // emerald
      case 'today': return { type: 'area', color: '#f59e0b' }; // amber
      default: return { type: 'bar', color: '#8b5cf6' }; // violet
    }
  }

  const { type, color } = getChartConfig();

  if (!summary && loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] transition-colors duration-300 ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
        <div className={`w-12 h-12 border-4 rounded-full animate-spin mb-4 ${isDarkMode ? 'border-slate-800 border-t-teal-400' : 'border-slate-200 border-t-teal-500'}`}></div>
        <p className={`text-[10px] font-semibold uppercase tracking-normal ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Checking your balance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 font-['Inter']">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-semibold tracking-normal flex items-center gap-4  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-400/20">
              <FaFileInvoiceDollar size={22} />
            </div>
            Earnings & Money
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 mt-3 ml-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Manage your store profit
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-6 md:px-8 py-4 text-white rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all shadow-xl ${isDarkMode ? 'bg-teal-500 hover:bg-teal-400 shadow-indigo-900/40' : 'bg-slate-900 hover:bg-indigo-700 shadow-slate-200'}`}>
            <FaWallet /> Withdraw Money
          </button>
          <button className={`p-4 border rounded-2xl transition-all shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-500 hover:text-teal-500 hover:bg-slate-50'}`}>
            <FaDownload />
          </button>
        </div>
      </header>

      {/* KPI BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className={`rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white relative overflow-hidden group border shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-teal-500 border-indigo-400/20 shadow-indigo-900/40' : 'bg-teal-400 border-indigo-400 shadow-indigo-100'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-white/60 font-semibold text-[9px] uppercase tracking-normal mb-2 ">Available Balance</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-normal ">₹{totalRevenue.toLocaleString()}</h2>
          <div className="mt-6 flex items-center gap-2 text-[10px] bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-slate-200">
            <FaArrowUp className="text-emerald-300" /> <span className="font-semibold">Ready to Withdraw</span>
          </div>
        </div>

        <div className={`rounded-[32px] md:rounded-[40px] p-6 md:p-8 border shadow-2xl relative overflow-hidden group transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100'}`}>
          <p className="text-gray-500 font-semibold text-[9px] uppercase tracking-normal mb-2 ">Total Earned</p>
          <h2 className={`text-3xl font-semibold tracking-normal  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{lifetimeEarnings.toLocaleString()}</h2>
          <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Lifetime Profit
          </p>
        </div>

        <div className={`rounded-[32px] md:rounded-[40px] p-6 md:p-8 border shadow-2xl relative overflow-hidden group transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100'}`}>
          <p className="text-gray-500 font-semibold text-[9px] uppercase tracking-normal mb-2 ">Pending Payout</p>
          <h2 className={`text-3xl font-semibold tracking-normal  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{pendingPayouts.toLocaleString()}</h2>
          <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></span> Processing
          </p>
        </div>

        <div className={`rounded-[32px] md:rounded-[40px] p-6 md:p-8 border shadow-2xl relative overflow-hidden group transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100'}`}>
          <p className="text-gray-500 font-semibold text-[9px] uppercase tracking-normal mb-2 ">Hold Items</p>
          <h2 className={`text-3xl font-semibold tracking-normal  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{unclearedBalance.toLocaleString()}</h2>
          <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest mt-2">7-Day Hold Period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* GRAPH */}
        <div className={`lg:col-span-2 rounded-[32px] md:rounded-[48px] border p-6 md:p-10 shadow-2xl relative overflow-hidden group transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10 gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-teal-400/10 text-indigo-400 border-teal-400/10' : 'bg-indigo-50 text-teal-500 border-indigo-100'}`}>
                  <FaChartPie size={18} />
                </div>
                <h3 className={`text-xl font-semibold tracking-normal  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Money Graph</h3>
              </div>
              <div className={`p-1.5 rounded-2xl border flex w-full sm:w-auto overflow-x-auto no-scrollbar transition-colors ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                {['today', 'weekly', 'monthly', 'yearly'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-xl text-[9px] font-semibold uppercase tracking-normal transition-all whitespace-nowrap ${timeFilter === filter ? (isDarkMode ? 'bg-teal-500 text-white shadow-lg' : 'bg-white text-teal-500 shadow-sm') : 'text-gray-500 hover:text-indigo-400'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[250px] md:h-[400px] w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                {type === 'bar' ? (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#4b5563' : '#94a3b8', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#4b5563' : '#94a3b8', fontSize: 10, fontWeight: 'bold' }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderRadius: '24px', border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }} itemStyle={{ color: isDarkMode ? '#fff' : '#1e293b', fontWeight: '900' }} labelStyle={{ color: '#6366f1', marginBottom: '8px', fontWeight: '900', textTransform: 'uppercase' }} />
                    <Bar dataKey="earnings" fill={color} radius={[8, 8, 0, 0]} barSize={24} />
                  </BarChart>
                ) : type === 'line' ? (
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#4b5563' : '#94a3b8', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#4b5563' : '#94a3b8', fontSize: 10, fontWeight: 'bold' }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderRadius: '24px', border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }} itemStyle={{ color: isDarkMode ? '#fff' : '#1e293b', fontWeight: '900' }} />
                    <Line type="monotone" dataKey="earnings" stroke={color} strokeWidth={4} dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  </LineChart>
                ) : (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#4b5563' : '#94a3b8', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#4b5563' : '#94a3b8', fontSize: 10, fontWeight: 'bold' }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderRadius: '24px', border: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }} itemStyle={{ color: isDarkMode ? '#fff' : '#1e293b', fontWeight: '900' }} />
                    <Area type="monotone" dataKey="earnings" stroke={color} strokeWidth={4} fillOpacity={1} fill="url(#colorEarnings)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ACTIVITY HISTORY */}
        <div className={`rounded-[32px] md:rounded-[48px] border p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-teal-400/10 text-indigo-400 border-teal-400/10' : 'bg-indigo-50 text-teal-500 border-indigo-100'}`}>
              <FaHistory size={18} />
            </div>
            <h3 className={`text-xl font-semibold tracking-normal  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h3>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {transactions.length > 0 ? transactions.map((item, i) => (
              <div key={item.id || i} className={`p-5 border-2 rounded-[28px] transition-all group flex items-center justify-between overflow-hidden ${isDarkMode ? 'bg-slate-900 border-transparent hover:bg-white/10 hover:border-teal-400/20' : 'bg-slate-50 border-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-sm'}`}>
                <div className="flex items-center gap-4 truncate">
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-sm shadow-inner ${item.entry_type === 'PAYOUT' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                    {item.entry_type === 'PAYOUT' ? <FaExchangeAlt /> : <FaArrowUp />}
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-semibold tracking-normal  truncate uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.description}</p>
                    <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-widest mt-1.5">{item.date}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className={`text-sm font-semibold  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{parseFloat(item.net_amount || item.amount).toLocaleString()}</p>
                  <span className={`text-[8px] font-semibold uppercase tracking-widest ${item.is_settled ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {item.is_settled ? 'Success' : 'Pending'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-20  text-gray-600 text-[10px] font-semibold uppercase tracking-widest">
                History is empty
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaClock, FaArrowUp, FaWallet, FaReceipt, FaCheck, FaTruck, FaMotorcycle } from 'react-icons/fa';
import { fetchEarningsSummary, fetchCommissionList, requestWithdrawal } from '../../api/delivery_axios';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

export default function EarningsPage() {
    const navigate = useNavigate();

    const [earnings, setEarnings] = useState(null);
    const [commissions, setCommissions] = useState([]);
    const [filter, setFilter] = useState('monthly');
    const [txLoading, setTxLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const { isDarkMode } = useTheme();

    const loadEarnings = useCallback(async () => {
        try {
            const data = await fetchEarningsSummary(filter);
            setEarnings(data);
        } catch (error) {
            console.error("Earnings load failed:", error);
            if (error.response?.status === 403) {
                const reason = error.response?.data?.error || "Your account access has been restricted.";
                toast.error(reason);
                localStorage.removeItem("accessToken");
                navigate('/delivery');
            } else {
                toast.error("Failed to load earnings");
            }
        }
    }, [filter, navigate]);

    const loadCommissions = async () => {
        try {
            setTxLoading(true);
            const data = await fetchCommissionList();
            setCommissions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Commission list load failed:", error);
        } finally {
            setTxLoading(false);
        }
    };

    useEffect(() => { loadEarnings(); }, [loadEarnings]);
    useEffect(() => { loadCommissions(); }, []);

    const handleWithdraw = async () => {
        if (!withdrawAmount || isNaN(withdrawAmount)) {
            toast.error("Please enter a valid amount");
            return;
        }
        try {
            await requestWithdrawal(withdrawAmount);
            toast.success("Withdrawal request submitted!");
            setWithdrawAmount('');
            loadEarnings();
        } catch (error) {
            toast.error(error.response?.data?.error || "Withdrawal failed");
        }
    };

    const totalEarned = parseFloat(earnings?.total || '0.00');
    const paidAmount = parseFloat(earnings?.paid || '0.00');
    const pendingAmount = parseFloat(earnings?.pending || '0.00');
    const approvedAmount = parseFloat(earnings?.approved || '0.00');

    return (
        <div className={`w-full min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            {/* Header */}
            <header className={`px-4 md:px-8 py-8 border-b backdrop-blur-xl sticky top-0 z-20 mb-8 md:mb-10 transition-all ${isDarkMode ? 'bg-[#0f172a]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-left w-full md:w-auto">
                        <h1 className={`text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-4  uppercase transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                                <FaMoneyBillWave size={20} />
                            </div>
                            My Earnings
                        </h1>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mt-2 ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Income & Payment Records
                        </p>
                    </div>
                    {/* Period Filter */}
                    <div className={`flex p-1.5 rounded-2xl border self-center gap-1 transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                        {['today', 'monthly', 'yearly'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 md:px-8 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 capitalize ${filter === f ? 'bg-orange-500 text-white shadow-lg scale-105' : isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">

                {/* Left Column: Payment Records Table */}
                <div className="lg:col-span-8 space-y-10">
                    <div className={`rounded-[40px] md:rounded-[48px] p-6 md:p-10 shadow-2xl border relative overflow-hidden group transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/305 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-12 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-orange-500/10 text-indigo-400 border-indigo-400/10' : 'bg-indigo-50 text-orange-500 border-indigo-100'}`}>
                                        <FaReceipt size={18} />
                                    </div>
                                    <h2 className={`text-xl md:text-2xl font-bold tracking-tight  transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment Records</h2>
                                </div>
                                <div className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${isDarkMode ? 'text-slate-500 bg-white/5 border-white/5' : 'text-slate-400 bg-slate-50 border-slate-200'}`}>
                                    {commissions.length} Entries
                                </div>
                            </div>

                            {txLoading ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                                    <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isDarkMode ? 'border-white/5 border-t-indigo-500' : 'border-slate-200 border-t-orange-500'}`}></div>
                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading records...</p>
                                </div>
                            ) : commissions.length === 0 ? (
                                <div className={`text-center py-24 rounded-[32px] border-2 border-dashed transition-all ${isDarkMode ? 'bg-[#0f172a]/50 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                                    <FaTruck className={`mx-auto mb-6 text-5xl transition-colors ${isDarkMode ? 'text-slate-800' : 'text-slate-200'}`} />
                                    <p className={`text-lg font-bold uppercase tracking-widest transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>No Records Yet</p>
                                    <p className="text-sm text-gray-500 mt-2 font-medium ">Complete deliveries to see your earnings here.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left min-w-[560px]">
                                        <thead className={`text-[9px] font-bold uppercase tracking-wider border-b transition-colors ${isDarkMode ? 'text-slate-600 border-white/5' : 'text-slate-400 border-slate-100'}`}>
                                            <tr>
                                                <th className="pb-6 px-4">Delivery</th>
                                                <th className="pb-6 px-4 text-right">Base Pay</th>
                                                <th className="pb-6 px-4 text-right">Bonus</th>
                                                <th className="pb-6 px-4 text-right">Total</th>
                                                <th className="pb-6 px-4 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y transition-colors ${isDarkMode ? 'divide-white/5' : 'divide-slate-50'}`}>
                                            {commissions.map((c, idx) => (
                                                <tr key={c.id || idx} className={`group transition-all duration-300 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                                    <td className="py-5 px-4 text-left">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 border-white/5 group-hover:bg-orange-500/10 group-hover:border-orange-500/20' : 'bg-slate-50 border-slate-100 group-hover:bg-white group-hover:border-indigo-200'}`}>
                                                                <FaMotorcycle className={`${isDarkMode ? 'text-indigo-400' : 'text-orange-500'} text-sm`} />
                                                            </div>
                                                            <div>
                                                                <p className={`font-bold text-sm tracking-tight  transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                                    {c.delivery_assignment?.order?.order_number || c.notes || `TRX-${c.id}`}
                                                                </p>
                                                                <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                    {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '––'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`py-5 px-4 text-right font-bold text-sm transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                        ₹{parseFloat(c.base_fee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="py-5 px-4 text-right font-bold text-indigo-400 text-sm">
                                                        +₹{parseFloat(c.distance_bonus || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="py-5 px-4 text-right">
                                                        <span className="font-bold text-lg text-emerald-400 tracking-tight ">
                                                            ₹{parseFloat(c.total_commission || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-4 text-center">
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border ${c.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            c.status === 'approved' ? 'bg-orange-500/10 text-indigo-400 border-orange-500/20' :
                                                                c.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                    isDarkMode ? 'bg-white/5 text-slate-500 border-white/5' : 'bg-slate-100 text-slate-400 border-slate-200'
                                                            }`}>
                                                            {c.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className={`border-t-2 transition-colors ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                                            <tr>
                                                <td className={`py-6 px-4 font-bold uppercase tracking-widest  text-[10px] text-left transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total</td>
                                                <td className={`py-6 px-4 text-right font-bold text-sm transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    ₹{commissions.reduce((s, c) => s + parseFloat(c.base_fee || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-6 px-4 text-right font-bold text-indigo-400 text-sm">
                                                    ₹{commissions.reduce((s, c) => s + parseFloat(c.distance_bonus || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-6 px-4 text-right">
                                                    <span className="font-bold text-2xl text-emerald-400 tracking-tight ">
                                                        ₹{commissions.reduce((s, c) => s + parseFloat(c.total_commission || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Wallet & Policy */}
                <div className="lg:col-span-4 space-y-8 md:space-y-10">
                    {/* Wallet Card */}
                    <div className={`rounded-[40px] md:rounded-[48px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl group transition-all ${isDarkMode ? 'bg-orange-500 shadow-indigo-900/40' : 'bg-slate-900 shadow-slate-200'}`}>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

                        <div className="relative z-10 text-left">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-inner">
                                    <FaWallet size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold tracking-tight  uppercase">My Wallet</h3>
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider mt-0.5 ">Available Balance</p>
                                </div>
                            </div>

                            <div className="space-y-1 mb-8">
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Total Earned</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-white/60 ">₹</span>
                                    <h2 className="text-5xl font-bold tracking-tight ">{totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm text-left">
                                    <p className="text-[9px] font-bold opacity-50 uppercase tracking-wider mb-1.5">Paid Out</p>
                                    <p className="text-lg font-bold text-emerald-300 ">₹{paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</p>
                                </div>
                                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm text-left">
                                    <p className="text-[9px] font-bold opacity-50 uppercase tracking-wider mb-1.5">On Hold</p>
                                    <p className="text-lg font-bold text-amber-300 ">₹{(pendingAmount + approvedAmount).toLocaleString('en-IN', { minimumFractionDigits: 0 })}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-white/40 text-lg ">₹</div>
                                    <input
                                        type="number"
                                        placeholder="Enter amount to withdraw"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-[20px] py-4 pl-10 pr-5 text-white font-bold text-lg outline-none focus:border-white/50 transition-all placeholder:text-white/20 shadow-inner appearance-none "
                                    />
                                </div>
                                <button
                                    onClick={handleWithdraw}
                                    className={`w-full flex items-center justify-center gap-4 py-5 rounded-[20px] font-bold uppercase tracking-wider text-[11px] transition-all shadow-2xl active:scale-95  ${isDarkMode ? 'bg-white text-indigo-700 hover:bg-slate-50' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
                                >
                                    <FaArrowUp />
                                    Withdraw Money
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Payment Policy */}
                    <div className={`rounded-[40px] md:rounded-[48px] p-8 md:p-10 border shadow-2xl relative overflow-hidden transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                <FaCheck size={16} />
                            </div>
                            <h3 className={`text-lg md:text-xl font-bold tracking-tight  uppercase text-left transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment Rules</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-5 text-left">
                                {[
                                    { label: 'Base Delivery Pay', desc: 'Fixed fee per completed delivery', color: 'bg-indigo-500' },
                                    { label: 'Distance Bonus', desc: 'Extra pay for longer deliveries', color: 'bg-emerald-500' },
                                    { label: 'Processing Time', desc: 'Maximum 48 hours for verification', color: 'bg-amber-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full ${item.color} flex-shrink-0`}></div>
                                        <div>
                                            <p className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.label}</p>
                                            <p className="text-[10px] text-gray-500 mt-1 font-medium ">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`pt-6 border-t space-y-4 text-left transition-colors ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                                <h4 className={`text-[9px] font-bold uppercase tracking-wider  transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Withdrawal Rules</h4>
                                <ul className="space-y-3">
                                    {[
                                        'Minimum withdrawal: ₹100',
                                        'TDS deduction: 1% on payouts',
                                        'Withdrawal available anytime',
                                    ].map((rule, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-gray-500 ">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

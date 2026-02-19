import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaBars, FaSignOutAlt, FaTachometerAlt, FaClipboardList, FaMoneyBillWave, FaClock, FaArrowUp, FaWallet, FaReceipt, FaCheck } from 'react-icons/fa';
import { fetchEarningsSummary, requestWithdrawal } from '../../api/delivery_axios';
import { toast } from 'react-hot-toast';

export default function EarningsPage() {
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem("accessToken");
        navigate('/delivery');
    };
    const [earnings, setEarnings] = useState(null);
    const [filter, setFilter] = useState('monthly');
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const loadEarnings = async () => {
        try {
            const data = await fetchEarningsSummary(filter);
            setEarnings(data);
        } catch (error) {
            toast.error("Failed to load earnings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEarnings();
    }, [filter]);

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

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, path: '/delivery/dashboard' },
        { id: 'assigned', label: 'Assigned Orders', icon: FaClipboardList, path: '/delivery/assigned' },
        { id: 'earnings', label: 'Earnings', icon: FaMoneyBillWave, path: '/delivery/earnings' },
    ];

    return (
        <div className="w-full p-8">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Earnings Terminal</h1>
                    <p className="text-gray-500 mt-1">Track your performance and payouts.</p>
                </div>
                <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                    {['today', 'monthly', 'yearly'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Earned', val: earnings?.sum_total || '0.00', icon: FaArrowUp, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { label: 'Base Fee', val: earnings?.base_earnings || '0.00', icon: FaMoneyBillWave, color: 'text-purple-500', bg: 'bg-purple-50' },
                            { label: 'Bonuses', val: earnings?.bonus_earnings || '0.00', icon: FaTachometerAlt, color: 'text-orange-500', bg: 'bg-orange-50' },
                            { label: 'Settled', val: earnings?.paid || '0.00', icon: FaCheck, color: 'text-green-500', bg: 'bg-green-50' },
                        ].map((item, i) => (
                            <div key={i} className={`${item.bg} rounded-[2rem] p-6 border border-white/50 shadow-sm hover:shadow-md transition-all`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-xl ${item.bg} brightness-95`}>
                                        <item.icon className={`w-4 h-4 ${item.color}`} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.label}</span>
                                </div>
                                <div className="text-2xl font-black text-gray-900">₹{item.val}</div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Transactions placeholder */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <h3 className="text-gray-900 font-bold mb-6 flex items-center gap-2">
                            <FaReceipt className="text-purple-600" /> Recent Payouts
                        </h3>
                        <div className="space-y-4">
                            <div className="text-center py-10 text-gray-400 italic">
                                Your payout history will appear here...
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Wallet Card */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <FaWallet className="text-purple-400 w-5 h-5" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-[3px] opacity-60">Revenue Wallet</span>
                            </div>

                            <div className="mb-10">
                                <span className="text-xs font-medium opacity-50 mb-1 block">Available for Payout</span>
                                <h2 className="text-5xl font-black tracking-tighter">₹{earnings?.total || '0.00'}</h2>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="number"
                                    placeholder="Enter amount ₹"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold placeholder:text-white/20 outline-none focus:border-purple-500 transition-all font-sans"
                                />
                                <button
                                    onClick={handleWithdraw}
                                    className="w-full py-5 bg-purple-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-purple-900/40 hover:bg-purple-500 hover:-translate-y-1 transition-all active:scale-95"
                                >
                                    Initiate Withdrawal
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Commission Guide */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4 text-sm">Payout Policy</h4>
                        <ul className="space-y-3 text-xs text-gray-500 font-medium">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                                Min. ₹100 required for withdrawal
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                                TDS of 1% applicable on earnings
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                                Settlements processed within 48h
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

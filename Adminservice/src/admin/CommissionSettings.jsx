import React, { useState, useEffect } from 'react';
import {
    Settings,
    Percent,
    Save,
    RefreshCcw,
    PanelLeftClose,
    PanelLeftOpen,
    Info,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';

const CommissionSettings = () => {
    const [commission, setCommission] = useState(10); // Default 10%
    const [inputValue, setInputValue] = useState(10);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Mock Fetching current settings
    useEffect(() => {
        setIsLoading(true);
        // Simulate API call to fetch current commission
        const _timer = setTimeout(() => {
            const mockCurrentCommission = 12.5; // Example fetched from DB
            setCommission(mockCurrentCommission);
            setInputValue(mockCurrentCommission);
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(_timer);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    const handleSave = async () => {
        // Validation
        const val = parseFloat(inputValue);
        if (isNaN(val) || val < 0 || val > 100) {
            setMessage({ type: 'error', text: 'Please enter a valid percentage between 0 and 100.' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        // Simulate API call to save settings
        setTimeout(() => {
            setCommission(val);
            setMessage({ type: 'success', text: 'Commission settings updated successfully across the platform.' });
            setIsLoading(false);

            // Auto hide message
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }, 1200);
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 overflow-hidden">
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Settings" onLogout={handleLogout} />

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
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Platform Configuration</h1>
                                <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-amber-100 tracking-widest leading-none">SuperAdmin Only</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium italic mt-0.5">Control global business rules and fee structures</p>
                        </div>
                    </div>
                    <NotificationBell />
                </header>

                <main className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
                    <AnimatePresence>
                        {message.text && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 ${message.type === 'success'
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                    : 'bg-rose-50 border-rose-100 text-rose-700'
                                    }`}
                            >
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <span className="text-sm font-bold">{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                    <Percent className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 leading-tight">Vendor Commission Rate</h2>
                                    <p className="text-xs text-slate-400 font-medium">Applied globally to all vendor transactions</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Configure Percentage</label>
                                    <div className="relative group max-w-xs">
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            step="0.1"
                                            placeholder="Enter percentage..."
                                            className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-2xl font-black text-slate-900"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">%</div>
                                    </div>
                                    <p className="mt-3 text-[11px] text-slate-500 font-medium flex items-center gap-2 italic">
                                        <Info className="w-3.5 h-3.5 text-indigo-500" /> Currently active rate is <span className="font-black text-slate-900 not-italic">{commission}%</span>
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="max-w-[18rem]">
                                        <h4 className="text-xs font-bold text-slate-900 mb-1">Deducted from Vendor Revenue</h4>
                                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">This percentage is automatically withheld by the platform during vendor settlement. Customers pay the original price.</p>
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isLoading ? (
                                            <RefreshCcw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        )}
                                        {isLoading ? 'Syncing...' : 'Update Settings'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex flex-col justify-between aspect-square">
                                <div className="p-3 bg-white/10 rounded-2xl w-fit">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Platform Impact</div>
                                    <div className="text-3xl font-black mb-2">{commission}%</div>
                                    <p className="text-[10px] text-white/70 font-medium leading-relaxed">Based on current settings, the platform retains ₹1 for every ₹10 sold by any vendor.</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Forecast</div>
                                </div>
                                <div className="text-2xl font-black text-slate-900">+4.2%</div>
                                <p className="text-[10px] text-slate-500 font-medium mt-1 italic">Projected earnings spike after rate adjustment</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                            <Settings className="w-4 h-4 text-indigo-500" /> Business Logic Overview
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-black shrink-0">1</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-1">Vendor Earnings Calculation</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Vendor Payout = Order Total - (Order Total * global_commission_rate). Settlement happens automatically.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-black shrink-0">2</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-1">Customer Price Stability</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">The commission rate does not add any surcharge to the customer's final price. It remains invisible to the shopper.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CommissionSettings;

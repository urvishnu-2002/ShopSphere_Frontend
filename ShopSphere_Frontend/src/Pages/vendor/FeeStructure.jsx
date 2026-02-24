import { useState, useEffect } from "react";
import { fetchCommissionInfo } from "../../api/vendor_axios";
import { FaPercent, FaListUl, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function FeeStructure() {
    const { isDarkMode } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchCommissionInfo();
                setData(result);
            } catch (err) {
                console.error("Failed to load fee info:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-teal-400 rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-semibold uppercase tracking-normal text-gray-500">Checking fee rates...</p>
            </div>
        );
    }

    const globalRate = data?.global_rate;
    const overrides = data?.category_overrides || [];

    return (
        <div className="space-y-8 md:space-y-12 font-['Inter']">
            <header>
                <h1 className={`text-3xl md:text-4xl font-semibold tracking-normal flex items-center gap-4  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-400/20">
                        <FaShieldAlt size={22} />
                    </div>
                    Selling Fees
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-normal text-gray-500 mt-3 ml-1 ">
                    Platform commission rates
                </p>
            </header>

            {/* Main Rate Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-teal-500 rounded-[32px] md:rounded-[56px] p-8 md:p-14 text-white shadow-2xl shadow-teal-400/20 relative overflow-hidden group border border-indigo-400/20"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 relative z-10">
                    <div className="space-y-4 md:space-y-6">
                        <span className="bg-white/10 px-6 py-2 rounded-full text-[10px] font-semibold uppercase tracking-normal backdrop-blur-md  inline-block border border-slate-200">
                            General Fee
                        </span>
                        <div>
                            <h2 className="text-6xl md:text-8xl font-semibold tracking-normal  mb-4">
                                {globalRate?.commission_type === 'percentage' ? `${globalRate.percentage}` :
                                    globalRate?.commission_type === 'fixed' ? `₹${globalRate.fixed_amount}` : '0'}<span className="text-2xl md:text-4xl">{globalRate?.commission_type === 'percentage' ? '%' : ''}</span>
                            </h2>
                            <p className="text-indigo-100 font-medium text-base md:text-lg leading-relaxed max-w-sm ">
                                Standard fee applied to most product deployments across the marketplace.
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-end">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-[32px] md:rounded-[48px] flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                            <FaPercent size={40} className="text-indigo-200" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Category Exceptions */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode ? 'bg-teal-400/10 text-indigo-400 border-teal-400/10' : 'bg-indigo-50 text-teal-500 border-indigo-100'}`}>
                        <FaListUl size={18} />
                    </div>
                    <h3 className={`text-xl font-semibold tracking-normal  uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Category Specific Fees</h3>
                </div>

                {overrides.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <AnimatePresence>
                            {overrides.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-8 rounded-[40px] border shadow-2xl transition-all group flex flex-col justify-between h-44 md:h-52 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-teal-400/30' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-teal-400/5'}`}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-400/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="min-w-0 pr-4">
                                            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest mb-1 ">Merchant Sector</p>
                                            <h4 className={`text-base md:text-lg font-semibold tracking-normal uppercase truncate  ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.category_display}</h4>
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl flex flex-shrink-0 items-center justify-center font-semibold transition-all border shadow-inner ${isDarkMode ? 'bg-slate-900 text-indigo-400 border-slate-800 group-hover:bg-teal-500 group-hover:text-white' : 'bg-slate-50 text-teal-500 border-slate-200 group-hover:bg-slate-900 group-hover:text-white'}`}>
                                            {item.category_display?.[0]}
                                        </div>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-3xl md:text-4xl font-semibold text-indigo-400 tracking-normal ">
                                            {item.commission_type === 'percentage' ? `${item.percentage}%` : `₹${item.fixed_amount}`}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className={`border-4 border-dashed rounded-[40px] p-16 md:p-24 text-center space-y-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto border ${isDarkMode ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-white text-slate-400 border-slate-100 shadow-sm'}`}>
                            <FaInfoCircle size={24} />
                        </div>
                        <p className={`text-[10px] font-semibold uppercase tracking-normal  ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>No category overrides found</p>
                    </div>
                )}
            </div>

            {/* Note Section */}
            <div className={`rounded-[40px] p-8 md:p-12 border relative overflow-hidden group ${isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-100 shadow-sm'}`}>
                <div className={`absolute top-0 left-0 w-2 h-full ${isDarkMode ? 'bg-amber-500/40' : 'bg-amber-500'}`}></div>
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start text-center md:text-left">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10 shadow-amber-500/10' : 'bg-white text-amber-600 border-amber-100 shadow-amber-500/5'}`}>
                        <FaInfoCircle size={24} />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-amber-500 uppercase tracking-normal ">Fee Logic Verification</h4>
                        <p className={`text-xs md:text-sm font-medium leading-relaxed max-w-2xl  ${isDarkMode ? 'text-amber-200/60' : 'text-amber-700/80'}`}>
                            Selling fees are automatically deducted at the point of customer acquisition. Net earnings represent the final settlement amount after all platform commissions have been processed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

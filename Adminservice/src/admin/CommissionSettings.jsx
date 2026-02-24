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
    TrendingUp,
    Trash2,
    Plus,
    Activity,
    Layers,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    fetchGlobalCommission,
    updateGlobalCommission,
    fetchCategoryCommissions,
    saveCategoryCommission,
    updateCategoryCommission,
    deleteCategoryCommission
} from '../api/axios';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import { useTheme } from '../context/ThemeContext';
import { logout } from '../api/axios';

const CATEGORIES = [
    { id: 'electronics', label: 'Electronics' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'home_kitchen', label: 'Home & Kitchen' },
    { id: 'beauty_personal_care', label: 'Beauty & Personal Care' },
    { id: 'sports_fitness', label: 'Sports & Fitness' },
    { id: 'toys_games', label: 'Toys & Games' },
    { id: 'automotive', label: 'Automotive' },
    { id: 'grocery', label: 'Grocery' },
    { id: 'books', label: 'Books' },
    { id: 'services', label: 'Services' },
    { id: 'other', label: 'Other' },
];

const CommissionSettings = () => {
    const { isDarkMode } = useTheme();
    const [commission, setCommission] = useState(10); // Default 10%
    const [inputValue, setInputValue] = useState(10);
    const [categoryCommissions, setCategoryCommissions] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form state for new category override
    const [newOverride, setNewOverride] = useState({ category: '', percentage: 10 });
    const [showAddForm, setShowAddForm] = useState(false);

    // Fetching current settings from Backend
    useEffect(() => {
        const loadSettings = async () => {
            setIsLoading(true);
            try {
                const [globalData, categoryData] = await Promise.all([
                    fetchGlobalCommission(),
                    fetchCategoryCommissions()
                ]);

                if (globalData && globalData.percentage !== undefined) {
                    setCommission(globalData.percentage);
                    setInputValue(globalData.percentage);
                }

                if (Array.isArray(categoryData)) {
                    setCategoryCommissions(categoryData);
                } else if (categoryData && Array.isArray(categoryData.results)) {
                    setCategoryCommissions(categoryData.results);
                }
            } catch (error) {
                console.error("Failed to fetch commission settings:", error);
                setMessage({ type: 'error', text: 'Failed to load current commission settings.' });
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        // Validation
        const val = parseFloat(inputValue);
        if (isNaN(val) || val < 0 || val > 100) {
            setMessage({ type: 'error', text: 'Please enter a valid percentage between 0 and 100.' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const data = await updateGlobalCommission({
                percentage: val,
                commission_type: 'percentage'
            });
            setCommission(data.percentage);
            setMessage({ type: 'success', text: 'Global commission settings updated successfully.' });

            // Auto hide message
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        } catch (error) {
            console.error("Failed to update commission settings:", error);
            setMessage({ type: 'error', text: 'Failed to update commission settings.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCategoryOverride = async () => {
        if (!newOverride.category) {
            setMessage({ type: 'error', text: 'Please select a category.' });
            return;
        }

        setIsCategoryLoading(true);
        try {
            const data = await saveCategoryCommission({
                category: newOverride.category,
                percentage: parseFloat(newOverride.percentage),
                commission_type: 'percentage'
            });
            setCategoryCommissions([...categoryCommissions, data]);
            setNewOverride({ category: '', percentage: 10 });
            setShowAddForm(false);
            setMessage({ type: 'success', text: `Commission override added successfully.` });
        } catch (error) {
            console.error("Failed to add category override:", error);
            const errorData = error.response?.data;
            let errorMsg = 'Failed to add category override.';
            if (errorData) {
                if (typeof errorData === 'object') {
                    errorMsg = Object.entries(errorData)
                        .map(([key, val]) => `${Array.isArray(val) ? val.join(', ') : val}`)
                        .join(' | ');
                }
            }
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsCategoryLoading(false);
        }
    };

    const handleDeleteCategoryOverride = async (id) => {
        if (!window.confirm('Are you sure you want to remove this category override?')) return;

        setIsCategoryLoading(true);
        try {
            await deleteCategoryCommission(id);
            setCategoryCommissions(categoryCommissions.filter(item => item.id !== id));
            setMessage({ type: 'success', text: 'Category override removed.' });
        } catch (error) {
            console.error("Failed to delete category override:", error);
            setMessage({ type: 'error', text: 'Failed to delete category override.' });
        } finally {
            setIsCategoryLoading(false);
        }
    };

    return (
        <div className={`flex h-screen font-sans selection:bg-blue-100 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} activePage="Settings" onLogout={logout} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className={`border-b px-8 h-20 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm'}`}>
                            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-lg font-semibold tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Commission Settings</h1>
                                <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-normal ${isDarkMode ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>Admin Only</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Set commission rates for all vendors on the platform</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className={`hidden lg:flex items-center border rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-normal gap-2 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            <Activity className="w-3.5 h-3.5" /> Live
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-5xl mx-auto space-y-8 pb-12">
                        <AnimatePresence>
                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`p-4 rounded-2xl border flex items-center gap-3 overflow-hidden ${message.type === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                        : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                        }`}
                                >
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <span className="text-xs font-semibold uppercase tracking-normal">{message.text}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className={`p-8 rounded-[2.5rem] border col-span-2 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800 shadow-2xl shadow-blue-500/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                        <Percent className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Global Commission Rate</h2>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal">Default rate applied to all vendor sales</p>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                                        <div className="flex-1 max-w-xs">
                                            <label className="block text-[9px] font-semibold text-slate-500 uppercase tracking-normal mb-3 pl-1">Commission Rate</label>
                                            <div className="relative group">
                                                <input
                                                    type="number"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    step="0.1"
                                                    className={`w-full pl-8 pr-14 py-6 rounded-[2rem] border transition-all text-4xl font-semibold ${isDarkMode
                                                        ? 'bg-slate-900 border-slate-800 text-white focus:border-blue-500'
                                                        : 'bg-slate-50 border-transparent text-slate-900 focus:bg-white focus:border-blue-600'
                                                        }`}
                                                />
                                                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-2xl">%</div>
                                            </div>
                                        </div>
                                        <div className={`p-6 rounded-[2rem] border-2 border-dashed transition-all hidden sm:block ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                                            <p className="text-[10px] uppercase font-semibold tracking-normal">Current Rate</p>
                                            <p className={`text-2xl font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{commission}%</p>
                                        </div>
                                    </div>

                                    <div className={`p-8 rounded-[2rem] border flex flex-col lg:flex-row lg:items-center justify-between gap-8 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                                        <div className="max-w-md">
                                            <h4 className={`text-xs font-semibold uppercase tracking-normal mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>How it works</h4>
                                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">This rate applies to all vendors by default. Changing it takes effect immediately for new orders. Category overrides below will take priority over this rate.</p>
                                        </div>
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-semibold uppercase tracking-normal hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3 whitespace-nowrap"
                                        >
                                            {isLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className={`p-8 rounded-[2.5rem] relative overflow-hidden transition-all duration-300 shadow-xl shadow-blue-600/20 aspect-square flex flex-col justify-between ${isDarkMode ? 'bg-blue-600/90' : 'bg-blue-600'}`}>
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <ShieldCheck className="w-32 h-32" />
                                    </div>
                                    <div className="p-4 bg-white/10 rounded-2xl w-fit backdrop-blur-md">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-semibold text-white/60 uppercase tracking-normal mb-1">Current Commission</p>
                                        <h3 className="text-5xl font-semibold text-white mb-2">{commission}%</h3>
                                        <p className="text-[11px] text-white/70 font-medium leading-relaxed">This commission applies to all vendor sales unless overridden by a category-specific rule below.</p>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal">Revenue Growth</p>
                                    </div>
                                    <div className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>+4.2%</div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-normal mt-1 opacity-60">Revenue Spike Projected</p>
                                </div>
                            </div>
                        </div>

                        {/* Overrides Table */}
                        <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <div className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/20">
                                <div>
                                    <h3 className={`text-lg font-semibold flex items-center gap-2 uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Layers className="w-5 h-5 text-blue-500" /> Category Overrides
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium mt-1">Set a different commission rate for specific product categories.</p>
                                </div>
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-semibold uppercase tracking-normal transition-all transition-all ${showAddForm
                                        ? (isDarkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600')
                                        : (isDarkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white')
                                        }`}
                                >
                                    {showAddForm ? 'Cancel' : '+ Add Override'}
                                </button>
                            </div>

                            <div className="p-10 space-y-6">
                                <AnimatePresence>
                                    {showAddForm && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className={`p-8 rounded-[2rem] border mb-8 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-blue-100 shadow-inner'}`}
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal pl-1">Category</label>
                                                    <select
                                                        value={newOverride.category}
                                                        onChange={(e) => setNewOverride({ ...newOverride, category: e.target.value })}
                                                        className={`w-full px-5 py-4 rounded-xl outline-none text-[11px] font-semibold uppercase tracking-normal transition-all appearance-none ${isDarkMode
                                                            ? 'bg-slate-800 border border-slate-700 text-white focus:border-blue-500'
                                                            : 'bg-white border border-slate-200 text-slate-700 focus:border-blue-600'
                                                            }`}
                                                    >
                                                        <option value="">Select Category...</option>
                                                        {CATEGORIES
                                                            .filter(cat => !categoryCommissions.some(item => item.category === cat.id))
                                                            .map(cat => (
                                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal pl-1">Commission Rate (%)</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={newOverride.percentage}
                                                            onChange={(e) => setNewOverride({ ...newOverride, percentage: e.target.value })}
                                                            className={`w-full pl-6 pr-10 py-4 rounded-xl outline-none text-sm font-semibold transition-all ${isDarkMode
                                                                ? 'bg-slate-800 border border-slate-700 text-white focus:border-blue-500'
                                                                : 'bg-white border border-slate-200 text-slate-900 focus:border-blue-600'
                                                                }`}
                                                        />
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">%</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleAddCategoryOverride}
                                                    disabled={isCategoryLoading}
                                                    className="w-full py-5 bg-slate-900 text-white rounded-xl text-[10px] font-semibold font-semibold uppercase tracking-normal hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                                                >
                                                    {isCategoryLoading ? 'Saving...' : 'Add Override'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categoryCommissions.length === 0 ? (
                                        <div className={`col-span-full py-20 text-center rounded-[2.5rem] border-2 border-dashed transition-all ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                            <Layers className={`w-12 h-12 mx-auto mb-6 opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                                            <p className={`text-sm font-semibold uppercase tracking-normal ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No category overrides added yet</p>
                                        </div>
                                    ) : (
                                        categoryCommissions.map((item) => (
                                            <div key={item.id} className={`p-6 rounded-3xl border flex items-center justify-between transition-all group ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-blue-500/50' : 'bg-slate-50 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-lg'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                                                        <Percent className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-xs font-semibold uppercase tracking-normal ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.category_display || item.category}</h4>
                                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-semibold uppercase tracking-normal mt-1 ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>Custom Rule</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.percentage}%</div>
                                                        <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-normal">Override Rate</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteCategoryOverride(item.id)}
                                                        disabled={isCategoryLoading}
                                                        className={`p-3 rounded-xl transition-all opacity-0 group-hover:opacity-100 ${isDarkMode ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm'}`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Protocol Docs */}
                        <div className={`p-10 rounded-[2.5rem] border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b]/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                            <h3 className={`text-xs font-semibold mb-8 flex items-center gap-2 uppercase tracking-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                <Info className="w-4 h-4 text-blue-500" /> How Commission Works
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {[
                                    { title: 'Priority Order', desc: 'Category-specific rates take priority over the global rate. If no category rate is set, the global commission applies.', id: 1 },
                                    { title: 'Saved at Order Time', desc: 'Commission rates are locked in when an order is placed. Changing the rate will not affect past orders.', id: 2 }
                                ].map((rule) => (
                                    <div key={rule.id} className="flex gap-6">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-semibold shrink-0 ${isDarkMode ? 'bg-slate-900 text-slate-500 border border-slate-800' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>{rule.id}</div>
                                        <div>
                                            <h4 className={`text-sm font-semibold uppercase tracking-normal mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{rule.title}</h4>
                                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{rule.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CommissionSettings;

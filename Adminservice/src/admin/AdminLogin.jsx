import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from "../api/axios";
import { ShieldCheck, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setError('');
        try {
            const data = await adminLogin(username, password);
            if (data.access) {
                localStorage.setItem("authToken", data.access);
                localStorage.setItem("accessToken", data.access);
            }
            if (data.refresh) {
                localStorage.setItem("refreshToken", data.refresh);
            }
            localStorage.setItem("adminAuthenticated", "true");
            localStorage.setItem("adminUsername", username);
            navigate("/dashboard");
        } catch (err) {
            console.error("Login Error:", err);
            const msg = err.response?.data?.message ||
                err.response?.data?.error ||
                "Login failed. Please check your credentials.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#0a0f1e] overflow-hidden">

            {/* Left Brand Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
                {/* Background gradient blobs */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#12183a] to-[#0a0f1e]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-500/8 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-0">
                    <img src="/s_logo.png" alt="ShopSphere" className="w-16 h-16 object-contain transition-transform duration-300 hover:scale-110" />
                    <div className="flex flex-col -ml-5">
                        <h1 className="text-2xl font-bold text-white tracking-wide leading-none">
                            hopSphere
                        </h1>
                        <p className="text-[9px] font-semibold uppercase tracking-normal text-slate-500 mt-0.5">Admin Console</p>
                    </div>
                </div>

                {/* Hero Text */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[9px] font-semibold uppercase tracking-normal text-emerald-400">Admin Access</span>
                        </div>
                        <h2 className="text-5xl xl:text-6xl font-semibold text-white tracking-normal leading-[0.9] mb-6">
                            Manage<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-400 to-emerald-500">Everything.</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                            Log in to manage vendors, orders, delivery agents, users, and all platform settings.
                        </p>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3">
                        {['Vendor Approvals', 'Order Management', 'Commission Settings', 'Delivery Fleet'].map((item) => (
                            <span
                                key={item}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-semibold uppercase tracking-normal text-slate-400 backdrop-blur-sm"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="relative z-10 grid grid-cols-3 gap-4">
                    {[
                        { label: 'Modules', value: '4' },
                        { label: 'Real-time', value: '24/7' },
                        { label: 'Uptime', value: '99.9%' },
                    ].map((s) => (
                        <div key={s.label} className="p-5 rounded-2xl bg-white/4 border border-white/8 backdrop-blur-sm">
                            <p className="text-2xl font-semibold text-white">{s.value}</p>
                            <p className="text-[9px] font-semibold uppercase tracking-normal text-slate-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                {/* Mobile bg */}
                <div className="absolute inset-0 bg-[#0d1321] lg:bg-[#0d1321]" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/6 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 w-full max-w-md">

                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-0 mb-10 justify-center">
                        <img src="/s_logo.png" alt="ShopSphere" className="w-14 h-14 object-contain" />
                        <h1 className="text-xl font-bold text-white tracking-wide -ml-4">
                            hopSphere
                        </h1>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-600/20 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                            <ShieldCheck className="text-blue-400" size={28} />
                        </div>
                        <h2 className="text-4xl font-semibold text-white tracking-normal mb-2">Admin Login</h2>
                        <p className="text-slate-400 font-medium">Sign in with your administrator credentials</p>
                        <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-full mt-4" />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-sm font-bold">{error}</p>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/8 border border-blue-500/15 mb-8">
                        <ShieldCheck size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-blue-300 text-xs font-bold leading-relaxed">
                            Only admin users with superuser or staff privileges can log in here.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-semibold uppercase tracking-normal text-slate-400 flex items-center gap-2 ml-1">
                                <User size={10} /> Username
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Enter your username"
                                    className="w-full py-4 px-5 bg-white/5 border border-white/8 rounded-2xl text-white placeholder-slate-600 text-sm font-medium outline-none transition-all focus:border-blue-500/50 focus:bg-white/8 focus:ring-2 focus:ring-blue-500/10 hover:border-white/15"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-semibold uppercase tracking-normal text-slate-400 flex items-center gap-2 ml-1">
                                <Lock size={10} /> Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    className="w-full py-4 px-5 bg-white/5 border border-white/8 rounded-2xl text-white placeholder-slate-600 text-sm font-medium outline-none transition-all focus:border-blue-500/50 focus:bg-white/8 focus:ring-2 focus:ring-blue-500/10 hover:border-white/15 pr-16"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full py-4 px-6 mt-2 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-semibold text-sm uppercase tracking-normal rounded-2xl shadow-2xl shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center gap-3"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                            <span className="relative">
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing In...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center space-y-2">
                        <p className="text-slate-600 text-xs font-bold uppercase tracking-normal">
                            ShopSphere Admin Console &copy; 2026
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
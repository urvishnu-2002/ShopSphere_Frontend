import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryRegister } from '../../api/delivery_axios';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Truck, Lock, Mail, Phone, Calendar, ArrowRight, UserPlus, LogIn, ShieldCheck, Globe, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DeliveryAgentLogin = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [forgotEmail, setForgotEmail] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
            const response = await axios.post(`${API_BASE_URL}/user_login`, {
                email: loginForm.email,
                password: loginForm.password
            });

            const data = response.data;

            if (data.role !== 'delivery') {
                toast.error("Account is not a delivery agent.");
                setIsLoading(false);
                return;
            }

            if (data.access) {
                localStorage.setItem("accessToken", data.access);
                localStorage.setItem("refreshToken", data.refresh);
                localStorage.setItem("user", JSON.stringify(data));
            }

            toast.success("Welcome back, Commander!");
            navigate('/delivery/dashboard');
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } catch (error) {
            console.error('Login error:', error);
            const status = error.response?.data?.status;
            const errorMessage = error.response?.data?.error || "Invalid credentials";

            if (status === 'pending_approval' || status === 'rejected' || status === 'blocked') {
                toast.error(errorMessage, {
                    duration: 6000,
                    icon: status === 'pending_approval' ? '⏳' : '🚫'
                });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setResetEmailSent(true);
        }, 1500);
    };

    const closeForgotModal = () => {
        setShowForgotPassword(false);
        setResetEmailSent(false);
        setForgotEmail('');
    };

    return (
        <div className={`min-h-screen w-full flex overflow-x-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            <div className="w-full flex flex-col lg:flex-row min-h-screen">

                {/* Visual Brand Section */}
                <div className={`w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen p-8 lg:p-20 flex flex-col justify-center items-center relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]' : 'bg-gradient-to-br from-orange-400 to-purple-500'}`}>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[150px] pointer-events-none animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-[120px] pointer-events-none animate-pulse"></div>

                    <div className="relative z-10 w-full max-w-lg">
                        <div className="flex items-center gap-0 mb-20 justify-center lg:justify-start group cursor-default">
                            <img src="/s_logo.png" alt="ShopSphere" className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110" />
                            <div className="flex flex-col -ml-5">
                                <h1 className="text-2xl font-bold text-white tracking-wide leading-none flex items-center">
                                    hopSphere
                                    <span className="ml-3 px-3 py-1 bg-orange-500 text-white text-[8px] font-bold uppercase tracking-widest rounded-lg">DELIVERY</span>
                                </h1>
                                <p className="text-indigo-300 text-[9px] font-bold uppercase tracking-wider mt-1">Delivery Portal</p>
                            </div>
                        </div>

                        <div className="text-center lg:text-left">
                            <h2 className="text-6xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-[0.8]  uppercase">
                                MOVE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-400 to-purple-400">FASTER.</span>
                            </h2>
                            <p className="text-indigo-200/60 text-lg leading-relaxed mb-12 max-w-sm mx-auto lg:mx-0 font-medium">
                                Deliver faster, smarter, and get paid. Log in to your delivery dashboard.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:gap-6 mt-12">
                            <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl group hover:border-orange-500/50 transition-all cursor-default">
                                <Zap className="text-orange-400 mb-4" size={24} />
                                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">Response Time</p>
                                <p className="text-2xl font-bold text-white">4.2min</p>
                                <p className="text-[8px] text-orange-400 font-bold mt-1 uppercase">Instant Dispatch</p>
                            </div>
                            <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl group hover:border-orange-500/50 transition-all cursor-default">
                                <Globe className="text-orange-400 mb-4" size={24} />
                                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1">Global Reach</p>
                                <p className="text-2xl font-bold text-white">128+</p>
                                <p className="text-[8px] text-orange-400 font-bold mt-1 uppercase">Active Hubs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Form Section */}
                <div className={`w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center items-center relative transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
                    <div className="w-full max-w-lg scroll-mt-20">
                        <div className="mb-12 text-center lg:text-left">
                            <h2 className={`text-4xl lg:text-5xl font-bold tracking-tight mb-3  uppercase transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Authenticate
                            </h2>
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <div className="h-1.5 w-12 bg-orange-500 rounded-full"></div>
                                <p className={`font-bold uppercase tracking-wider text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Delivery Agent Login</p>
                            </div>
                        </div>

                        {/* Tab Switcher */}
                        <div className={`flex p-2 rounded-[32px] mb-10 border transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200 shadow-inner'}`}>
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[26px] text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'login'
                                    ? 'bg-orange-500 text-white shadow-xl shadow-indigo-900/40 scale-[1.02]'
                                    : isDarkMode ? 'bg-transparent text-slate-500 hover:text-white' : 'bg-transparent text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                <LogIn size={14} /> Login
                            </button>
                            <button
                                onClick={() => setActiveTab('signup')}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[26px] text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'signup'
                                    ? 'bg-orange-500 text-white shadow-xl shadow-indigo-900/40 scale-[1.02]'
                                    : isDarkMode ? 'bg-transparent text-slate-500 hover:text-white' : 'bg-transparent text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                <UserPlus size={14} /> Register
                            </button>
                        </div>

                        <div className="transition-all duration-500">
                            {activeTab === 'login' ? (
                                <form className="space-y-6 animate-fadeInUp" onSubmit={handleLoginSubmit}>
                                    <div className="space-y-3">
                                        <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            <Mail size={10} /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            className={`w-full py-5 px-8 border-2 rounded-[24px] font-bold outline-none transition-all placeholder:text-slate-300  shadow-sm hover:border-orange-500/30 focus:border-orange-500 ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-100 text-slate-900 focus:bg-white'}`}
                                            value={loginForm.email}
                                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className={`text-[9px] font-bold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                <Lock size={10} /> Password
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotPassword(true)}
                                                className="text-[9px] font-bold uppercase tracking-wider text-orange-500 hover:text-orange-600 transition-colors bg-transparent border-none cursor-pointer"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className={`w-full py-5 px-8 border-2 rounded-[24px] font-bold outline-none transition-all placeholder:text-slate-300  shadow-sm hover:border-orange-500/30 focus:border-orange-500 ${isDarkMode ? 'bg-white/5 border-white/5 text-white focus:bg-white/10' : 'bg-slate-50 border-slate-100 text-slate-900 focus:bg-white'}`}
                                                value={loginForm.password}
                                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className={`absolute right-5 top-1/2 -translate-y-1/2 h-9 px-4 rounded-xl text-[8px] font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/10 text-white hover:bg-white hover:text-slate-900 shadow-lg shadow-white/5' : 'bg-slate-900 text-white hover:bg-slate-700'}`}
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-6 rounded-[28px] bg-orange-500 hover:bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wider transition-all duration-500 shadow-2xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center gap-4 "
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                Decrypting...
                                            </>
                                        ) : (
                                            <>
                                                Log In <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-10 py-10 text-center animate-fadeInUp">
                                    <div className="relative mx-auto">
                                        <div className="w-24 h-24 bg-orange-500/10 rounded-[40px] flex items-center justify-center mx-auto text-4xl shadow-2xl shadow-indigo-900/10 mb-8 border border-orange-500/20">
                                            <Truck className="text-orange-500" size={40} />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white scale-0 animate-popIn">
                                            <ShieldCheck size={14} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className={`text-4xl font-bold tracking-tight  transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Become an Agent</h3>
                                        <p className={`font-bold uppercase tracking-widest text-[9px] max-w-xs mx-auto leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            Apply to become a delivery agent. Complete the registration and get approved.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate("/delivery/account-verification")}
                                        className="w-full py-6 bg-slate-900 text-white rounded-[28px] text-[11px] font-bold uppercase tracking-wider shadow-2xl hover:bg-orange-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Get Started
                                    </button>
                                    <div className="flex items-center justify-center gap-6 pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className={`text-[8px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>OTP Secure</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                            <span className={`text-[8px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>KYC Ready</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-20 text-center">
                            <p className="text-[10px] font-bold flex items-center justify-center gap-4 transition-colors">
                                <span className={isDarkMode ? 'text-slate-700' : 'text-slate-300'}>© 2026 ShopSphere</span>
                                <span className={isDarkMode ? 'text-slate-700' : 'text-slate-300'}>•</span>
                                <span className={isDarkMode ? 'text-slate-700' : 'text-slate-300'}>Delivery Portal</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className={`fixed inset-0 backdrop-blur-2xl flex items-center justify-center z-[100] p-6 transition-all ${isDarkMode ? 'bg-[#0f172a]/95' : 'bg-slate-900/60'}`} onClick={closeForgotModal}>
                    <div className={`rounded-[56px] p-12 md:p-16 max-w-lg w-full relative shadow-3xl animate-scaleIn text-center overflow-hidden border transition-all ${isDarkMode ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                        <button className="absolute top-10 right-10 text-[9px] font-bold tracking-widest text-slate-400 hover:text-orange-500 transition-colors bg-transparent border-none cursor-pointer uppercase " onClick={closeForgotModal}>Abort</button>

                        {!resetEmailSent ? (
                            <div className="space-y-10">
                                <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center mx-auto text-4xl shadow-inner border transition-all ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                    <Lock className="text-orange-500" size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className={`text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Forgot Password?</h3>
                                    <p className={`font-bold uppercase tracking-widest text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Enter your email to reset your password</p>
                                </div>
                                <form className="space-y-6" onSubmit={handleForgotPassword}>
                                    <input
                                        type="email"
                                        placeholder="agent@shopsphere.hq"
                                        className={`w-full py-6 px-10 border-2 rounded-[28px] font-bold text-center outline-none transition-all text-sm  ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-orange-500'}`}
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-bold uppercase tracking-wider shadow-2xl hover:bg-orange-500 transition-all border-none cursor-pointer shadow-indigo-900/10">Send Reset Link</button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-10 py-10">
                                <div className="w-28 h-28 bg-emerald-500/10 rounded-[48px] flex items-center justify-center mx-auto text-5xl shadow-2xl shadow-emerald-900/10 border border-emerald-500/20">
                                    <Mail className="text-emerald-500" size={48} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className={`text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Email Sent!</h3>
                                    <p className="text-emerald-500 font-bold tracking-tight text-xl ">{forgotEmail}</p>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Check your email for a reset link.</p>
                                </div>
                                <button className={`w-full py-6 rounded-[28px] font-bold uppercase tracking-wider border-none cursor-pointer shadow-xl transition-all  ${isDarkMode ? 'bg-white text-[#0f172a] hover:bg-orange-500 hover:text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`} onClick={closeForgotModal}>Close Link</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes popIn {
                    from { transform: scale(0); }
                    to { transform: scale(1); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-popIn {
                    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards;
                }
            `}</style>
        </div>
    );
};

export default DeliveryAgentLogin;

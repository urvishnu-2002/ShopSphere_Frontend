import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryAgentLogin = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    console.log("DeliveryAgentLogin rendering...");
    const [activeTab, setActiveTab] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [signupForm, setSignupForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        vehicleType: '',
        licenseNumber: '',
        agreeTerms: false
    });

    const [forgotEmail, setForgotEmail] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log('Login submitted:', loginForm);
            navigate('/delivery/dashboard');
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        }, 1500);
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        if (signupForm.password !== signupForm.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log('Signup submitted:', signupForm);
        }, 1500);
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
        <div className="min-h-screen w-full flex font-sans overflow-x-hidden m-0 p-0 bg-white">

            
            <div className="w-full flex flex-col lg:flex-row min-h-screen">

                <div className="w-full lg:w-1/2 bg-purple-700 min-h-[50vh] lg:min-h-screen p-8 lg:p-20 flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-[80px] pointer-events-none"></div>

                    <div className="relative z-10 w-full max-w-lg">
                        <div className="flex items-center gap-6 mb-12 justify-center lg:justify-start">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                                <svg className="w-10 h-10 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-[6px] uppercase">ShopSphere</h1>
                        </div>

                        <div className="text-center lg:text-left transition-all duration-500">
                            <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                                Elevate Your <br />
                                <span className="text-purple-200">Operations.</span>
                            </h2>
                            <p className="text-purple-50 text-xl leading-relaxed mb-12 max-w-md mx-auto lg:mx-0 font-medium opacity-80">
                                The premier logistics portal tailored for modern delivery experts. Track, earn, and excel with every delivery.
                            </p>
                        </div>

                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                            <div className="flex flex-col items-center lg:items-start group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                <div className="text-3xl mb-3">⚡</div>
                                <span className="text-white font-bold tracking-[3px] uppercase text-[10px]">Real-time Stats</span>
                            </div>
                            <div className="flex flex-col items-center lg:items-start group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                <div className="text-3xl mb-3">💎</div>
                                <span className="text-white font-bold tracking-[3px] uppercase text-[10px]">Premium Perks</span>
                            </div>
                        </div> */}
                    </div>
                </div>

                <div className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center items-center bg-white min-h-[50vh] lg:min-h-screen">
                    <div className="w-full max-w-md animate-fadeIn">

                        <div className="mb-12 text-center lg:text-left">
                            <h2 className="text-4xl lg:text-5xl font-black text-purple-900 tracking-tighter mb-4">Partner Portal</h2>
                            <p className="text-black font-extrabold uppercase tracking-[6px] text-[10px] opacity-80">Secure Access Point</p>
                        </div>

                        <div className="flex bg-purple-50/50 rounded-[32px] p-2 mb-12 border border-purple-100 shadow-sm">
                            <button
                                className={`flex-1 py-4.5 rounded-[26px] text-[11px] font-black uppercase tracking-[2px] transition-all duration-300 ${activeTab === 'login'
                                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-200'
                                    : 'bg-transparent text-purple-600/40 hover:text-purple-600'
                                    }`}
                                onClick={() => setActiveTab('login')}
                            >
                                Sign In
                            </button>
                            <button
                                className={`flex-1 py-4.5 rounded-[26px] text-[11px] font-black uppercase tracking-[2px] transition-all duration-300 ${activeTab === 'signup'
                                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-200'
                                    : 'bg-transparent text-purple-600/40 hover:text-purple-600'
                                    }`}
                                onClick={() => setActiveTab('signup')}
                            >
                                Sign Up
                            </button>
                        </div>

                      
                        <div className="space-y-6">
                            {activeTab === 'login' ? (
                                <form className="space-y-6" onSubmit={handleLoginSubmit}>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[2px] text-black ml-1">Email Identifier</label>
                                        <input
                                            type="email"
                                            placeholder="partner@shopsphere.com"
                                            className="w-full py-5 px-7 border-2 border-purple-50 rounded-3xl bg-purple-50/30 text-purple-900 font-bold outline-none transition-all focus:border-purple-600 focus:bg-white placeholder:text-purple-200 shadow-sm"
                                            value={loginForm.email}
                                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[2px] text-black ml-1">Secret Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="w-full py-5 px-7 border-2 border-purple-50 rounded-3xl bg-purple-50/30 text-purple-900 font-bold outline-none transition-all focus:border-purple-600 focus:bg-white placeholder:text-purple-200 shadow-sm"
                                                value={loginForm.password}
                                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 px-5 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-purple-100 transition-all border-none cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? 'HIDE' : 'SHOW'}
                                            </button>
                                        </div>
                                    </div>

                                    
                                    <div className="flex justify-end pr-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-[10px] font-black uppercase tracking-widest text-purple-600 hover:text-purple-800 transition-colors bg-transparent border-none cursor-pointer"
                                        >
                                            Recovery Options?
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-5.5 border-none rounded-3xl bg-purple-600 text-white text-sm font-black uppercase tracking-[4px] cursor-pointer transition-all duration-300 shadow-2xl shadow-purple-200 hover:bg-purple-700 hover:-translate-y-1 active:scale-[0.98] mt-4"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "AUTHENTICATING..." : "SIGN IN NOW"}
                                    </button>
                                </form>
                            ) : (
                                <form className="space-y-4" onSubmit={handleSignupSubmit}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            className="w-full py-4.5 px-6 border-2 border-purple-50 rounded-2xl bg-purple-50/30 text-purple-900 font-bold outline-none focus:border-purple-600"
                                            value={signupForm.fullName}
                                            onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Mobile"
                                            className="w-full py-4.5 px-6 border-2 border-purple-50 rounded-2xl bg-purple-50/30 text-purple-900 font-bold outline-none focus:border-purple-600"
                                            value={signupForm.phone}
                                            onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <select
                                        className="w-full py-4.5 px-6 border-2 border-purple-50 rounded-2xl bg-purple-50/30 text-purple-900 font-bold outline-none focus:border-purple-600 appearance-none cursor-pointer"
                                        value={signupForm.vehicleType}
                                        onChange={(e) => setSignupForm({ ...signupForm, vehicleType: e.target.value })}
                                        required
                                    >
                                        <option value="">Choose Vehicle</option>
                                        <option value="bike">Bicycle</option>
                                        <option value="scooter">Motorcycle</option>
                                        <option value="car">Car / Van</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="License Number"
                                        className="w-full py-4.5 px-6 border-2 border-purple-50 rounded-2xl bg-purple-50/30 text-purple-900 font-bold outline-none focus:border-purple-600"
                                        value={signupForm.licenseNumber}
                                        onChange={(e) => setSignupForm({ ...signupForm, licenseNumber: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Create Password"
                                        className="w-full py-4.5 px-6 border-2 border-purple-50 rounded-2xl bg-purple-50/30 text-purple-900 font-bold outline-none focus:border-purple-600"
                                        value={signupForm.password}
                                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-5.5 bg-purple-600 text-white text-[11px] font-black uppercase tracking-[3px] rounded-3xl transition-all hover:bg-purple-700 shadow-xl mt-4"
                                    >
                                        CREATE ACCOUNT
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="mt-16">
                            <div className="flex items-center gap-6 mb-8 text-[#00000033]">
                                <div className="flex-1 h-px bg-purple-100"></div>
                                <span className="text-[10px] font-black uppercase tracking-[5px]">Connect with</span>
                                <div className="flex-1 h-px bg-purple-100"></div>
                            </div>
                            <div className="flex gap-5">
                                <button className="flex-1 py-5 bg-white border-2 border-purple-50 text-purple-600 rounded-3xl flex items-center justify-center hover:bg-purple-50 transition-all shadow-sm cursor-pointer">
                                    <svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                </button>
                                <button className="flex-1 py-5 bg-white border-2 border-purple-50 text-purple-600 rounded-3xl flex items-center justify-center hover:bg-purple-50 transition-all shadow-sm cursor-pointer">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showForgotPassword && (
                <div className="fixed inset-0 bg-purple-950/90 flex items-center justify-center z-[100] backdrop-blur-xl p-6" onClick={closeForgotModal}>
                    <div className="bg-white rounded-[48px] p-12 md:p-16 max-w-md w-full relative shadow-3xl animate-fadeIn text-center" onClick={(e) => e.stopPropagation()}>

                        <button className="absolute top-10 right-10 text-[10px] font-black tracking-widest text-purple-200 hover:text-purple-600 transition-colors bg-transparent border-none cursor-pointer" onClick={closeForgotModal}>CLOSE</button>

                        {!resetEmailSent ? (
                            <div className="space-y-8">
                                <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto text-4xl">🔐</div>
                                <h3 className="text-3xl font-black text-purple-900">Security Reset</h3>
                                <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Guidelines will be sent via email.</p>
                                <form className="space-y-6" onSubmit={handleForgotPassword}>
                                    <input
                                        type="email"
                                        placeholder="Enter partner email"
                                        className="w-full py-5 px-8 border-2 border-purple-50 rounded-3xl bg-purple-50/50 text-purple-900 font-bold text-center outline-none focus:border-purple-600 transition-all font-sans"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="w-full py-5 bg-purple-600 text-white rounded-3xl font-black uppercase tracking-[3px] shadow-2xl hover:bg-purple-700 transition-all border-none cursor-pointer">Reset Now</button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-8 py-6">
                                <div className="w-24 h-24 bg-purple-50 rounded-[40px] flex items-center justify-center mx-auto text-5xl">📨</div>
                                <h3 className="text-3xl font-black text-purple-900">Link Sent</h3>
                                <p className="text-purple-600 font-bold tracking-tight text-lg">{forgotEmail}</p>
                                <button className="w-full py-5 bg-purple-600 text-white rounded-3xl font-black uppercase tracking-[3px] border-none cursor-pointer shadow-xl" onClick={closeForgotModal}>Done</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237c3aed'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1.5rem center;
                    background-size: 1.1rem;
                }
                ::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default DeliveryAgentLogin;

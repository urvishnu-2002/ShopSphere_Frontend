import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    KeyRound,
    ArrowRight,
    RefreshCcw,
    Lock,
    ShieldCheck,
    Timer
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

export default function DeliveryVerifyOTP() {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(300); // 5 mins
    const email = localStorage.getItem("delivery_verify_email");

    useEffect(() => {
        if (!email) {
            navigate("/delivery/account-verification");
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [email, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleVerify = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join("");
        const storedOtp = localStorage.getItem("delivery_email_otp");
        const expiry = localStorage.getItem("delivery_email_otp_expiry");

        if (Date.now() > parseInt(expiry)) {
            toast.error("Security Protocol Expired. Re-generate code.");
            return;
        }

        if (enteredOtp === storedOtp) {
            toast.success("Identity Verified. Proceeding to Dossier.", {
                icon: '🔑',
                style: {
                    borderRadius: '16px',
                    background: isDarkMode ? '#1e293b' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#1e293b',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    fontWeight: '900',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }
            });
            navigate("/delivery/identity");
        } else {
            toast.error("Invalid Authentication Code. Trace Logged.");
        }
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            {/* Background Aesthetics */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full translate-x-1/2 -translate-y-1/2 blur-[150px] pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'bg-orange-500/10 opacity-100' : 'bg-orange-500/5 opacity-50'}`}></div>
            <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full -translate-x-1/2 translate-y-1/2 blur-[120px] pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'bg-orange-500/10 opacity-100' : 'bg-orange-500/5 opacity-50'}`}></div>

            <div className="w-full max-w-lg relative z-10 animate-fadeInUp">
                <div className="mb-12 text-center">
                    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl mb-8 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <ShieldCheck className="text-orange-500" size={18} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Security Checkpoint</span>
                    </div>
                    <h1 className={`text-5xl lg:text-6xl font-bold tracking-tight  uppercase mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Final <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-purple-500">Access.</span>
                    </h1>
                    <p className={`font-bold text-[11px] uppercase tracking-wider  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Code transmitted to <span className={`text-orange-500 decoration-orange-500/30 underline underline-offset-4`}>{email}</span></p>
                </div>

                <div className={`backdrop-blur-3xl rounded-[48px] p-10 md:p-14 shadow-2xl relative overflow-hidden border transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-slate-200'}`}>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-purple-600"></div>

                    <form onSubmit={handleVerify} className="space-y-12">
                        <div className="flex justify-between gap-2 md:gap-4">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onFocus={(e) => e.target.select()}
                                    className={`w-12 h-16 md:w-16 md:h-20 text-center text-4xl font-bold rounded-2xl border-2 outline-none transition-all shadow-inner  ${isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-orange-400 focus:bg-black/40' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-orange-500 focus:bg-white'}`}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col items-center gap-6">
                            <div className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                                <Timer className={`transition-all ${timer < 60 ? "text-rose-500 animate-pulse" : isDarkMode ? "text-slate-600" : "text-slate-400"}`} size={16} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${timer < 60 ? "text-rose-500" : isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                    Pulse Expiry: <span className={isDarkMode ? "text-white" : "text-slate-900"}>{formatTime(timer)}</span>
                                </span>
                            </div>

                            {timer === 0 && (
                                <button
                                    type="button"
                                    onClick={() => navigate("/delivery/account-verification")}
                                    className="text-[10px] font-bold uppercase tracking-wider text-orange-400 hover:text-orange-500 transition-all border-b-2 border-orange-400/20 hover:border-orange-500 pb-1 "
                                >
                                    Re-generate Signal
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-6 rounded-[32px] text-[11px] font-bold uppercase tracking-wider shadow-2xl transition-all flex items-center justify-center gap-4 group  border-none cursor-pointer ${isDarkMode ? 'bg-white text-[#0f172a] hover:bg-orange-400 hover:text-white shadow-white/5' : 'bg-slate-900 text-white hover:bg-orange-500 shadow-slate-900/10'}`}
                        >
                            Confirm Access <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                        </button>
                    </form>
                </div>

                <div className="mt-16 text-center">
                    <p className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>
                        Secured by ShopSphere Logistics Command
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}

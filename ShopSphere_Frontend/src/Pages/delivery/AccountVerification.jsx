import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
    Mail,
    ArrowRight,
    ShieldCheck,
    Globe,
    Truck,
    CheckCircle2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { validateEmail } from "../../utils/validators";
import { checkEmailStatus } from "../../api/delivery_axios";

export default function DeliveryAccountVerification() {
    const navigate = useNavigate();
    const { isDarkMode = false } = useTheme();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async (e) => {
        e.preventDefault();
        const emailErr = validateEmail(email.trim());
        if (emailErr) {
            toast.error(emailErr);
            return;
        }

        setLoading(true);

        try {
            // Check if email already exists
            const emailCheck = await checkEmailStatus(email.trim());
            if (emailCheck.exists) {
                toast.error(emailCheck.error || "This email is already registered.");
                setLoading(false);
                return;
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            await emailjs.send(
                "service_0a1vbhw",
                "template_30pivyj",
                {
                    to_email: email,
                    otp: otp,
                    name: "ShopSphere Logistics",
                    time: new Date().toLocaleString(),
                },
                "Ch-Wgw8L8R5zWGNme"
            );

            localStorage.setItem("delivery_verify_email", email);
            localStorage.setItem("delivery_email_otp", otp);
            localStorage.setItem("delivery_email_otp_expiry", Date.now() + 5 * 60 * 1000);

            toast.success("Verification signal transmitted!", {
                icon: '🚀',
                style: {
                    borderRadius: '16px',
                    background: isDarkMode ? '#1e293b' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#1e293b',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    fontWeight: '900',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }
            });
            navigate("/delivery/verify-otp");
        } catch (err) {
            console.error(err);
            toast.error("Failed to send verification code. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
            {/* Background Aesthetics */}
            <div className={`absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full translate-x-1/2 translate-y-1/2 blur-[150px] pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'bg-orange-500/10 opacity-100' : 'bg-orange-500/5 opacity-50'}`}></div>
            <div className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full -translate-x-1/2 -translate-y-1/2 blur-[120px] pointer-events-none transition-opacity duration-1000 ${isDarkMode ? 'bg-orange-500/10 opacity-100' : 'bg-orange-500/5 opacity-50'}`}></div>

            <div className="w-full max-w-lg relative z-10 animate-fadeInUp">
                {/* Protocol Header */}
                <div className="mb-12 text-center">
                    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl mb-8 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                        <Truck className="text-orange-500" size={18} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Agent Onboarding Portal</span>
                    </div>
                    <h1 className={`text-5xl lg:text-6xl font-bold tracking-tight  uppercase mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Identity <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-indigo-400 to-purple-500">Validation.</span>
                    </h1>
                    <p className={`font-bold text-[11px] uppercase tracking-wider  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Secure verify your logistics endpoint.</p>
                </div>

                {/* Form Card */}
                <div className={`backdrop-blur-3xl rounded-[48px] p-10 md:p-14 shadow-2xl relative overflow-hidden border transition-all duration-500 hover:shadow-orange-500/5 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-slate-200'}`}>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-purple-600"></div>

                    <form onSubmit={sendOtp} className="space-y-10">
                        <div className="space-y-4">
                            <label className={`text-[9px] font-bold uppercase tracking-wider ml-1 flex items-center gap-2  transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <Mail size={10} /> Transmission Endpoint
                            </label>
                            <div className="relative group">
                                <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDarkMode ? 'text-slate-700 group-focus-within:text-orange-400' : 'text-slate-300 group-focus-within:text-orange-500'}`} size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="agent@shopsphere.node"
                                    className={`w-full pl-16 pr-8 py-6 rounded-[28px] border-2 font-bold  outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#020617] border-transparent focus:border-orange-500 text-white focus:bg-black/40 placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 focus:border-orange-400 text-slate-900 focus:bg-white placeholder:text-slate-400'}`}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-6 rounded-[32px] text-white text-[11px] font-bold uppercase tracking-wider shadow-2xl transition-all flex items-center justify-center gap-4 group  ${loading ? 'opacity-70 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98] shadow-orange-500/30'}`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Transmitting Pulse...
                                </>
                            ) : (
                                <>
                                    Send Verification <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Bottom Protocol Info */}
                <div className="mt-16 grid grid-cols-2 gap-8 px-6">
                    <div className="flex items-center gap-4 transition-all hover:translate-y-[-2px] group">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30' : 'bg-white border-slate-100 shadow-sm group-hover:bg-emerald-50 group-hover:border-emerald-200'}`}>
                            <ShieldCheck className="text-emerald-500" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-[8px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>L_04 Security</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Encrypted</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-right justify-end transition-all hover:translate-y-[-2px] group">
                        <div className="flex flex-col">
                            <span className={`text-[8px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>Network Sync</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Enabled</span>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/30' : 'bg-white border-slate-100 shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-200'}`}>
                            <Globe className="text-orange-500" size={20} />
                        </div>
                    </div>
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

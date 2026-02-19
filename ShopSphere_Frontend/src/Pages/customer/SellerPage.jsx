import React from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Box,
    BarChart3,
    Wallet,
    ArrowRight,
    CheckCircle2,
    Zap,
    Globe,
    ShieldCheck,
    Smartphone,
    Truck,
    TrendingUp,
    Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Shared Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

// --- Reusable Components ---

/**
 * StepCard Component
 * Represents a single step in the "How it works" section
 */
const StepCard = ({ step, title, description, icon: Icon }) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ y: -8, scale: 1.02 }}
        className="relative group bg-white p-8 rounded-[40px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
    >
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-50/50 to-purple-50/50 rounded-bl-[100px] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />

        <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-violet-200 group-hover:rotate-6 transition-transform duration-300">
                <Icon size={32} />
            </div>

            <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black text-violet-500 uppercase tracking-[3px] px-3 py-1 bg-violet-50 rounded-full">
                    Step {step}
                </span>
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-violet-600 transition-colors">
                {title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
                {description}
            </p>
        </div>
    </motion.div>
);

/**
 * SellerLanding Section
 * The main landing experience for prospective vendors
 */
const SellerLanding = () => {
    const navigate = useNavigate();
    const [vendorInfo, setVendorInfo] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const checkStatus = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const { getUserInfo } = await import('../../api/axios');
                const data = await getUserInfo();
                setVendorInfo(data);
            } catch (error) {
                console.error("Error checking vendor status:", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkStatus();
    }, []);

    const handleAction = () => {
        if (vendorInfo?.is_approved_vendor) {
            navigate('/vendordashboard');
        } else if (vendorInfo?.is_vendor) {
            // If they are a vendor but not yet approved, we still send them to the dashboard
            // where they can see their status, or stay on the current page.
            // For now, let's go to dashboard as it's the professional space for vendors.
            navigate('/vendordashboard');
        } else {
            navigate('/verifyGST');
        }
    };

    return (
        <div className="min-h-screen bg-[#FCFBFA] selection:bg-violet-100 selection:text-violet-900">
            {/* 1️⃣ HERO SECTION */}
            <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
                {/* Visual Backdrop */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-100/40 to-purple-100/40 rounded-full blur-3xl -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-fuchsia-100/30 to-rose-100/30 rounded-full blur-3xl -ml-32 -mb-32" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-2xl"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 text-xs font-black uppercase tracking-[2px] rounded-full mb-8 border border-violet-100"
                            >
                                <Zap size={14} className="fill-current" />
                                Start your business journey
                            </motion.div>

                            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8">
                                Start selling <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600">
                                    on ShopSphere.
                                </span>
                            </h1>

                            <p className="text-lg lg:text-xl text-gray-500 font-medium leading-relaxed mb-10 max-w-xl">
                                Reach millions of shoppers and grow your business with our world-class
                                tools, integrated logistics, and secure payment processing.
                                Everything you need to scale globally.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(79, 70, 229, 0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAction}
                                    className="px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-violet-200 flex items-center justify-center gap-3 group transition-all duration-300"
                                >
                                    {vendorInfo?.is_vendor ? "Go to Dashboard" : "Start Selling"}
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>

                                <button className="px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 hover:border-violet-100 hover:bg-gray-50 rounded-[24px] font-black text-lg transition-all duration-300">
                                    Explore Benefits
                                </button>
                            </div>

                            <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 42}`} alt="Vendor" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-4 border-white bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                        +5k
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 font-bold tracking-tight">
                                    Join <span className="text-gray-900">5,000+</span> successful vendors today
                                </p>
                            </div>
                        </motion.div>

                        {/* Hero Illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative z-10 bg-white/40 backdrop-blur-xl p-6 rounded-[56px] border border-white shadow-2xl overflow-hidden">
                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-[48px] p-8 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                                    {/* Abstract background elements */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400 opacity-20 rounded-full blur-3xl" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 opacity-20 rounded-full blur-3xl" />

                                    <div className="relative z-10 flex flex-col items-center gap-10">
                                        <motion.div
                                            animate={{ y: [0, -15, 0] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-56 h-56 bg-white rounded-[40px] shadow-2xl flex items-center justify-center p-8 border border-white/50"
                                        >
                                            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-purple-600 rounded-[30px] flex items-center justify-center text-white shadow-inner">
                                                <ShoppingBag size={80} strokeWidth={1} />
                                            </div>
                                        </motion.div>

                                        <div className="flex gap-6">
                                            <motion.div
                                                animate={{ y: [0, 10, 0] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                                className="w-28 h-14 bg-white rounded-2xl shadow-xl border border-gray-50 flex items-center justify-center text-emerald-500 font-black text-xl gap-2"
                                            >
                                                <TrendingUp size={24} />
                                                84%
                                            </motion.div>
                                            <motion.div
                                                animate={{ y: [0, -8, 0] }}
                                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                                className="w-28 h-14 bg-white rounded-2xl shadow-xl border border-gray-50 flex items-center justify-center text-violet-600"
                                            >
                                                <Award size={28} />
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Floating Info Cards */}
                                    <div className="absolute top-8 left-8 p-4 bg-white/80 backdrop-blur shadow-lg border border-white rounded-2xl flex items-center gap-4">
                                        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Global Reach</p>
                                            <p className="text-xs font-black text-gray-900">150+ Regions</p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-8 right-8 p-4 bg-white/80 backdrop-blur shadow-lg border border-white rounded-2xl flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                            <Wallet size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Fast Payouts</p>
                                            <p className="text-xs font-black text-gray-900">Next Day</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2️⃣ HOW IT WORKS SECTION */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xs font-black text-violet-600 uppercase tracking-[4px] mb-4 bg-violet-50 inline-block px-4 py-2 rounded-full"
                        >
                            Step-by-Step Guide
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight"
                        >
                            How to sell on <span className="text-violet-600">ShopSphere?</span>
                        </motion.h2>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                    >
                        <StepCard
                            step="1"
                            title="Register Account"
                            description="Start by providing your business GST and PAN details for quick verification."
                            icon={Smartphone}
                        />
                        <StepCard
                            step="2"
                            title="Shipping Setup"
                            description="Configure your pickup address and choose your preferred delivery partners."
                            icon={Truck}
                        />
                        <StepCard
                            step="3"
                            title="List Products"
                            description="Use our intuitive dashboard to upload your inventory and go live in minutes."
                            icon={Box}
                        />
                        <StepCard
                            step="4"
                            title="Get Paid Safely"
                            description="Complete your orders and receive seamless payments directly in your bank account."
                            icon={Wallet}
                        />
                    </motion.div>
                </div>
            </section>

            {/* 3️⃣ CALL TO ACTION BANNER */}
            <section className="py-24 bg-[#FCFBFA]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-gray-900 rounded-[56px] p-12 lg:p-24 relative overflow-hidden text-center lg:text-left">
                        {/* Abstract background shapes */}
                        <div className="absolute top-0 right-0 w-[500px] h-full bg-violet-600/10 skew-x-12 translate-x-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-20 -mb-20" />

                        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl lg:text-6xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
                                    Ready to grow <br />
                                    your empire?
                                </h2>
                                <p className="text-xl text-gray-400 font-medium mb-12 max-w-lg">
                                    Join the most trusted e-commerce community and turn your products into a global success story.
                                </p>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAction}
                                    className="px-12 py-6 bg-white text-gray-900 rounded-[24px] font-black text-xl shadow-2xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 mx-auto lg:mx-0 group"
                                >
                                    {vendorInfo?.is_vendor ? "My Dashboard" : "Get Started Now"}
                                    <CheckCircle2 size={24} className="text-violet-600 group-hover:scale-110 transition-transform" />
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: "Commission", value: "0%" },
                                    { label: "Active Buyers", value: "12M+" },
                                    { label: "Avg Revenue", value: "$1.2k" },
                                    { label: "Support", value: "24/7" }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[40px] text-center lg:text-left">
                                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
                                        <p className="text-3xl lg:text-4xl font-black text-white">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};


const SellerPage = () => {
    return (
        <div className="animate-in fade-in duration-700">
            <SellerLanding />
        </div>
    );
};

export default SellerPage;

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    FaUser,
    FaShoppingBag,
    FaMapMarkerAlt,
    FaHeart,
    FaSignOutAlt,
    FaEdit,
    FaPlus,
    FaCheckCircle,
    FaWallet,
    FaCalendarAlt,
    FaChevronRight,
    FaShoppingBasket,
    FaRegAddressCard,
    FaEnvelope,
    FaMars,
    FaStore,
} from "react-icons/fa";
import AddressPage from "./AdressPage";

// ============================================
// PROFILE DASHBOARD COMPONENT
// Premium, modern account management reflecting the requested UI
// ============================================
function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");

    // Reusable Sidebar Config
    const sidebarItems = [
        { id: "profile", label: "Profile Information", icon: <FaUser /> },
        { id: "orders", label: "My Orders", icon: <FaShoppingBag /> },
        { id: "addresses", label: "Manage Addresses", icon: <FaMapMarkerAlt /> },
        { id: "wishlist", label: "My Wishlist", icon: <FaHeart /> },
        { id: "sell", label: "Sell on ShopSphere", icon: <FaStore /> },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    // ============================================
    // SUB-COMPONENTS (TAB CONTENT)
    // ============================================

    // 1. Profile Information Tab (Refined to match image)
    const ProfileInfoTab = () => (
        <div className="animate-in fade-in slide-in-from-right duration-500 bg-white rounded-[32px] p-8 lg:p-12 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Personal Information</h2>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold transition-colors">
                    <FaEdit size={16} /> Edit Profile
                </button>
            </div>

            {/* Personal Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 mb-16">
                <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 block">Full Name</label>
                    <p className="text-lg font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 block">Email Address</label>
                    <p className="text-lg font-bold text-gray-900">{user?.email}</p>
                </div>
                <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 block">Phone Number</label>
                    <p className="text-lg font-bold text-gray-900">+91 98765 43210</p>
                </div>
                <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 block">Gender</label>
                    <p className="text-lg font-bold text-gray-900">Male</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#f0f7ff] p-6 rounded-3xl flex items-center gap-5 transition-all duration-300">
                    <div className="min-w-[56px] min-h-[56px] bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50/50">
                        <FaCalendarAlt size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-[2px] mb-0.5">Since</p>
                        <p className="text-base font-bold text-blue-900">January 2023</p>
                    </div>
                </div>
                <div className="bg-[#f2fcf5] p-6 rounded-3xl flex items-center gap-5 transition-all duration-300">
                    <div className="min-w-[56px] min-h-[56px] bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50/50">
                        <FaCheckCircle size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[2px] mb-0.5">Status</p>
                        <p className="text-base font-bold text-emerald-900">Verified User</p>
                    </div>
                </div>
                <div className="bg-[#f8f6ff] p-6 rounded-3xl flex items-center gap-5 transition-all duration-300">
                    <div className="min-w-[56px] min-h-[56px] bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-50/50">
                        <FaWallet size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-purple-600 font-black uppercase tracking-[2px] mb-0.5">Wallet</p>
                        <p className="text-base font-bold text-purple-900">$450.00</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // 2. My Orders Tab
    const OrdersTab = () => (
        <div className="animate-in fade-in slide-in-from-right duration-500 bg-white rounded-[32px] p-8 lg:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Order History</h2>
            <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                    <div key={order} className="bg-white border border-gray-100 p-6 rounded-2xl flex items-center gap-6 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                            <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-500">
                                <FaShoppingBasket size={32} />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Order #SHP-2024-00{order}</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order === 1 ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                    }`}>
                                    {order === 1 ? "Delivered" : "Shipped"}
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 mb-1">Items: Organic Fruits, Dairy Pack...</h4>
                            <p className="text-sm text-gray-500 font-medium">Ordered on Oct 12, 2024 • 5 Items</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-3">
                            <p className="text-xl font-black text-gray-900">$89.90</p>
                            <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                View Details <FaChevronRight size={10} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
 // 3. Adress Tab
     const AddressTab = () => (
        <div className="animate-in fade-in slide-in-from-right duration-500 bg-white rounded-[32px] shadow-sm border border-gray-100">
            <AddressPage />
        </div>
    );

    // 4. My Wishlist Tab
    const WishlistTab = () => (
        <div className="animate-in fade-in slide-in-from-right duration-500 h-[600px] flex flex-col items-center justify-center text-center px-6">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8">
                <FaHeart size={64} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 max-w-sm mb-8 font-medium">
                Explore our curated collection of fresh organics and premium essentials to add them to your wishlist.
            </p>
            <button
                onClick={() => navigate("/")}
                className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all"
            >
                Explore Products
            </button>
        </div>
    );

    // 5. Sell on ShopSphere Tab
    const SellTab = () => (
        <div className="animate-in fade-in slide-in-from-right duration-500 bg-white rounded-[32px] p-8 lg:p-12 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sell Your Products</h2>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full">Seller Mode</span>
                </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-10 text-white mb-10 shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                {/* Decorative background elements */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>

                <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-4 leading-tight">Start Your Business <br />Journey with Us</h3>
                    <p className="text-blue-100 mb-8 max-w-md font-medium text-lg leading-relaxed">
                        List your products on ShopSphere and reach millions of customers worldwide.
                        Safe payments, easy shipping, and low commission.
                    </p>
                    <button className="px-8 py-4 bg-white text-blue-600 font-black rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3">
                        <FaPlus size={16} /> List a New Product
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-[24px] border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 border border-gray-50">
                        <FaShoppingBag size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Manage Listings</h4>
                    <p className="text-gray-500 font-medium mb-6">Track your active products, update stock, and modify prices.</p>
                    <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        View Products <FaChevronRight size={12} />
                    </button>
                </div>

                <div className="p-8 rounded-[24px] border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm mb-6 border border-gray-50">
                        <FaWallet size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Earnings & Payouts</h4>
                    <p className="text-gray-500 font-medium mb-6">View your sales reports and manage your withdrawal methods.</p>
                    <button className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        View Wallet <FaChevronRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );

    // ============================================
    // MAIN RENDER
    // ============================================
    return (
        <div className="min-h-screen bg-gray-50/50 pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* SIDEBAR */}
                    <aside className="w-full lg:w-[340px] flex-shrink-0 sticky top-28">
                        {/* User Profile Card */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-6 text-center">
                            <div className="relative inline-block mb-6">
                                <div className="w-28 h-28 bg-gray-200 rounded-full overflow-hidden mx-auto border-4 border-white shadow-xl">
                                    {/* Placeholder for John Doe Image or User Initial */}
                                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-4xl font-black">
                                        {user?.firstName?.charAt(0).toUpperCase() || "J"}
                                    </div>
                                </div>
                                <button className="absolute bottom-1 right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:scale-110 transition-transform duration-200">
                                    <FaEdit size={12} />
                                </button>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <p className="text-sm text-gray-400 font-bold mb-6 tracking-tight">{user?.email}</p>
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#f0f7ff] text-blue-600 text-[10px] font-black uppercase tracking-[3px] rounded-full border border-blue-100 shadow-sm shadow-blue-500/5">
                                Silver Member
                            </div>
                        </div>

                        {/* Sidebar Navigation */}
                        <nav className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 space-y-2">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-4 w-full px-6 py-4.5 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-300 ${activeTab === item.id
                                        ? "bg-blue-600 text-white shadow-2xl shadow-blue-500/25"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <span className={`transition-colors duration-300 ${activeTab === item.id ? "text-white" : "text-gray-400"}`}>
                                        {React.cloneElement(item.icon, { size: 18 })}
                                    </span>
                                    {item.label}
                                </button>
                            ))}

                            <div className="pt-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 w-full px-6 py-4.5 rounded-2xl text-[13px] font-black tracking-tight text-red-500 hover:bg-red-50 transition-all duration-300 group"
                                >
                                    <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" size={18} />
                                    Logout
                                </button>
                            </div>
                        </nav>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-grow min-h-screen">
                        {activeTab === "profile" && <ProfileInfoTab />}
                        {activeTab === "orders" && <OrdersTab />}
                        {activeTab === "addresses" && <AddressTab />}
                        {activeTab === "wishlist" && <WishlistTab />}
                        {activeTab === "sell" && <SellTab />}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Profile;

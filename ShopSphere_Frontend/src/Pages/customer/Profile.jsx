import React, { useState } from "react";
import { useNavigate, NavLink, Outlet, useOutletContext } from "react-router-dom";
import Orders from "./Orders";
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
    FaRegAddressCard,
    FaStore,
} from "react-icons/fa";
import { logout } from "../../api/axios";

// ============================================
// SUB-COMPONENTS (TAB CONTENT)
// ============================================

// 1. Profile Information Tab
export const ProfileInfoTab = () => {
    const user = useOutletContext();
    return (
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
                    <p className="text-lg font-bold text-gray-900">{user?.username}</p>
                </div>
                <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 block">Email Address</label>
                    <p className="text-lg font-bold text-gray-900">{user?.email}</p>
                </div>
                <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 block">Phone Number</label>
                    <p className="text-lg font-bold text-gray-900">{user?.mobile}</p>
                </div>
                <div>
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 block">Gender</label>
                    <p className="text-lg font-bold text-gray-900">{user?.gender}</p>
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
};


function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Reusable Sidebar Config - Using PATHS for routing
    const sidebarItems = [
        { id: "profile", label: "Profile Information", path: "/profile", icon: <FaUser />, end: true },
        { id: "orders", label: "My Orders", path: "/profile/orders", icon: <FaShoppingBag /> },
        { id: "addresses", label: "Manage Addresses", path: "/profile/addresses", icon: <FaMapMarkerAlt /> },
        { id: "wishlist", label: "My Wishlist", path: "/profile/wishlist", icon: <FaHeart /> },
        { id: "sell", label: "Sell on ShopSphere", path: "/profile/sell", icon: <FaStore /> },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

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
                                        {user?.username?.charAt(0).toUpperCase() }
                                    </div>
                                </div>
                                <button className="absolute bottom-1 right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:scale-110 transition-transform duration-200">
                                    <FaEdit size={12} />
                                </button>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
                                {user?.username}
                            </h3>
                            <p className="text-sm text-gray-400 font-bold mb-6 tracking-tight">{user?.email}</p>
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#f0f7ff] text-blue-600 text-[10px] font-black uppercase tracking-[3px] rounded-full border border-blue-100 shadow-sm shadow-blue-500/5">
                                Silver Member
                            </div>
                        </div>

                        {/* Sidebar Navigation */}
                        <nav className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 space-y-2">
                            {sidebarItems.map((item) => (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    end={item.end}
                                    className={({ isActive }) => `flex items-center gap-4 w-full px-6 py-4.5 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-300 ${isActive
                                        ? "bg-blue-600 text-white shadow-2xl shadow-blue-500/25"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className={`transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400"}`}>
                                                {React.cloneElement(item.icon, { size: 18 })}
                                            </span>
                                            {item.label}
                                        </>
                                    )}
                                </NavLink>
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
                        <Outlet context={user} />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Profile;

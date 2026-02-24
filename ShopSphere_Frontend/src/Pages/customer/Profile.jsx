import React, { useState } from "react";
import { useNavigate, NavLink, Outlet, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart, clearWishlist, clearOrders } from "../../Store";
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

import { logout, updateProfile } from "../../api/axios";
import toast from "react-hot-toast";
import AddressPage from "./AddressPage";
import Wishlist from "./Wishlist";

export const ProfileInfoTab = () => {
    const user = useOutletContext();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || "",
        phone: user?.phone || "",
        gender: user?.gender || ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Frontend Validations
        const nameTrimmed = formData.username.trim();
        // Regex: Only letters and single spaces between words
        const nameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

        if (!nameRegex.test(nameTrimmed)) {
            toast.error("Name should only contain letters and single spaces (no digits or special characters)");
            return;
        }

        if (nameTrimmed.length < 3) {
            toast.error("Name must be at least 3 characters long");
            return;
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            toast.error("Phone number must be exactly 10 digits");
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedUser = await updateProfile(formData);
            // Update local storage to reflect changes
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const newUserData = { ...storedUser, ...updatedUser };
            localStorage.setItem("user", JSON.stringify(newUserData));

            toast.success("Profile updated successfully!");
            setIsEditing(false);
            // Force a refresh or state update if needed, but since we use localStorage/Context it might need a reload or a parent state update
            window.location.reload();
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData) {
                // Handle DRF style errors
                const firstError = Object.values(errorData)[0];
                toast.error(Array.isArray(firstError) ? firstError[0] : firstError || "Failed to update profile");
            } else {
                toast.error("Failed to update profile");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right duration-500 bg-white rounded-[32px] p-8 lg:p-12 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Personal Information</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-orange-400 hover:text-orange-500 font-bold transition-colors"
                    >
                        <FaEdit size={16} /> Edit Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-8 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Phone Number</label>
                            <input
                                type="text"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] block">Gender</label>
                            <div className="flex gap-4">
                                {['Male', 'Female', 'Other'].map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: g })}
                                        className={`px-6 py-3 rounded-xl font-bold text-sm border transition-all ${formData.gender === g ? "bg-orange-400 text-white border-orange-400 shadow-lg shadow-orange-400/20" : "bg-white text-gray-500 border-gray-100 hover:border-orange-200"}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-4 bg-gradient-to-r from-orange-400 to-purple-500 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all ${isSubmitting ? "opacity-70" : ""}`}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-8 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
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
                            <p className="text-lg font-bold text-gray-900">{user?.phone || user?.mobile || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 block">Gender</label>
                            <p className="text-lg font-bold text-gray-900">{user?.gender || 'Not specified'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-orange-50 p-6 rounded-3xl flex items-center gap-5 transition-all duration-300">
                            <div className="min-w-[56px] min-h-[56px] bg-white rounded-2xl flex items-center justify-center text-orange-400 shadow-sm border border-orange-50/50">
                                <FaCalendarAlt size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-orange-400 font-black uppercase tracking-[2px] mb-0.5">Since</p>
                                <p className="text-base font-bold text-orange-900">January 2023</p>
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
                </>
            )}
        </div>
    );
};
// 2. My Orders Tab - Using the Orders component
export const OrdersTab = () => (
    <div className="animate-in fade-in slide-in-from-right duration-500 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <Orders />
    </div>
);
// 3. Adress Tab
export const AddressTab = () => (
    <div className="animate-in fade-in slide-in-from-right duration-500 bg-white rounded-[32px] shadow-sm border border-gray-100">
        <AddressPage />
    </div>
);

// 4. My Wishlist Tab
export const WishlistTab = () => (
    <div className="animate-in fade-in slide-in-from-right duration-500 bg-white rounded-[32px] shadow-sm border border-gray-100">
        <Wishlist />
    </div>
);

// 5. Sell Tab
export const SellTab = () => {
    const navigate = useNavigate();
    return (
        <div className="animate-in fade-in slide-in-from-right duration-500 h-[600px] flex flex-col items-center justify-center text-center px-6 bg-white rounded-[32px] shadow-sm border border-gray-100">
            <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-8">
                <FaStore size={64} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Become a Seller</h3>
            <p className="text-gray-500 max-w-sm mb-8 font-medium">
                Start your business journey with ShopSphere. Reach millions of customers with our easy onboarding.
            </p>
            <button
                onClick={() => navigate("/account-verification")}
                className="px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 hover:bg-purple-700 hover:-translate-y-1 transition-all"
            >
                Start Selling Now
            </button>
        </div>
    );
};

function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
        { id: "sell", label: "Sell on ShopSphere", path: "/seller", icon: <FaStore /> },
    ];

    const handleLogout = async () => {
        // Clear Redux State
        dispatch(clearCart());
        dispatch(clearWishlist());
        dispatch(clearOrders());

        // Clear tokens from localStorage
        await logout();

        // Clear user info from localStorage
        localStorage.removeItem("user");

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
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <button className="absolute bottom-1 right-1 w-8 h-8 bg-gradient-to-r from-orange-400 to-purple-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg hover:scale-110 transition-transform duration-200">
                                    <FaEdit size={12} />
                                </button>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">
                                {user?.username}
                            </h3>
                            <p className="text-sm text-gray-400 font-bold mb-6 tracking-tight">{user?.email}</p>
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-orange-50 text-orange-400 text-[10px] font-black uppercase tracking-[3px] rounded-full border border-orange-100 shadow-sm shadow-orange-400/5">
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
                                        ? "bg-gradient-to-r from-orange-400 to-purple-500 text-white shadow-2xl shadow-orange-400/25"
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

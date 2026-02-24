import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getVendorProfile } from "../../api/vendor_axios";
import { BellIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";

export default function VendorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [vendor, setVendor] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getVendorProfile();
        setVendor(data);
      } catch (error) {
        console.error("Error fetching vendor profile:", error);
        if (error.response?.status === 404) {
          navigate('/account-verification');
        }
      }
    };
    fetchProfile();

    const handler = (e) => setSidebarOpen(Boolean(e?.detail?.open));
    window.addEventListener('vendorSidebarToggle', handler);
    return () => window.removeEventListener('vendorSidebarToggle', handler);
  }, []);

  return (
    <div className={`min-h-screen flex overflow-x-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Sidebar />

      <div className={[
        'flex-1 flex flex-col transition-all duration-300 min-w-0',
        sidebarOpen ? 'md:ml-72' : 'md:ml-20',
      ].join(' ')}>

        {/* TOP HEADER */}
        <header className={`h-16 md:h-20 backdrop-blur-xl border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="truncate pr-4 pl-12 md:pl-0">
            <h1 className={`text-base md:text-xl font-semibold tracking-normal  uppercase truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {vendor ? vendor.shop_name : "My Store"}
            </h1>
            <p className="text-[9px] md:text-[10px] font-semibold text-gray-500 uppercase tracking-normal">Vendor Dashboard</p>
          </div>

          <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center group ${isDarkMode
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:border-amber-400/50'
                : 'bg-slate-50 border-slate-200 text-teal-500 hover:bg-white hover:border-indigo-300'}`}
            >
              {isDarkMode ? <SunIcon className="h-5 w-5 md:h-6 md:w-6" /> : <MoonIcon className="h-5 w-5 md:h-6 md:w-6" />}
            </button>



            <Link
              to="/vendorprofile"
              className={`flex items-center gap-2 p-1 pr-3 md:pr-4 border rounded-2xl transition-all group ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-indigo-200 shadow-sm'}`}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-teal-400 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform shadow-lg shadow-teal-400/20 text-sm">
                {vendor?.shop_name?.charAt(0)?.toUpperCase() || 'V'}
              </div>
              <div className="hidden sm:block">
                <p className={`text-xs font-semibold leading-none mb-0.5  truncate max-w-[120px] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{vendor?.shop_name || "My Store"}</p>
                <p className="text-[9px] font-semibold text-teal-400 uppercase tracking-wider leading-none">Settings</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

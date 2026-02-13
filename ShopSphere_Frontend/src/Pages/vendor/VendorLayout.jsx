import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function VendorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handler = (e) => setSidebarOpen(Boolean(e?.detail?.open));
    window.addEventListener('vendorSidebarToggle', handler);
    // ensure initial state
    window.dispatchEvent(new CustomEvent('vendorSidebarRequest'));
    return () => window.removeEventListener('vendorSidebarToggle', handler);
  }, []);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0 p-8`}>
        <Outlet />
      </main>
    </div>
  );
}

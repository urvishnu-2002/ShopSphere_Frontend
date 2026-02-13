import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function Sidebar() {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const location = useLocation();

  const menu = [
                { path: "/welcome", label: "Dashboard", icon: HomeIcon },
    { path: "/vendorallproducts", label: "Products", icon: CubeIcon },
    { path: "/vendoraddproduct", label: "Add Product", icon: PlusCircleIcon },
    { path: "/vendororders", label: "Orders", icon: ShoppingCartIcon },
    { path: "/vendorearning", label: "Earnings", icon: BanknotesIcon }
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 shadow bg-white fixed w-full z-40">
        <h2 className="font-bold">Vendor Portal</h2>
        <Bars3Icon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full bg-white w-64 p-4 transition-transform duration-300 md:hidden
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >

        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl">Vendor Portal</h2>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => setMobileOpen(false)}
          />
        </div>

        <Menu menu={menu} location={location} close={() => setMobileOpen(false)} />

      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:block fixed top-0 left-0 h-screen bg-white shadow-lg p-4 transition-all duration-300 z-30
        ${desktopOpen ? "w-64" : "w-20"}`}
      >

        <div className="flex justify-between items-center mb-8">

          {desktopOpen && <h2 className="font-bold text-xl">Vendor Portal</h2>}

          <Bars3Icon
            className="h-6 w-6 cursor-pointer"
            onClick={() => setDesktopOpen(!desktopOpen)}
          />

        </div>

        <ul className="space-y-2">

          {menu.map(item => {
            const active = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
                >
                  <item.icon className="h-5 w-5" />
                  {desktopOpen && item.label}
                </Link>
              </li>
            );
          })}

          <li>
            <Link
              to="/logout"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              {desktopOpen && "Logout"}
            </Link>
          </li>

        </ul>

      </aside>
    </>
  );
}

/* MOBILE MENU */

function Menu({ menu, location, close }) {
  return (
    <ul className="space-y-2">

      {menu.map(item => {
        const active = location.pathname === item.path;

        return (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={close}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg
              ${active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </li>
        );
      })}

      <Link
        to="/logout"
        onClick={close}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        Logout
      </Link>

    </ul>
  );
}

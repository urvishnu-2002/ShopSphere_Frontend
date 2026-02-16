import { useState, useEffect } from "react";
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

  useEffect(() => {
    // notify layout about current sidebar state
    window.dispatchEvent(new CustomEvent('vendorSidebarToggle', { detail: { open: desktopOpen } }));
  }, [desktopOpen]);

  useEffect(() => {
    // hide top nav and footer when vendor sidebar is mounted
    const selectors = ['nav', 'header', '.navbar', 'footer', '.site-footer'];
    const elems = [];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        elems.push({ el, display: el.style.display });
        el.style.display = 'none';
      });
    });

    return () => {
      // restore original display styles
      elems.forEach(({ el, display }) => {
        el.style.display = display || '';
      });
    };
  }, []);

  const menu = [
                { path: "/welcome", label: "Dashboard", icon: HomeIcon },
    { path: "/vendorallproducts", label: "Products", icon: CubeIcon },
    { path: "/vendoraddproduct", label: "Add Product", icon: PlusCircleIcon },
    { path: "/vendororders", label: "Orders", icon: ShoppingCartIcon },
    { path: "/vendorearning", label: "Earnings", icon: BanknotesIcon }
  ];

  return (
    <>
      {/* MOBILE SIDEBAR (always visible, fixed) */}
      <aside
        className="fixed z-50 top-0 left-0 h-full bg-white w-64 p-4 md:hidden"
      >

        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl">Vendor Portal</h2>
        </div>

        <Menu menu={menu} location={location} close={() => {}} />

      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:block fixed top-0 left-0 h-screen bg-white shadow-lg p-4 transition-all duration-300 z-30 ${desktopOpen ? 'w-64' : 'w-20'}`}
      >

        <div className="flex justify-between items-center mb-8">

          {desktopOpen && <h2 className="font-bold text-xl">Vendor Portal</h2>}

          <button onClick={() => setDesktopOpen(!desktopOpen)} aria-label="Toggle sidebar">
            <Bars3Icon
              className="h-6 w-6 cursor-pointer"
            />
          </button>

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
              {desktopOpen && 'Logout'}
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

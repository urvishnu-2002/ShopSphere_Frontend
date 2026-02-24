import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./Components/common/Navbar";
import Footer from "./Components/common/Footer";
import ScrollToTop from "./Components/common/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, useTheme } from './context/ThemeContext';

function Layout() {
  const location = useLocation();
  const hidePaths = [
    "/",
    "/delivery",
    "/login",
    "/signup",
    "/vendordashboard",
    "/vendor",
    "/welcome",
    "/account-verification",
    "/verify-otp",
    "/verifyGST",
    "/verifyPAN",
    "/store-name",
    "/shipping-address",
    "/shipping-method",
    "/shipping-fee-preferences",
    "/bank-details",
    "/offer-zone"
  ];
  const hideNavbarFooter = hidePaths.some(path => location.pathname === path || location.pathname.startsWith(path + "/"));
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-white text-slate-800'}`}>
      <ScrollToTop />
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{
          top: 90,
          right: 20,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '1.1rem',
            fontWeight: '600',
            padding: '16px 24px',
            borderRadius: '16px',
            background: '#1e1b4b',
            color: '#fff',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px border-white/10',
            maxWidth: '400px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {!hideNavbarFooter && <Navbar />}
      <main className={`flex-grow ${!hideNavbarFooter ? "pt-24" : ""}`}>
        <AppRoutes />
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

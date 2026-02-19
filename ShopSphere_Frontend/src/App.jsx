import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./Components/common/Navbar";
import Footer from "./Components/common/Footer";
import { Toaster } from "react-hot-toast";
import { fetchCart, formatImageUrl } from "./api/axios";
import { setCart } from "./Store";

function Layout() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const syncCart = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const cartData = await fetchCart();
        if (cartData && cartData.items) {
          const formattedItems = cartData.items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: parseFloat(item.product.price),
            description: item.product.description,
            image: item.product.images && item.product.images.length > 0 ? formatImageUrl(item.product.images[0].image) : "/placeholder.jpg",
            quantity: item.quantity
          }));
          dispatch(setCart(formattedItems));
        }
      } catch (error) {
        console.error("Cart sync failed:", error);
      }
    };

    syncCart();
  }, [dispatch, location.pathname]); // Runs on mount and route changes

  const hideNavbarFooter = ["/", "/vendor", "/delivery", "/login", "/signup", "/delivery/dashboard", "/delivery/assigned", "/delivery/earnings", "/account-verification", "/verify-otp", "/verifyGST", "/verifyPAN", "/store-name", "/shipping-address", "/shipping-method", "/shipping-fee-preferences", "/bank-details"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
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
      <Layout />

    </BrowserRouter>
  );
}

export default App;

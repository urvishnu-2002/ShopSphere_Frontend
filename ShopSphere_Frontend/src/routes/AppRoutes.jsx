import { Routes, Route, Navigate } from "react-router-dom";

// Customer Pages
import Home from "../Pages/customer/Home";
import Cart from "../Pages/customer/Cart";
import Checkout from "../Pages/customer/Checkout";
import WhishList from "../Pages/customer/WhishList";
import AboutUs from "../Pages/customer/AboutUs";
import ContactUs from "../Pages/customer/ContactUs";
import Login from "../Pages/customer/Login";
import VendorLogin from "../Pages/vendor/VendorLogin";
import DeliveryAgentLogin from "../Pages/delivery/DeliveryAgentLogin";
import DeliveryDashboard from "../Pages/delivery/dashboard";
import AssignedOrders from "../Pages/delivery/assignedorder";
import EarningsPage from "../Pages/delivery/earnings";
import Profile from "../Pages/customer/Profile";

function AppRoutes() {
    return (
        <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<WhishList />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/profile" element={<Profile />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/vendor" element={<VendorLogin />} />

            {/* Delivery Routes */}
            <Route path="/delivery" element={<DeliveryAgentLogin onLoginSuccess={() => console.log("Delivery Login Successful")} />} />
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            <Route path="/delivery/assigned" element={<AssignedOrders />} />
            <Route path="/delivery/earnings" element={<EarningsPage />} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;


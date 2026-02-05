import { Routes, Route } from "react-router-dom";

// Customer Pages
import Home from "../Pages/customer/Home";
import Cart from "../Pages/customer/Cart";
import Checkout from "../Pages/customer/Checkout";
import WhishList from "../Pages/customer/WhishList";
import AboutUs from "../Pages/customer/AboutUs";
import ContactUs from "../Pages/customer/ContactUs";
import Login from "../Pages/customer/Login";
import VendorLogin from "../Pages/vendor/VendorLogin";
import AdminLogin from "../Pages/admin/AdminLogin";
import DeliveryAgentLogin from "../Pages/delivery/DeliveryAgentLogin";
import DeliveryAgentLogin from "../pages/delivery/DeliveryAgentLogin";
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

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/vendor" element={<VendorLogin />} />

            {/* Delivery Routes */}
            <Route path="/delivery" element={<DeliveryAgentLogin />} />
        </Routes>
    );
}

export default AppRoutes;

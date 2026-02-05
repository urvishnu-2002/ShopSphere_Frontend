import { Routes, Route } from "react-router-dom";

// Customer Pages
import Home from "../pages/customer/Home";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import WhishList from "../pages/customer/WhishList";
import AboutUs from "../pages/customer/AboutUs";
import ContactUs from "../pages/customer/ContactUs";
import Login from "../Pages/customer/Login";
import VendorLogin from "../Pages/vendor/VendorLogin";
import DeliveryAgentLogin from "../pages/delivery/DeliveryAgentLogin";

// Auth Pages


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

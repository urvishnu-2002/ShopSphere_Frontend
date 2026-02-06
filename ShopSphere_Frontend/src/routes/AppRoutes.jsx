import { Routes, Route, Navigate } from "react-router-dom";

// Customer Pages
import Home from "../Pages/customer/Home";
import Cart from "../Pages/customer/Cart";
import Checkout from "../Pages/customer/Checkout";
import WhishList from "../Pages/customer/WhishList";
import AboutUs from "../Pages/customer/AboutUs";
import ContactUs from "../Pages/customer/ContactUs";
import Login from "../Pages/customer/Login";
import SignUp from "../Pages/customer/SignUp";
import VendorLogin from "../Pages/vendor/VendorLogin";
import DeliveryAgentLogin from "../Pages/delivery/DeliveryAgentLogin";
import Profile, { 
    ProfileInfoTab, 
    OrdersTab, 
    AddressTab, 
    WishlistTab, 
    SellTab 
} from "../Pages/customer/Profile";
import Success from "../Pages/customer/Success";

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
            {/* Nested Profile Routes */}
            <Route path="/profile" element={<Profile />}>
                <Route index element={<ProfileInfoTab />} />
                <Route path="orders" element={<OrdersTab />} />
                <Route path="addresses" element={<AddressTab />} />
                <Route path="wishlist" element={<WishlistTab />} />
                <Route path="sell" element={<SellTab />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/vendor" element={<VendorLogin />} />
            <Route path="/success" element={<Success />} /> 


            {/* Delivery Routes */}
            <Route path="/delivery" element={<DeliveryAgentLogin onLoginSuccess={() => console.log("Delivery Login Successful")} />} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;


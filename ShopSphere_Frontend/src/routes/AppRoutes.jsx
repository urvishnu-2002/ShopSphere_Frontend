import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/customer/Home";
import Cart from "../Pages/customer/Cart";
import Checkout from "../Pages/customer/Checkout";
import WhishList from "../Pages/customer/WhishList";
import Login from "../Pages/customer/Login";
import SignUp from "../Pages/customer/SignUp";
import VendorLogin from "../Pages/vendor/VendorLogin";
import DeliveryAgentLogin from "../Pages/delivery/DeliveryAgentLogin";
import Profile, {
    ProfileInfoTab,
    OrdersTab,
    AddressTab,
    WishlistTab
} from "../Pages/customer/Profile";
import SellerPage from "../Pages/customer/SellerPage";


import LandingPage from "../Components/common/LandingPage";
import VerifyGST from "../Pages/customer/VerifyGST";
import VerifyPAN from "../Pages/customer/VerifyPAN";
import StoreName from "../Pages/customer/StoreName";
import ShippingAddress from "../Pages/customer/ShippingAddress";
import ShippingMethod from "../Pages/customer/ShippingMethod";
import ShippingFeePreferences from "../Pages/customer/ShippingFeePreferences";
import BankDetails from "../Pages/customer/BankDetails";
import Success from "../Pages/customer/Success";


function AppRoutes() {
    return (
        <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/verifyGST" element={<VerifyGST />} />
            <Route path="/verifyPAN" element={<VerifyPAN />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<WhishList />} />
            {/* Nested Profile Routes */}
            <Route path="/profile" element={<Profile />}>
                <Route index element={<ProfileInfoTab />} />
                <Route path="orders" element={<OrdersTab />} />
                <Route path="addresses" element={<AddressTab />} />
                <Route path="wishlist" element={<WishlistTab />} />
                <Route path="sell" element={<SellerPage />} />
            </Route>

            <Route path="/store-name" element={<StoreName />} />
            <Route path="/shipping-address" element={<ShippingAddress />} />
            <Route path="/shipping-method" element={<ShippingMethod />} />
            <Route path="/shipping-fee-preferences" element={<ShippingFeePreferences />} />
            <Route path="/bank-details" element={<BankDetails />} />
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

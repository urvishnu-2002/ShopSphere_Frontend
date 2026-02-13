import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/customer/Home";
import Cart from "../Pages/customer/Cart";
import Checkout from "../Pages/customer/Checkout";
import Wishlist from "../Pages/customer/Wishlist";
import Login from "../Pages/customer/Login";
import SignUp from "../Pages/customer/SignUp";
import VendorLogin from "../Pages/vendor/VendorLogin";
import DeliveryAgentLogin from "../Pages/delivery/DeliveryAgentLogin";
import Profile, { ProfileInfoTab, OrdersTab, AddressTab, WishlistTab, SellTab } from "../Pages/customer/Profile";
import SellerPage from "../Pages/customer/SellerPage";
import DeliveryDashboard from "../Pages/delivery/dashboard";
import AssignedOrders from "../Pages/delivery/assignedorder";
import EarningsPage from "../Pages/delivery/earnings";
import LandingPage from "../Components/common/LandingPage";
import AccountVerification from "../Pages/customer/Accountverification";
import VerifyOTP from "../Pages/customer/VerifyOTP";
import StoreName from "../Pages/customer/StoreName";
import ShippingAddress from "../Pages/customer/ShippingAddress";
import ShippingMethod from "../Pages/customer/ShippingMethod";
import ShippingFeePreferences from "../Pages/customer/ShippingFeePreferences";
import BankDetails from "../Pages/customer/BankDetails";
import Success from "../Pages/customer/Success";
import ProductDetails from "../Pages/customer/ProductDetails";
import VerifyGST from "../Pages/customer/VerifyGST";
import VerifyPAN from "../Pages/customer/VerifyPAN";
import Sidebar from "../Pages/vendor/Sidebar";
import Dashboard from "../Pages/vendor/Dashboard";
import Orders from "../Pages/vendor/Orders";
import AddProduct from "../Pages/vendor/AddProduct";
import Products from "../Pages/vendor/Products";
import Earnings from "../Pages/vendor/Earnings";
import VendorLayout from "../Pages/vendor/VendorLayout";


function AppRoutes() {
    const hasSeenLanding = sessionStorage.getItem("hasSeenLanding");
    return (
        <Routes>
            {/* Landing Page – show ONLY once */}
            <Route
                path="/"
                element={
                    hasSeenLanding
                        ? <Navigate to="/home" replace />
                        : <LandingPage />
                }
            />

            {/* Customer Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />


            {/* <Route path="/about" element={<AboutUs />} /> */}
            {/* <Route path="/contact" element={<ContactUs />} /> */}

            {/* Nested Profile Routes */}
            <Route path="/profile" element={<Profile />}>
                <Route index element={<ProfileInfoTab />} />
                <Route path="orders" element={<OrdersTab />} />
                <Route path="addresses" element={<AddressTab />} />
                <Route path="wishlist" element={<WishlistTab />} />
                <Route path="sell" element={<SellTab />} />
            </Route>
            <Route path="/account-verification" element={<AccountVerification />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/verifyGST" element={<VerifyGST />} />
            <Route path="/verifyPAN" element={<VerifyPAN />} />
            <Route path="/store-name" element={<StoreName />} />
            <Route path="/shipping-address" element={<ShippingAddress />} />
            <Route path="/shipping-method" element={<ShippingMethod />} />
            <Route path="/shipping-fee-preferences" element={<ShippingFeePreferences />} />
            <Route path="/bank-details" element={<BankDetails />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/*vendor routes*/}
            <Route path="/vendor" element={<VendorLogin />} />
            <Route element={<VendorLayout />}>
                <Route path="/vendordashboard" element={<Dashboard/>} />
                <Route path="/welcome" element={<Dashboard/>} />
                <Route path="/vendorallproducts" element={<Products/>} />
                <Route path="/vendoraddproduct" element={<AddProduct/>} />
                <Route path="/vendororders" element={<Orders/>} />
                <Route path="/vendorearning" element={<Earnings/>} />
            </Route>







            <Route path="/success" element={<Success />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            {/* Delivery Routes */}
            <Route path="/delivery" element={<DeliveryAgentLogin onLoginSuccess={() => console.log("Delivery Login Successful")} />} />
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            <Route path="/delivery/assigned" element={<AssignedOrders />} />
            <Route path="/delivery/earnings" element={<EarningsPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;

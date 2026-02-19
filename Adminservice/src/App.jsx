import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/User';
import VendorReview from './admin/VendorReview';
import VendorDetails from './admin/VendorDetails';
import VendorApproval from './admin/VendorApproval';
import VendorRequests from './admin/VendorRequests';
import ProductManagement from './admin/ProductManagement';
import Reports from './admin/Reports';
import CommissionSettings from './admin/CommissionSettings';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';
import SplashScreen from './admin/SplashScreen';
import DeliveryAgentsManagement from './admin/DeliveryAgentsManagement';
import DeliveryAgentReview from './admin/DeliveryAgentReview';
import DeliveryRequests from './admin/DeliveryRequests';
import OrderManagement from './admin/OrderManagement';
import { NotificationProvider } from './context/NotificationContext';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';


function App() {
  return (
    <NotificationProvider>
      <UserProvider>
        <ProductProvider>
          <Router>
            <Routes>
              {/* Splash Screen as default route */}
              <Route path="/" element={<SplashScreen />} />

              {/* Login Routes */}
              <Route path="/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/delivery-agents"
                element={
                  <ProtectedAdminRoute>
                    <DeliveryAgentsManagement />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/delivery-agents/review/:id"
                element={
                  <ProtectedAdminRoute>
                    <DeliveryAgentReview />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedAdminRoute>
                    <UserManagement />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/vendors"
                element={
                  <ProtectedAdminRoute>
                    <VendorApproval />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/delivery/requests"
                element={
                  <ProtectedAdminRoute>
                    <DeliveryRequests />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/vendors/requests"
                element={
                  <ProtectedAdminRoute>
                    <VendorRequests />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/vendor/:id"
                element={
                  <ProtectedAdminRoute>
                    <VendorDetails />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/vendors/review/:id"
                element={
                  <ProtectedAdminRoute>
                    <VendorReview />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedAdminRoute>
                    <ProductManagement />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedAdminRoute>
                    <Reports />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/settings/commission"
                element={
                  <ProtectedAdminRoute>
                    <CommissionSettings />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedAdminRoute>
                    <OrderManagement />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </Router>
        </ProductProvider>
      </UserProvider>
    </NotificationProvider>
  );
}

export default App;


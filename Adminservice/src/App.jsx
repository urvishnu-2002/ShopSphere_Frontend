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
import DeliveryRequests from './admin/DeliveryRequests';
import DeliveryList from './admin/DeliveryList';
import DeliveryReview from './admin/DeliveryReview';
import OrderManagement from './admin/OrderManagement';
import OrderDetail from './admin/OrderDetail';
import DeletionRequests from './admin/DeletionRequests';

import { NotificationProvider } from './context/NotificationContext';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <UserProvider>
          <ProductProvider>
            <Toaster position="top-right" />
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
                  path="/deletion-requests"
                  element={
                    <ProtectedAdminRoute>
                      <DeletionRequests />
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
                      <VendorReview />
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
                  path="/delivery/requests"
                  element={
                    <ProtectedAdminRoute>
                      <DeliveryRequests />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/delivery/agents"
                  element={
                    <ProtectedAdminRoute>
                      <DeliveryList />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/delivery/review/:id"
                  element={
                    <ProtectedAdminRoute>
                      <DeliveryReview />
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
                  path="/orders"
                  element={
                    <ProtectedAdminRoute>
                      <OrderManagement />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedAdminRoute>
                      <OrderDetail />
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
              </Routes>
            </Router>
          </ProductProvider>
        </UserProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;


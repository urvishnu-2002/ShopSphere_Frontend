import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/User';
import VendorReview from './admin/VendorReview';
import VendorDetails from './admin/VendorDetails';
import VendorApproval from './admin/VendorApproval';
import VendorList from './admin/VendorList';
import VendorRequests from './admin/VendorRequests';
import ProductManagement from './admin/ProductManagement';
import Reports from './admin/Reports';
import CommissionSettings from './admin/CommissionSettings';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';
import SplashScreen from './admin/SplashScreen';
import { NotificationProvider } from './context/NotificationContext';
import { VendorProvider } from './context/VendorContext';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <VendorProvider>
        <UserProvider>
          <ProductProvider>
            <Router>
              <Routes>
                {/* Splash Screen as default route */}
                <Route path="/" element={<SplashScreen />} />

                {/* Login Route */}
                <Route path="/login" element={<AdminLogin />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
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
              </Routes>
            </Router>
          </ProductProvider>
        </UserProvider>
      </VendorProvider>
    </NotificationProvider>
  );
}

export default App;

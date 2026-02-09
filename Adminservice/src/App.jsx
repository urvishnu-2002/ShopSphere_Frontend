import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/User';
import VendorApproval from './admin/VendorApproval';
import VendorReview from './admin/VendorReview';
import ProductManagement from './admin/ProductManagement';
import OrderManagement from './admin/OrderManagement';
import Reports from './admin/Reports';
import CommissionSettings from './admin/CommissionSettings';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';
import { NotificationProvider } from './context/NotificationContext';
import { VendorProvider } from './context/VendorContext';
import { UserProvider } from './context/UserContext';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <VendorProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<AdminLogin />} />
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
                path="/orders"
                element={
                  <ProtectedAdminRoute>
                    <OrderManagement />
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
        </UserProvider>
      </VendorProvider>
    </NotificationProvider>
  );
}

export default App;

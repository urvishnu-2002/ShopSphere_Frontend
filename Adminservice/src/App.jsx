import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/User';
import VendorManagement from './admin/VendorManagement';
import ProductManagement from './admin/ProductManagement';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';
import './App.css';

function App() {
  return (
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
              <VendorManagement />
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
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/User';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

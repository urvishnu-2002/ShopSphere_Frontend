
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import DeliveryAgentLogin from './Pages/DeliveryAgentLogin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/delivery-login" element={<DeliveryAgentLogin />} />
      </Routes>
    </Router>
  );
}

export default App;


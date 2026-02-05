<<<<<<< deliverylogin
import AdminLogin from './admin/AdminLogin'
import './App.css'
import DeliveryAgentLogin from './Pages/DeliveryAgentLogin'
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import './App.css';
>>>>>>> main

function App() {
  return (
<<<<<<< deliverylogin
    <>
<<<<<<< HEAD:src/App.jsx
      <DeliveryAgentLogin/>
=======
      <AdminLogin />

>>>>>>> a176cebb1a517158cdabc68ba04324295a129d64:Adminservice/src/App.jsx
    </>
  )
=======
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
>>>>>>> main
}

export default App;

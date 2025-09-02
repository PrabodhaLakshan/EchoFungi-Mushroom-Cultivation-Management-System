import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/login/login';
import Register from './Components/Register/Register';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import BatchDashboard from './Components/BatchDashboard/BatchDashboard';
import { useNavigate } from 'react-router-dom';
// import Waiting from './Components/waiting/waiting';

function App() {
   const Navigate = useNavigate();
  return (
    <div>
     <React.Fragment>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/waiting" element={<div>Waiting for role assignment...</div>} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/batch_manager-dashboard" element={<BatchDashboard />} />
        {/* Add more routes here as needed */}
      </Routes>
     </React.Fragment>
    </div>
  );
}

export default App;  // ✅ THIS was missing

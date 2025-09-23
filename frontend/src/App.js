import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/login/login';
import Register from './Components/Register/Register';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';




import EnvironmentM from './Components/Environment management/EnvironmentM';
import RelaySwitch from './Components/relayControll/RelaySwitch';
import Emonitoring from './Components/Monitoring Section/Emonitoring';
import Acontrol from './Components/Automatic Control/Acontrol';
import Mcontrol from './Components/Manual Control/Mcontrol';
import EnvironmentHistory from './Components/EnvironmentHistory/EnvironmentH';
import UpdateSchedule from './Components/Manual Control/UpdateSchedule';
import ProfilePage from './Components/Profile/ProfilePage';



//
import Expenses from "./Components/Expenses/Expen";
import fDashboard from "./Components/fDashboard/fDashboard";
import Payroll from "./Components/Payroll/payroll";
import Profit from "./Components/Profit/profit";
import Alerts from "./Components/Alerts/Alerts";

import Exdetails from "./Components/Exdetails/Exdetails";
import Exreports from "./Components/Exreports/Exreports";

import Paydetails from "./Components/Paydetails/Paydetails"
import Employee from "./Components/Employee/Employee"

import EmpDetails from "./Components/EmpDetails/EmpDetails"
import UpdateExpense from "./Components/UpdateExpense/UpdateExpense";
import UpdateSalary from "./Components/UpdateSalary/UpdateSalary";
import SalarySlip from "./Components/SalarySlip/SalarySlip";
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
        <Route path="/Environment_Manager-dashboard" element={<EnvironmentM />} />
         <Route path="/history" element={<EnvironmentHistory />} />
         <Route path="/monitoring" element={<Emonitoring />} />
             <Route path="/automatic-control" element={<Acontrol />} />
             <Route path="/manual-control" element={<Mcontrol />} />
              <Route path="/relay" element={<RelaySwitch />} />
              <Route path="/update/:id" element={<UpdateSchedule />} />
              <Route path="/profile" element={<ProfilePage />} />
	      
		 <Route path="/Finance_Manager-dashboard" element={<fDashboard />}/>
	       <Route path="/payroll" element={<Payroll />}/>
          <Route path="/profit" element={<Profit/>}/>
          <Route path="/alerts" element={<Alerts/>}/>
          <Route path="/expense" element={<Expenses />}/>
          <Route path="/exdetails" element={<Exdetails />}/>
          <Route path="/exreports" element={<Exreports/>}/>
          <Route path="/payroll" element={<Payroll/>}/>
          <Route path="/paymentdetails" element={<Paydetails/>}/>
          <Route path="/employee" element={<Employee/>}/>
          <Route path="/employeedetails" element={<EmpDetails/>}/>
          <Route path="/exdetails/:id" element={<UpdateExpense />}/>
          <Route path="/Paydetails/:id" element={<UpdateSalary />}/>
          <Route path="/salarySlip/:id" element={<SalarySlip/>}/>
              





       
      </Routes>
     </React.Fragment>
    </div>
  );
}

export default App;  // ✅ THIS was missing

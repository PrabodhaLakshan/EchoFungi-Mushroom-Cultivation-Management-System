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



//finance
import Expenses from "./Components/Expenses/Expen";
import FDashboard from "./Components/fDashboard/fDashboard";
import Payroll from "./Components/Payroll/payroll";
import Profit from "./Components/Profit/profit";
import FAlerts from "./Components/Alerts/Alerts";

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

//inventory
//import Home from "./Components/Home/Home";
import InventoryDashboard from "./Components/InventoryDashboard/InventoryDashboard"; 
//import AddItem from "./Components/AddItem/AddItem";
import AddInventory from "./Components/AddInventory/AddInventory";
import InventoryItems from "./Components/Items/Items";
import Reports from "./Components/Reports/Reports";
import Alerts from "./Components/Alerts/Alerts";
import Logouts from "./Components/Logouts/Logouts";
import UpdateInventory from "./Components/UpdateInventory/UpdateInventory";
import AddSupplier from "./Components/AddSupplier/AddSupplier"

import AddPurchase from "./Components/AddPurchase/AddPurchase";
import IntReport from "./Components/IntReport/IntReport";
import Supplies from "./Components/Supplies/Supplies";
import UpdateSuppler from "./Components/UpdateSuppler/UpdateSuppler";
import Purchases from "./Components/Purchases/Purchases";
import UpdatePurchase from "./Components/UpdatePurchase/UpdatePurchase";
import SupplierReport from "./Components/SupplierReport/SupplierReport";
import PurchaseReport from "./Components/PurchaseReport/PurchaseReport";

//Batch

import BatchHome from "./Components/BatchHome/Home";
import AddBatch from "./Components/AddBatch/AddBatch"
import BatchDetails from "./Components/Batch Details/BatchDetails";
import UpdateBatch from "./Components/UpdateBatch/UpdateBatch";
import Addbag from "./Components/Add Bag/BagManager";
import SendPdf from "./Components/SendPdf/SendPdf";


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
	      
		 <Route path="/finance_manager-dashboard" element={<FDashboard />}/>
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
              
 <Route path="/Inventory_Manager-dashboard" element={<InventoryDashboard />} />
          <Route path="/additem" element={<AddInventory />} />
          <Route path="/itemdetails"  element={<InventoryItems />} />
          <Route path="/itemdetails/:id"  element={<UpdateInventory />} />
          <Route path="/addsupplier" element={<AddSupplier />} />
          <Route path="/supplierdetails" element={<Supplies />} />
           <Route path="/supplierdetails/:id" element={<UpdateSuppler />} />
          <Route path="/addpurchase" element={<AddPurchase />} />
          <Route path="/purchasedetails" element={<Purchases />} />
        <Route path="/purchasedetails/:id" element={<UpdatePurchase />} />
          <Route path="/reports"  element={<Reports />} />
           <Route path="/intreports"  element={<IntReport />} />
           <Route path="/supreports"  element={<SupplierReport />} />
            <Route path="/purchreports"  element={<PurchaseReport />} />
          <Route path="/alerts"  element={<Alerts />} />
           <Route path="/logout"  element={<Logouts />} />





          <Route path="/Batch_Manager-dashboard" element={<BatchHome />}/>
         
          <Route path="/mainhome" element={<BatchHome />}/>
          <Route path="/addbatch" element={<AddBatch />}/>
          <Route path="/batchdetails" element={<BatchDetails />}/>
         
          <Route path="/updatebatch/:id" element={<UpdateBatch />}/>
          <Route path="/addbag" element={<Addbag />}/>








       
      </Routes>
     </React.Fragment>
    </div>
  );
}

export default App;  // ✅ THIS was missing

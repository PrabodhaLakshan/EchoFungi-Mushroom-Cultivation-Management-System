import React from 'react';
import { Route, Routes } from 'react-router';
import './App.css';
import Home from './Components/home/Home';

import AddUsers from './Components/AddUser/Adduser';
import UpdateUser from './Components/UpdateUser/UpdateUser';

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
         
          <Route path="/AddUsers" element={<AddUsers />} />
          <Route path="/Users/:id" element={<UpdateUser />} />
         
         
           
      

           register
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;

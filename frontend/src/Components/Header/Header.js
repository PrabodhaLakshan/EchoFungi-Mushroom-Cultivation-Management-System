import React from 'react';
import './Header.css';  // import the CSS file
import {Link} from "react-router-dom";

const Header = () => {
  const username = sessionStorage.getItem("username");
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo / Title */}
        <div className="logo">
          <span>🍄 Mushroom Plantation</span>
        </div>

        <h2>Environment Management</h2>

        {/* Profile Icon */}
       
          
     
        <h1>Welcome {username}</h1>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import './Header.css';  // import the CSS file
import {Link} from "react-router-dom";
const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo / Title */}
        <div className="logo">
          <span>🍄 Mushroom Plantation</span>
        </div>

        {/* Navigation */}
        <nav className="nav">
        <Link to="/dashbord"> <h1>Home</h1> </Link> 
        <Link to="/Environment"> <h1>Environment management</h1> </Link> 
        <Link to="/test"> <h1>batch management</h1></Link> 
        <Link to="/AddUsers"> <h1>Users</h1></Link> 
        <Link to="/Storetemp"> <h1>temp</h1></Link>
        <Link to="/relay"> <h1>relay</h1></Link> 
        </nav>

        {/* Profile Icon */}
        <div className="profile-icon">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;

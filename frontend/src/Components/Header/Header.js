import React, { useState } from "react";
import { Search, UserCircle2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';  

const Header = ({ onSearch }) => {
const storedUser = JSON.parse(sessionStorage.getItem("user")) || {};
const username = storedUser.name || "Manager";

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  // Handle typing in search bar
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value); // send to parent
  };

  return (
    <header className="backdrop-blur-md bg-green-200/60 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* 🍄 Logo left */}
        <div className="text-xl font-bold text-green-900 flex items-center">
          🍄 Mushroom Plantation
        </div>

        

        {/* 👤 Profile & username right */}
        <div className="flex items-center gap-2">
          <UserCircle2 className="h-8 w-8 text-green-800" />
          <h1 className="text-lg font-semibold text-green-900">
            Welcome   <button onClick={() => navigate("/profile")}>{username}</button>

        
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;

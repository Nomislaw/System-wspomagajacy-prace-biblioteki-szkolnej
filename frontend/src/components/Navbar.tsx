import React from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <div className="navbar">
      <NavLink to="/books" className="sidebar-item">
        Książki
      </NavLink>
      
      <NavLink to="/loans" className="sidebar-item">
        Wypożyczenia
      </NavLink>
      
      <NavLink to="/settings" className="sidebar-item">
        Ustawienia
      </NavLink>        
      <button onClick={onLogout}>Wyloguj</button>
    </div>
  );
};

export default Navbar;

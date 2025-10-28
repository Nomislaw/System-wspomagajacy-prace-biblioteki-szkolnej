import React, { useState } from "react";
import { User } from "../types/Index";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout}) => {

  return (
    <>
      <div className="navbar-top">
        <h2>Witaj, {user.firstName} {user.lastName} ({user.role})</h2>
        <button className="logout-btn" onClick={onLogout}>Wyloguj</button>
      </div>

      <div className="navbar-bar">
        <div className="navbar-buttons">
          <NavLink to="/books" className={({ isActive }) => `navbar-button ${isActive ? "active" : ""}`} >Książki</NavLink>
          <NavLink to="/loans" className={({ isActive }) => `navbar-button ${isActive ? "active" : ""}`} >Wypożyczenia</NavLink>
          <NavLink to="/settings" className={({ isActive }) => `navbar-button ${isActive ? "active" : ""}`} >Ustawienia</NavLink>
        </div>
      </div>
    </>
  );
};

export default Navbar;

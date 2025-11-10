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
        <div>
            {user.role === "Administrator" && (
                      <NavLink to="/admin" className="btn">Administrator</NavLink>
            )}
            {user.role === "Librarian" && (
                      <NavLink to="/librarian" className="btn">Bibliotekarz</NavLink>
            )}
        <button className="logout-btn" onClick={onLogout}>Wyloguj</button>
        </div>
      </div>

      <div className="navbar-bar">
        <div className="navbar-buttons">
          <NavLink to="/my-reservations" className={({ isActive }) => `navbar-button ${isActive ? "active" : ""}`} >Moje rezerwacje</NavLink>
          <NavLink to="/my-borrows" className={({ isActive }) => `navbar-button ${isActive ? "active" : ""}`} >Moje wypożyczenia</NavLink>
          <NavLink to="/catalog" className={({ isActive }) => `navbar-button ${isActive ? "active" : ""}`} >Katalog</NavLink>
          <NavLink to="/settings" className={({ isActive }) => `navbar-button ${isActive ? "active" : ""}`} >Ustawienia</NavLink>
        </div>
      </div>
    </>
  );
};

export default Navbar;

import React from "react";
import { User } from "../types/Index";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();

  const section = location.pathname.split("/")[1] || "books";


  const renderLinks = () => {
    switch (section) {
      case "books":
        return (
          <>
            <NavLink to="/books/list" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Lista książek</NavLink>
            <NavLink to="/books/add" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Dodaj książkę</NavLink>
            <NavLink to="/books/delete" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Usuń książkę</NavLink>
          </>
        );

      case "loans":
        return (
          <>
            <NavLink to="/loans/active" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Aktywne wypożyczenia</NavLink>
            <NavLink to="/loans/history" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Historia wypożyczeń</NavLink>
          </>
        );

      case "settings":
        return (
          <>
            <NavLink to="/settings/profile" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Edytuj profil</NavLink>
            <NavLink to="/settings/password" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Zmień hasło</NavLink>
            {user.role === "Administrator" && (
              <NavLink to="/settings/users" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Panel administratora</NavLink>
            )}
          </>
        );

      default:
        return <p>Brak strony</p>;
    }
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">{renderLinks()}</nav>
    </div>
  );
};

export default Sidebar;

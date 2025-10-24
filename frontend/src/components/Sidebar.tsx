import React from "react";
import { User } from "../types/Index";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  user: User;
  section: string;
}

const Sidebar: React.FC<SidebarProps> = ({ user, section }) => {
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
              <NavLink to="/settings/users" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Użytkownicy</NavLink>
            )}
          </>
        );

      default:
        return <p>Panel użytkownika</p>;
    }
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">{renderLinks()}</nav>
    </div>
  );
};

export default Sidebar;

import React from "react";
import { NavLink } from "react-router-dom";
import {User} from "../types/Index"

interface SidebarProps{
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({user}) => {
  return (
    <div className="sidebar">
      <h2>Witaj, {user.firstName} {user.lastName}</h2>

      <nav className="sidebar-nav">
        <NavLink to="/books" className="sidebar-item">
          Książki
        </NavLink>

        <NavLink to="/loans" className="sidebar-item">
          Wypożyczenia
        </NavLink>

        <NavLink to="/settings" className="sidebar-item">
          Ustawienia
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;

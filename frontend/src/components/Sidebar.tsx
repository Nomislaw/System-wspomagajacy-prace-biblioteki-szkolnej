import React, { useEffect, useState } from "react";
import { User, Category } from "../types/Index";
import { NavLink, useLocation } from "react-router-dom";
import { CategoryService } from "../api/CategoryService";

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const section = location.pathname.split("/")[1] || "catalog";

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);
 


  const renderLinks = () => {
    switch (section) {
      case "my-reservations":
        return (
          <>
            <NavLink to="/my-reservations/active" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Aktywne</NavLink>
            <NavLink to="/my-reservations/expired" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Wygasłe</NavLink>
          </>
        );

      case "my-borrows":
        return (
          <>
            <NavLink to="/my-borrows/active" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Aktywne</NavLink>
            <NavLink to="/my-borrows/overdue" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Zaległe</NavLink>
            <NavLink to="/my-borrows/returned" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Zwrócone</NavLink>
          </>
        );
      case "catalog":
        return (
          <>
            <NavLink to="/catalog/all" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Wszystkie</NavLink>
             {categories.map(category => (
            <NavLink key={category.id} to={`/catalog/${category.name}`} className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
              {category.name}
            </NavLink>
          ))}

          </>
        );

      case "settings":
        return (
          <>
            <NavLink to="/settings/profile" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Edytuj profil</NavLink>
            <NavLink to="/settings/password" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Zmień hasło</NavLink>
          </>
        );
        case "admin":
        return (
          <>
                {user.role === "Administrator" && (
                  <NavLink to="/admin" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Użytkownicy</NavLink>
                )}
          </>
        );

        case "librarian":
          return(
            <>
                {user.role === "Librarian" && (
                  <NavLink to="/librarian/borrows" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Wypożyczenia</NavLink>
                )}
                {user.role === "Librarian" && (
                  <NavLink to="/librarian/reservations" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Rezerwacje</NavLink>
                )}
                {user.role === "Librarian" && (
                  <NavLink to="/librarian/books" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Książki</NavLink>
                )}
              {user.role === "Librarian" && (
                  <NavLink to="/librarian/authors" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Autorzy</NavLink>
                )}
                {user.role === "Librarian" && (
                  <NavLink to="/librarian/categories" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Kategorie</NavLink>
                )}
                {user.role === "Librarian" && (
                  <NavLink to="/librarian/publishers" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Wydawnictwa</NavLink>
                )}
                {user.role === "Librarian" && (
                  <NavLink to="/librarian/school-classes" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Klasy szkolne</NavLink>
                )}
                {user.role === "Librarian" && (
                  <NavLink to="/librarian/reports" className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>Generowanie raportów</NavLink>
                )}
            </>
          );

      default:
        return <></>;
    }
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">{renderLinks()}</nav>
    </div>
  );
};

export default Sidebar;

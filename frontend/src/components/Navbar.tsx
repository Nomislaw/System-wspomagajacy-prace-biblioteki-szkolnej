import React, { useState } from "react";
import { User } from "../types/Index";

interface NavbarProps {
  user: User;
  onLogout: () => void;
  setActiveSection: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, setActiveSection }) => {
  const [activeButton, setActiveButton] = useState("books"); 

  const handleClick = (section: string) => {
    setActiveButton(section);
    setActiveSection(section);
  };

  return (
    <>
      <div className="navbar-top">
        <h2>Witaj, {user.firstName} {user.lastName}</h2>
        <button className="logout-btn" onClick={onLogout}>Wyloguj</button>
      </div>

      <div className="navbar-bar">
        <div className="navbar-buttons">
          <button className={`navbar-button ${activeButton === "books" ? "active" : ""}`} onClick={() => handleClick("books")}>Książki</button>
          <button className={`navbar-button ${activeButton === "loans" ? "active" : ""}`} onClick={() => handleClick("loans")}>Wypożyczenia</button>
          <button className={`navbar-button ${activeButton === "settings" ? "active" : ""}`} onClick={() => handleClick("settings")}>Ustawienia</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;

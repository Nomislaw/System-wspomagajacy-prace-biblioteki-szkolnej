import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import BookList from "./components/BookList";
import Users from "./components/Users";
import Loans from "./components/Loans";
import { User } from "./types/User";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (!user) {
    return showLogin ? (
      <Login onLogin={handleLogin} goToRegister={() => setShowLogin(false)} />
    ) : (
      <Register onRegister={handleLogin} goToLogin={() => setShowLogin(true)} />
    );
  }

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>
          Witaj, {user.firstName} {user.lastName} ({user.role})
        </h1>
        <button onClick={handleLogout} style={{ padding: "8px 16px", cursor: "pointer" }}>
          Wyloguj
        </button>
      </header>

      <BookList userRole={user.role} />
      {(user.role === "Librarian" || user.role === "Administrator") && <Users />}
      <Loans userRole={user.role} />
    </div>
  );
};

export default App;

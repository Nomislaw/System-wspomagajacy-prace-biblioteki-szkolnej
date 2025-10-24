import React, { useState } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import { User } from "./types/Index";

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
      <Register
        onRegister={() => setShowLogin(true)}
        goToLogin={() => setShowLogin(true)}
      />
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import VerifyEmail from "./pages/auth/VerifyEmail";
import { User } from "./types/Index";
import { useNavigate } from "react-router-dom";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  const handleLogin = (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", user.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify" element={<VerifyEmail goToLogin={() => navigate("/login")} />}/>
        <Route path="/*" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
  );
};

export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import VerifyEmail from "./pages/auth/VerifyEmail";
import { User } from "./types/Index";
import { useNavigate } from "react-router-dom";
import RequestReset from "./pages/auth/RequestReset";
import ResetPassword from "./pages/auth/ResetPassword";

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

          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/verify" element={user ? <Navigate to="/" /> : <VerifyEmail goToLogin={() => navigate("/login")} />} />
          <Route path="/request" element={user ? <Navigate to="/" /> : <RequestReset />} />
          <Route path="/reset" element={user ? <Navigate to="/" /> : <ResetPassword />} />

          <Route path="/*" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />

          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
  );
};

export default App;

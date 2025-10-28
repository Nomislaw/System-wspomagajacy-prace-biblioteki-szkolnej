import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Password from "../../components/settings/Password";
import Profile from "../../components/settings/Profile";
import Users from "../../components/settings/Users";
import { User } from "../../types/Index";
import "./index.css";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {

  return (
    <div className={"dashboard"}>
      <Sidebar user={user}/>

      <div className="main-content">
        <Navbar user={user} onLogout={onLogout}/>

        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="books" />} />
            <Route path="/settings/" element={<Navigate to="profile" />} />
            <Route path="/loans/" element={<Navigate to="active" />} />
            <Route path="/books/" element={<Navigate to="list" />} />

                <Route path="settings">
                    <Route path="password" element={<Password />} />
                    <Route path="users" element={<Users />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

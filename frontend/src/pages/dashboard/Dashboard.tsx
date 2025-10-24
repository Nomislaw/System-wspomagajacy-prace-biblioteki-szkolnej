import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import BookList from "../../components/BookList";
import Loans from "../../components/Loans";
import UserSettings from "../../components/UserSettings";
import { User } from "../../types/Index";
import "./index.css";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {
  return (
    <div className={"dashboard"}>
      <Sidebar user={user} />

      <div className="main-content">
        <Navbar onLogout={onLogout} />

        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="books" />} />
            <Route path="books" element={<BookList />} />
            <Route path="loans" element={<Loans />} />
            <Route path="settings" element={<UserSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

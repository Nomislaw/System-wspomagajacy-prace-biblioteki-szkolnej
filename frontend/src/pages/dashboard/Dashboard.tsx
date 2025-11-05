import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Password from "../../components/settings/Password";
import Profile from "../../components/settings/Profile";
import UsersList from "../../components/admin/UsersList";
import AddUser from "../../components/admin/AddUser";
import { User } from "../../types/Index";
import "./index.css";
import ProtectedRoute from "../../components/ProtectedRoute";

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
            <Route path="/admin/" element={<ProtectedRoute user={user} allowedRoles={["Administrator"]}><Navigate to="users" /></ProtectedRoute>}/>

            <Route path="/admin/">
                    <Route path="users" element={<ProtectedRoute user={user} allowedRoles={["Administrator"]}><UsersList /></ProtectedRoute>} />
                    <Route path="users">
                    <Route path="add" element={<ProtectedRoute user={user} allowedRoles={["Administrator"]}><AddUser /></ProtectedRoute>} />
                    </Route>
            </Route>

            <Route path="/librarian/" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><Navigate to="users" /></ProtectedRoute>}/>

            <Route path="/librarian/">
                    <Route path="users" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><UsersList /></ProtectedRoute>} />
                    <Route path="addUser" element={<ProtectedRoute user={user} allowedRoles={["Librarian"]}><AddUser /></ProtectedRoute>} />
            </Route>


                <Route path="settings">
                    <Route path="password" element={<Password />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

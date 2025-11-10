import React from "react";
import { Navigate } from "react-router-dom";
import { User } from "../types/Index";

interface ProtectedRouteProps {
  user: User | null;
  allowedRoles?: string[]; 
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles, children }) => {
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

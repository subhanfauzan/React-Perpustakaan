import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika props roles diberikan, cek apakah user.role ada di list
  if (roles && Array.isArray(roles) && !roles.includes(user.role)) {
    // akses ditolak, redirect ke landing atau halaman lain
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

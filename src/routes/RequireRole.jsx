import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ roles = [] }) {
  const { user } = useAuth();
  const allowed = user && roles.includes(user.role);
  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

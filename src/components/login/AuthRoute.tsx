import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function GuestOnlyRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate replace to="/home" /> : <Outlet />;
}

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate replace to="/login" />;
}

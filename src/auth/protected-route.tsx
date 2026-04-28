import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingState } from "@/components/shared/LoadingState";
import { useAuth } from "@/auth/auth-context";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingState label="Validando sesión" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

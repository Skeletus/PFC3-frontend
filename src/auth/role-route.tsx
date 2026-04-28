import { Navigate, Outlet } from "react-router-dom";
import { getRoleHome, useAuth } from "@/auth/auth-context";
import type { UserRole } from "@/types/api.types";

export function RoleRoute({ roles }: { roles: UserRole[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={getRoleHome(user.role)} replace />;
  return <Outlet />;
}

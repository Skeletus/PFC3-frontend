import { Link, NavLink } from "react-router-dom";
import { CalendarDays, HeartHandshake, Home, LogOut, Search, Settings, Star, Users, Wallet, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { useAuth } from "@/auth/auth-context";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/api.types";

const navByRole: Record<UserRole, Array<{ to: string; label: string; icon: React.ElementType }>> = {
  PATIENT: [
    { to: "/patient/dashboard", label: "Dashboard", icon: Home },
    { to: "/patient/profile", label: "Perfil", icon: Settings },
    { to: "/patient/matching", label: "Matching", icon: Search },
    { to: "/patient/appointments", label: "Mis citas", icon: CalendarDays },
  ],
  PSYCHOLOGIST: [
    { to: "/psychologist/dashboard", label: "Dashboard", icon: Home },
    { to: "/psychologist/profile", label: "Perfil", icon: Settings },
    { to: "/psychologist/availability", label: "Disponibilidad", icon: Clock },
    { to: "/psychologist/appointments", label: "Citas", icon: CalendarDays },
    { to: "/psychologist/reviews", label: "Reviews", icon: Star },
  ],
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", icon: Home },
    { to: "/admin/patients", label: "Pacientes", icon: Users },
    { to: "/admin/psychologists", label: "Psicólogos", icon: HeartHandshake },
    { to: "/admin/appointments", label: "Citas", icon: CalendarDays },
    { to: "/admin/revenue", label: "Ingresos", icon: Wallet },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <aside className="flex h-full w-full flex-col border-r bg-candle-dark text-candle-warm md:w-72">
      <Link to="/" className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-candle-text">
          <HeartHandshake className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold">Candle Match</div>
          <div className="text-xs text-candle-warm/70">Marketplace psicológico</div>
        </div>
      </Link>

      <div className="px-5 pb-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="truncate text-sm font-medium">{user.name}</div>
          <div className="truncate text-xs text-candle-warm/65">{user.email}</div>
          <div className="mt-2">
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navByRole[user.role].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-primary text-candle-text" : "text-candle-warm/78 hover:bg-white/10 hover:text-white",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3">
        <Button variant="ghost" className="w-full justify-start text-candle-warm hover:bg-white/10 hover:text-white" onClick={logout}>
          <LogOut className="h-4 w-4" /> Salir
        </Button>
      </div>
    </aside>
  );
}

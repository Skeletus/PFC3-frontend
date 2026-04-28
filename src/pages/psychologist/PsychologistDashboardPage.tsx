import { CalendarDays, ShieldCheck, Star, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppointmentCard } from "@/components/shared/AppointmentCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatMoney } from "@/lib/formatters";
import { useAuth } from "@/auth/auth-context";
import { useAppointments } from "@/features/appointments/useAppointments";
import { useAvailability } from "@/features/availability/useAvailability";
import { usePsychologistProfile } from "@/features/psychologist/usePsychologistProfile";

export function PsychologistDashboardPage() {
  const { user } = useAuth();
  const profile = usePsychologistProfile();
  const appointments = useAppointments();
  const availability = useAvailability();

  if (profile.isLoading || appointments.isLoading || availability.isLoading) return <LoadingState />;
  if (profile.isError || appointments.isError || availability.isError) return <ErrorState />;

  const items = appointments.data ?? [];
  const payout = items.filter((a) => a.status === "COMPLETED").reduce((sum, a) => sum + (a.psychologistPayout ?? a.price * 0.85), 0);

  return (
    <>
      <PageHeader
        title={`Hola, ${user?.name ?? "psicólogo"}`}
        description="Gestiona tu perfil, disponibilidad y sesiones desde un solo lugar."
        action={<StatusBadge status={profile.data?.isVerified ? "VERIFIED" : "UNVERIFIED"} />}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Verificación" value={profile.data?.isVerified ? "Activa" : "Pendiente"} icon={ShieldCheck} />
        <MetricCard title="Próximas citas" value={items.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED").length} icon={CalendarDays} />
        <MetricCard title="Ingresos estimados" value={formatMoney(payout)} icon={Wallet} />
        <MetricCard title="Rating promedio" value={(profile.data?.rating ?? 0).toFixed(1)} icon={Star} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-3">
          <Button asChild variant="outline"><Link to="/psychologist/profile">Editar perfil</Link></Button>
          <Button asChild variant="outline"><Link to="/psychologist/availability">Gestionar disponibilidad</Link></Button>
          <Button asChild><Link to="/psychologist/appointments">Ver citas</Link></Button>
          <div className="rounded-lg border bg-white p-4 text-sm text-muted-foreground">
            Disponibilidad activa: {availability.data?.filter((a) => a.isActive).length ?? 0} bloques
          </div>
        </div>
        <section>
          <h2 className="mb-3 text-lg font-semibold">Próximas citas</h2>
          {items.length ? <div className="grid gap-4 md:grid-cols-2">{items.slice(0, 4).map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} detailPath={`/psychologist/appointments/${appointment.id}`} />)}</div> : <EmptyState title="Aún no tienes citas" />}
        </section>
      </div>
    </>
  );
}

import { CalendarCheck, CheckCircle2, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentCard } from "@/components/shared/AppointmentCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/auth/auth-context";
import { useAppointments } from "@/features/appointments/useAppointments";
import { usePatientProfile } from "@/features/patient/usePatientProfile";

export function PatientDashboardPage() {
  const { user } = useAuth();
  const profile = usePatientProfile();
  const appointments = useAppointments();

  if (profile.isLoading || appointments.isLoading) return <LoadingState />;
  if (profile.isError || appointments.isError) return <ErrorState />;

  const items = appointments.data ?? [];
  const upcoming = items.filter((item) => item.status === "PENDING" || item.status === "CONFIRMED").slice(0, 3);

  return (
    <>
      <PageHeader
        title={`Hola, ${user?.name ?? "paciente"}`}
        description="Encuentra un psicólogo adecuado y mantén tus sesiones organizadas."
        action={
          <Button asChild>
            <Link to="/patient/matching">
              <Search className="h-4 w-4" /> Encontrar psicólogo
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Pendientes" value={items.filter((a) => a.status === "PENDING").length} icon={Clock} />
        <MetricCard title="Confirmadas" value={items.filter((a) => a.status === "CONFIRMED").length} icon={CalendarCheck} />
        <MetricCard title="Completadas" value={items.filter((a) => a.status === "COMPLETED").length} icon={CheckCircle2} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Estado de perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {profile.data?.profileCompleted
                ? "Tu perfil tiene suficiente información para generar recomendaciones."
                : "Completa motivo, modalidad y presupuesto para mejorar el matching."}
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/patient/profile">Editar perfil</Link>
            </Button>
          </CardContent>
        </Card>
        <section>
          <h2 className="mb-3 text-lg font-semibold">Próximas citas</h2>
          {upcoming.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {upcoming.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} detailPath={`/patient/appointments/${appointment.id}`} />
              ))}
            </div>
          ) : (
            <EmptyState title="Aún no tienes próximas citas" description="El matching puede ayudarte a encontrar opciones disponibles." />
          )}
        </section>
      </div>
    </>
  );
}

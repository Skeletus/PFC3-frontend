import { CalendarCheck, CheckCircle2, HeartHandshake, Percent, Users, Wallet } from "lucide-react";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatMoney } from "@/lib/formatters";
import { useAdminDashboard } from "@/features/admin/useAdminDashboard";

export function AdminDashboardPage() {
  const dashboard = useAdminDashboard();
  if (dashboard.isLoading) return <LoadingState />;
  if (dashboard.isError || !dashboard.data) return <ErrorState />;
  const data = dashboard.data;
  return (
    <>
      <PageHeader title="Dashboard admin" description="Supervisión de usuarios, citas, verificaciones e ingresos." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Pacientes" value={data.totalPatients} icon={Users} />
        <MetricCard title="Psicólogos" value={data.totalPsychologists} icon={HeartHandshake} />
        <MetricCard title="Psicólogos verificados" value={data.verifiedPsychologists} icon={CheckCircle2} />
        <MetricCard title="Citas creadas" value={data.createdAppointments} icon={CalendarCheck} />
        <MetricCard title="Citas completadas" value={data.completedAppointments} icon={CalendarCheck} />
        <MetricCard title="Ingresos plataforma" value={formatMoney(data.platformRevenue)} icon={Wallet} />
        <MetricCard title="Conversión básica" value={`${Number(data.conversionRate ?? 0).toFixed(1)}%`} icon={Percent} />
      </div>
    </>
  );
}

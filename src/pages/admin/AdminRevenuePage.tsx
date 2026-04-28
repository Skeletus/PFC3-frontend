import { DataTable } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MetricCard } from "@/components/shared/MetricCard";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime, formatMoney } from "@/lib/formatters";
import { useAdminRevenue } from "@/features/admin/useAdminDashboard";
import type { Payment } from "@/types/api.types";

export function AdminRevenuePage() {
  const revenue = useAdminRevenue();
  if (revenue.isLoading) return <LoadingState />;
  if (revenue.isError || !revenue.data) return <ErrorState />;
  const data = revenue.data;
  return (
    <>
      <PageHeader title="Ingresos" description="Resumen de comisiones, payouts y pagos registrados." />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard title="Ingresos plataforma" value={formatMoney(data.totalPlatformRevenue)} />
        <MetricCard title="Comisiones" value={formatMoney(data.totalCommissions)} />
        <MetricCard title="Payouts" value={formatMoney(data.totalPayouts)} />
        <MetricCard title="Citas pagadas" value={data.paidAppointments} />
      </div>
      <DataTable<Payment>
        data={data.payments ?? []}
        columns={[
          { header: "Pago", cell: (item) => item.id },
          { header: "Cita", cell: (item) => item.appointmentId },
          { header: "Monto", cell: (item) => <MoneyDisplay value={item.amount} /> },
          { header: "Comisión", cell: (item) => <MoneyDisplay value={item.platformFee} /> },
          { header: "Payout", cell: (item) => <MoneyDisplay value={item.psychologistPayout} /> },
          { header: "Estado", cell: (item) => <StatusBadge status={item.status} /> },
          { header: "Fecha", cell: (item) => formatDateTime(item.paidAt ?? item.createdAt) },
        ]}
      />
    </>
  );
}

import { DataTable } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime } from "@/lib/formatters";
import { useAdminAppointments } from "@/features/admin/useAdminDashboard";
import type { Appointment } from "@/types/api.types";

export function AdminAppointmentsPage() {
  const appointments = useAdminAppointments();
  if (appointments.isLoading) return <LoadingState />;
  if (appointments.isError) return <ErrorState />;
  return (
    <>
      <PageHeader title="Gestión de citas" />
      <DataTable<Appointment>
        data={appointments.data ?? []}
        columns={[
          { header: "Paciente", cell: (item) => item.patient?.user?.name ?? "-" },
          { header: "Psicólogo", cell: (item) => item.psychologist?.user?.name ?? "-" },
          { header: "Fecha", cell: (item) => formatDateTime(item.startsAt) },
          { header: "Modalidad", cell: (item) => item.modality },
          { header: "Estado", cell: (item) => <StatusBadge status={item.status} /> },
          { header: "Precio", cell: (item) => <MoneyDisplay value={item.price} /> },
          { header: "Comisión", cell: (item) => <MoneyDisplay value={item.platformFee ?? item.price * 0.15} /> },
          { header: "Payout", cell: (item) => <MoneyDisplay value={item.psychologistPayout ?? item.price * 0.85} /> },
        ]}
      />
    </>
  );
}

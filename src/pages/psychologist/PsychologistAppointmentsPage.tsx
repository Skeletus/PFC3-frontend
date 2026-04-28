import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime } from "@/lib/formatters";
import { useAppointments } from "@/features/appointments/useAppointments";
import type { Appointment } from "@/types/api.types";

export function PsychologistAppointmentsPage() {
  const appointments = useAppointments();
  if (appointments.isLoading) return <LoadingState />;
  if (appointments.isError) return <ErrorState />;
  const data = appointments.data ?? [];
  if (!data.length) return <><PageHeader title="Citas" /><EmptyState title="Aún no tienes citas" /></>;

  return (
    <>
      <PageHeader title="Citas" description="Confirma, cancela o completa sesiones." />
      <DataTable<Appointment>
        data={data}
        columns={[
          { header: "Paciente", cell: (item) => item.patient?.user?.name ?? "Paciente" },
          { header: "Fecha", cell: (item) => formatDateTime(item.startsAt) },
          { header: "Modalidad", cell: (item) => item.modality },
          { header: "Estado", cell: (item) => <StatusBadge status={item.status} /> },
          { header: "Precio", cell: (item) => <MoneyDisplay value={item.price} /> },
          { header: "Payout", cell: (item) => <MoneyDisplay value={item.psychologistPayout ?? item.price * 0.85} /> },
          { header: "Acciones", cell: (item) => <Actions item={item} /> },
        ]}
      />
    </>
  );
}

function Actions({ item }: { item: Appointment }) {
  const appointments = useAppointments();
  return (
    <div className="flex flex-wrap gap-2">
      {item.status === "PENDING" ? <Button size="sm" onClick={() => appointments.confirm.mutate(item.id)}>Confirmar</Button> : null}
      {item.status === "CONFIRMED" ? <Button size="sm" onClick={() => appointments.complete.mutate(item.id)}>Completar</Button> : null}
      {item.status !== "CANCELLED" && item.status !== "COMPLETED" ? <Button size="sm" variant="outline" onClick={() => window.confirm("¿Cancelar esta cita?") && appointments.cancel.mutate(item.id)}>Cancelar</Button> : null}
      <Button size="sm" variant="ghost" asChild><Link to={`/psychologist/appointments/${item.id}`}>Detalle</Link></Button>
    </div>
  );
}

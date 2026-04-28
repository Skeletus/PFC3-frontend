import { useParams } from "react-router-dom";
import { AppointmentStatusActions } from "@/components/appointments/AppointmentStatusActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime } from "@/lib/formatters";
import { useAppointment, useAppointments } from "@/features/appointments/useAppointments";
import { usePayment, useSimulatePayment } from "@/features/payments/usePayments";

export function PatientAppointmentDetailPage() {
  const { id } = useParams();
  const appointment = useAppointment(id);
  const actions = useAppointments();
  const payment = usePayment(id);
  const pay = useSimulatePayment();

  if (appointment.isLoading) return <LoadingState />;
  if (appointment.isError || !appointment.data || !id) return <ErrorState />;

  const item = appointment.data;
  return (
    <>
      <PageHeader title="Detalle de cita" description={formatDateTime(item.startsAt)} />
      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <CardTitle>{item.psychologist?.user?.name ?? "Psicólogo"}</CardTitle>
          <StatusBadge status={item.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div>Modalidad: {item.modality}</div>
            <div>Duración: {item.durationMinutes} min</div>
            <div>Precio: <MoneyDisplay value={item.price} /></div>
            <div>Pago: {payment.data ? <StatusBadge status={payment.data.status} /> : "Sin pago registrado"}</div>
          </div>
          <AppointmentStatusActions
            appointment={item}
            role="PATIENT"
            onPay={() => pay.mutate(id)}
            onCancel={() => window.confirm("¿Cancelar esta cita?") && actions.cancel.mutate(id)}
          />
        </CardContent>
      </Card>
    </>
  );
}

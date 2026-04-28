import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AppointmentCard } from "@/components/shared/AppointmentCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAppointments } from "@/features/appointments/useAppointments";
import { useSimulatePayment } from "@/features/payments/usePayments";
import { useCreateReview } from "@/features/reviews/useReviews";
import type { Appointment } from "@/types/api.types";

export function PatientAppointmentsPage() {
  const appointments = useAppointments();
  if (appointments.isLoading) return <LoadingState />;
  if (appointments.isError) return <ErrorState />;
  const data = appointments.data ?? [];
  return (
    <>
      <PageHeader title="Mis citas" description="Gestiona reservas, pagos y reseñas." />
      {data.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.map((item) => <PatientAppointmentItem key={item.id} appointment={item} />)}</div> : <EmptyState title="No tienes citas registradas" />}
    </>
  );
}

function PatientAppointmentItem({ appointment }: { appointment: Appointment }) {
  const appointments = useAppointments();
  const pay = useSimulatePayment();
  return (
    <div className="space-y-2">
      <AppointmentCard appointment={appointment} detailPath={`/patient/appointments/${appointment.id}`} />
      <div className="flex flex-wrap gap-2">
        {appointment.status === "PENDING" ? <Button size="sm" onClick={() => pay.mutate(appointment.id)}>Pagar</Button> : null}
        {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" ? (
          <Button size="sm" variant="outline" onClick={() => window.confirm("¿Cancelar esta cita?") && appointments.cancel.mutate(appointment.id)}>Cancelar</Button>
        ) : null}
        {appointment.status === "COMPLETED" ? <ReviewDialog appointment={appointment} /> : null}
      </div>
    </div>
  );
}

function ReviewDialog({ appointment }: { appointment: Appointment }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const create = useCreateReview();
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm" variant="secondary">Reseñar</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Reseñar sesión</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Rating</Label><Input type="number" min={1} max={5} value={rating} onChange={(event) => setRating(Number(event.target.value))} /></div>
          <div className="space-y-2"><Label>Comentario</Label><Textarea value={comment} onChange={(event) => setComment(event.target.value)} /></div>
          <Button onClick={() => create.mutate({ appointmentId: appointment.id, psychologistId: appointment.psychologist?.id ?? appointment.psychologistId, rating, comment })}>Enviar reseña</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

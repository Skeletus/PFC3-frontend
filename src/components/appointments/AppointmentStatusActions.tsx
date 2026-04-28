import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types/api.types";

export function AppointmentStatusActions({
  appointment,
  role,
  onCancel,
  onConfirm,
  onComplete,
  onPay,
}: {
  appointment: Appointment;
  role: "PATIENT" | "PSYCHOLOGIST";
  onCancel?: () => void;
  onConfirm?: () => void;
  onComplete?: () => void;
  onPay?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {role === "PATIENT" && appointment.status === "PENDING" ? (
        <Button onClick={onPay}>Pagar</Button>
      ) : null}
      {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" ? (
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      ) : null}
      {role === "PSYCHOLOGIST" && appointment.status === "PENDING" ? <Button onClick={onConfirm}>Confirmar</Button> : null}
      {role === "PSYCHOLOGIST" && appointment.status === "CONFIRMED" ? <Button onClick={onComplete}>Marcar completada</Button> : null}
    </div>
  );
}

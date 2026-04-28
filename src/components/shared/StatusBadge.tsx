import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus, PaymentStatus } from "@/types/api.types";

const labels: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  PAID: "Pagado",
  FAILED: "Fallido",
  REFUNDED: "Reembolsado",
};

export function StatusBadge({ status }: { status: AppointmentStatus | PaymentStatus | "VERIFIED" | "UNVERIFIED" }) {
  const variant = status === "CANCELLED" || status === "FAILED" ? "destructive" : status === "PENDING" ? "outline" : "default";
  return <Badge variant={variant}>{labels[status] ?? (status === "VERIFIED" ? "Verificado" : "No verificado")}</Badge>;
}

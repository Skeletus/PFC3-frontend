import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime } from "@/lib/formatters";
import type { Appointment } from "@/types/api.types";

export function AppointmentCard({ appointment, detailPath }: { appointment: Appointment; detailPath: string }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">{appointment.psychologist?.user?.name ?? appointment.patient?.user?.name ?? "Cita"}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(appointment.startsAt)}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <div>Modalidad: {appointment.modality}</div>
        <div>
          Precio: <MoneyDisplay value={appointment.price} />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to={detailPath}>Ver detalle</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

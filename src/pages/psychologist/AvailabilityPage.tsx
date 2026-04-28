import { Pencil, Trash2 } from "lucide-react";
import { AvailabilityForm } from "@/components/forms/AvailabilityForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { dayLabels, modalityLabels } from "@/lib/constants";
import { useAvailability } from "@/features/availability/useAvailability";
import type { Availability } from "@/types/api.types";

export function AvailabilityPage() {
  const availability = useAvailability();
  if (availability.isLoading) return <LoadingState />;
  if (availability.isError) return <ErrorState />;
  const data = availability.data ?? [];
  return (
    <>
      <PageHeader title="Disponibilidad" description="Publica los bloques que los pacientes pueden reservar." />
      <Card className="mb-6">
        <CardHeader><CardTitle>Nuevo bloque</CardTitle></CardHeader>
        <CardContent><AvailabilityForm onSubmit={(values) => availability.create.mutate(values)} isSubmitting={availability.create.isPending} /></CardContent>
      </Card>
      {data.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.map((item) => <AvailabilityItem key={item.id} item={item} />)}</div> : <EmptyState title="Sin bloques de disponibilidad" />}
    </>
  );
}

function AvailabilityItem({ item }: { item: Availability }) {
  const availability = useAvailability();
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{dayLabels[item.dayOfWeek]}</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-muted-foreground">{item.startTime} - {item.endTime} · {modalityLabels[item.modality]}</div>
        <div>{item.isActive ? "Activo" : "Inactivo"}</div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild><Button size="sm" variant="outline"><Pencil className="h-4 w-4" /> Editar</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Editar disponibilidad</DialogTitle></DialogHeader>
              <AvailabilityForm initial={item} onSubmit={(values) => availability.update.mutate({ id: item.id, payload: values })} isSubmitting={availability.update.isPending} />
            </DialogContent>
          </Dialog>
          <Button size="sm" variant="destructive" onClick={() => window.confirm("¿Eliminar este bloque?") && availability.remove.mutate(item.id)}><Trash2 className="h-4 w-4" /> Eliminar</Button>
        </div>
      </CardContent>
    </Card>
  );
}

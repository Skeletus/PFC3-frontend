import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dayLabels, modalityLabels } from "@/lib/constants";
import type { Availability, DayOfWeek, Modality } from "@/types/api.types";

const schema = z.object({
  dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  modality: z.enum(["VIRTUAL", "PRESENTIAL", "HYBRID"]),
  isActive: z.boolean(),
});

type Values = z.infer<typeof schema>;

export function AvailabilityForm({ initial, onSubmit, isSubmitting }: { initial?: Availability; onSubmit: (values: Values) => void; isSubmitting?: boolean }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? {
      dayOfWeek: "MONDAY",
      startTime: "09:00",
      endTime: "10:00",
      modality: "VIRTUAL",
      isActive: true,
    },
  });

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label>Día</Label>
        <Select value={form.watch("dayOfWeek")} onValueChange={(value) => form.setValue("dayOfWeek", value as DayOfWeek)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(dayLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Modalidad</Label>
        <Select value={form.watch("modality")} onValueChange={(value) => form.setValue("modality", value as Modality)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(modalityLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Hora inicio</Label>
        <Input type="time" {...form.register("startTime")} />
      </div>
      <div className="space-y-2">
        <Label>Hora fin</Label>
        <Input type="time" {...form.register("endTime")} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={form.watch("isActive")} onChange={(event) => form.setValue("isActive", event.currentTarget.checked)} />
        Activo
      </label>
      <div className="md:col-span-2">
        <Button disabled={isSubmitting}>{initial ? "Guardar cambios" : "Crear bloque"}</Button>
      </div>
    </form>
  );
}

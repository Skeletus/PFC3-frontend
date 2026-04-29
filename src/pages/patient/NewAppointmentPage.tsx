import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { psychologistsApi } from "@/api/psychologists.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { modalityLabels } from "@/lib/constants";
import { useAppointments } from "@/features/appointments/useAppointments";
import { useSimulatePayment } from "@/features/payments/usePayments";
import type { Modality } from "@/types/api.types";

const schema = z.object({
  startsAt: z.string().min(1).refine((value) => !Number.isNaN(new Date(value).getTime()), "Fecha inválida"),
  durationMinutes: z.coerce.number().min(30),
  modality: z.enum(["VIRTUAL", "PRESENTIAL", "HYBRID"]),
});

type Values = z.infer<typeof schema>;

export function NewAppointmentPage() {
  const { psychologistId } = useParams();
  const navigate = useNavigate();
  const psychologist = useQuery({ queryKey: ["psychologists", psychologistId], queryFn: () => psychologistsApi.byId(psychologistId!), enabled: Boolean(psychologistId) });
  const appointments = useAppointments();
  const pay = useSimulatePayment();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { startsAt: "", durationMinutes: 50, modality: "VIRTUAL" } });

  if (psychologist.isLoading) return <LoadingState />;
  if (psychologist.isError || !psychologist.data || !psychologistId) return <ErrorState />;

  const price = psychologist.data.sessionPrice ?? 0;
  const platformFee = price * 0.15;

  const onSubmit = async (values: Values) => {
    const appointment = await appointments.create.mutateAsync({
      psychologistId,
      scheduledAt: new Date(values.startsAt).toISOString(),
      durationMinutes: values.durationMinutes,
      modality: values.modality,
    });
    await pay.mutateAsync(appointment.id);
    navigate(`/patient/appointments/${appointment.id}`);
  };

  return (
    <>
      <PageHeader title="Reservar cita" description={`Sesión con ${psychologist.data.user?.name ?? "psicólogo"}`} />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Datos de la sesión</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <Field label="Fecha y hora"><Input type="datetime-local" {...form.register("startsAt")} /></Field>
              <Field label="Duración"><Input type="number" {...form.register("durationMinutes")} /></Field>
              <Field label="Modalidad">
                <Select value={form.watch("modality")} onValueChange={(value) => form.setValue("modality", value as Modality)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(modalityLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Button disabled={appointments.create.isPending || pay.isPending}>Crear cita y simular pago</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Resumen económico</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Precio de sesión</span><MoneyDisplay value={price} /></div>
            <div className="flex justify-between"><span>Comisión estimada</span><MoneyDisplay value={platformFee} /></div>
            <div className="flex justify-between font-semibold"><span>Total a pagar</span><MoneyDisplay value={price} /></div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

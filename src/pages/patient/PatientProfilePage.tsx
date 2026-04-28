import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { modalityLabels, urgencyLabels } from "@/lib/constants";
import { usePatientProfile } from "@/features/patient/usePatientProfile";
import type { Gender, Modality, PatientProfile, UrgencyLevel } from "@/types/api.types";

const schema = z.object({
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  preferredModality: z.string().optional(),
  mainConcern: z.string().min(3, "Describe brevemente el motivo"),
  urgencyLevel: z.string().optional(),
  preferredSchedule: z.string().optional(),
  minBudget: z.coerce.number().optional(),
  maxBudget: z.coerce.number().optional(),
});

type Values = z.infer<typeof schema>;

export function PatientProfilePage() {
  const profile = usePatientProfile();
  const form = useForm<Values>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (profile.data) {
      form.reset({
        dateOfBirth: profile.data.dateOfBirth?.slice(0, 10) ?? "",
        gender: profile.data.gender ?? "",
        city: profile.data.city ?? "",
        preferredModality: profile.data.preferredModality ?? "",
        mainConcern: profile.data.mainConcern ?? "",
        urgencyLevel: profile.data.urgencyLevel ?? "",
        preferredSchedule: profile.data.preferredSchedule ?? "",
        minBudget: profile.data.minBudget ?? undefined,
        maxBudget: profile.data.maxBudget ?? undefined,
      });
    }
  }, [form, profile.data]);

  if (profile.isLoading) return <LoadingState />;
  if (profile.isError) return <ErrorState />;

  return (
    <>
      <PageHeader title="Perfil del paciente" description="Esta información alimenta las recomendaciones del motor de matching." />
      <Card>
        <CardContent className="pt-5">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit((values) => profile.update.mutate(values as Partial<PatientProfile>))}>
            <Field label="Fecha de nacimiento">
              <Input type="date" {...form.register("dateOfBirth")} />
            </Field>
            <Field label="Género">
              <Select value={form.watch("gender")} onValueChange={(value) => form.setValue("gender", value as Gender)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {["FEMALE", "MALE", "NON_BINARY", "OTHER", "PREFER_NOT_TO_SAY"].map((value) => (
                    <SelectItem key={value} value={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Ciudad">
              <Input {...form.register("city")} />
            </Field>
            <Field label="Modalidad preferida">
              <Select value={form.watch("preferredModality")} onValueChange={(value) => form.setValue("preferredModality", value as Modality)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(modalityLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Nivel de urgencia">
              <Select value={form.watch("urgencyLevel")} onValueChange={(value) => form.setValue("urgencyLevel", value as UrgencyLevel)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(urgencyLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Horario preferido">
              <Input placeholder="Ej. tardes, lunes y miércoles" {...form.register("preferredSchedule")} />
            </Field>
            <Field label="Presupuesto mínimo">
              <Input type="number" {...form.register("minBudget")} />
            </Field>
            <Field label="Presupuesto máximo">
              <Input type="number" {...form.register("maxBudget")} />
            </Field>
            <div className="space-y-2 md:col-span-2">
              <Label>Motivo principal de consulta</Label>
              <Textarea {...form.register("mainConcern")} />
              {form.formState.errors.mainConcern ? <p className="text-xs text-destructive">{form.formState.errors.mainConcern.message}</p> : null}
            </div>
            <div className="md:col-span-2">
              <Button disabled={profile.update.isPending}>Guardar perfil</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

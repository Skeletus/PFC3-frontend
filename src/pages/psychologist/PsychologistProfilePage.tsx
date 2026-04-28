import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { modalityLabels, specialties } from "@/lib/constants";
import { usePsychologistProfile } from "@/features/psychologist/usePsychologistProfile";
import type { Modality } from "@/types/api.types";

const schema = z.object({
  licenseNumber: z.string().optional(),
  professionalTitle: z.string().optional(),
  specialties: z.array(z.string()).default([]),
  yearsOfExperience: z.coerce.number().optional(),
  bio: z.string().optional(),
  sessionPrice: z.coerce.number().optional(),
  modalities: z.array(z.enum(["VIRTUAL", "PRESENTIAL", "HYBRID"])).default([]),
  city: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function PsychologistProfilePage() {
  const profile = usePsychologistProfile();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { specialties: [], modalities: [] } });

  useEffect(() => {
    if (profile.data) {
      form.reset({
        licenseNumber: profile.data.licenseNumber ?? "",
        professionalTitle: profile.data.professionalTitle ?? "",
        specialties: profile.data.specialties ?? [],
        yearsOfExperience: profile.data.yearsOfExperience ?? undefined,
        bio: profile.data.bio ?? "",
        sessionPrice: profile.data.sessionPrice ?? undefined,
        modalities: profile.data.modalities ?? [],
        city: profile.data.city ?? "",
      });
    }
  }, [form, profile.data]);

  if (profile.isLoading) return <LoadingState />;
  if (profile.isError) return <ErrorState />;

  const selectedSpecialties = form.watch("specialties");
  const selectedModalities = form.watch("modalities");

  return (
    <>
      <PageHeader title="Perfil profesional" description="Tu perfil visible en recomendaciones y detalle público." />
      <Card>
        <CardContent className="pt-5">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit((values) => profile.update.mutate(values))}>
            <Field label="Número de colegiatura/licencia"><Input {...form.register("licenseNumber")} /></Field>
            <Field label="Título profesional"><Input {...form.register("professionalTitle")} /></Field>
            <Field label="Años de experiencia"><Input type="number" {...form.register("yearsOfExperience")} /></Field>
            <Field label="Precio de sesión"><Input type="number" {...form.register("sessionPrice")} /></Field>
            <Field label="Ciudad"><Input {...form.register("city")} /></Field>
            <div className="space-y-2 md:col-span-2">
              <Label>Especialidades</Label>
              <div className="grid gap-2 md:grid-cols-3">
                {specialties.map((specialty) => (
                  <label key={specialty} className="flex items-center gap-2 rounded-md border bg-white p-2 text-sm">
                    <Checkbox checked={selectedSpecialties.includes(specialty)} onChange={(event) => {
                      form.setValue("specialties", event.currentTarget.checked ? [...selectedSpecialties, specialty] : selectedSpecialties.filter((item) => item !== specialty));
                    }} />
                    {specialty}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Modalidades</Label>
              <div className="grid gap-2 md:grid-cols-3">
                {Object.entries(modalityLabels).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 rounded-md border bg-white p-2 text-sm">
                    <Checkbox checked={selectedModalities.includes(value as Modality)} onChange={(event) => {
                      form.setValue("modalities", event.currentTarget.checked ? [...selectedModalities, value as Modality] : selectedModalities.filter((item) => item !== value));
                    }} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Bio</Label>
              <Textarea {...form.register("bio")} />
            </div>
            <div className="md:col-span-2"><Button disabled={profile.update.isPending}>Guardar perfil</Button></div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

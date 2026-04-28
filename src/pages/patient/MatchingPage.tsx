import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { PsychologistCard } from "@/components/shared/PsychologistCard";
import { modalityLabels, urgencyLabels } from "@/lib/constants";
import { useMatching } from "@/features/matching/useMatching";
import type { Modality, UrgencyLevel } from "@/types/api.types";

const schema = z.object({
  mainConcern: z.string().min(3),
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRISIS"]),
  modality: z.enum(["VIRTUAL", "PRESENTIAL", "HYBRID"]),
  preferredSchedule: z.string().optional(),
  city: z.string().optional(),
  minBudget: z.coerce.number().optional(),
  maxBudget: z.coerce.number().optional(),
});

type Values = z.infer<typeof schema>;

export function MatchingPage() {
  const matching = useMatching();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { mainConcern: "", urgencyLevel: "MEDIUM", modality: "VIRTUAL", preferredSchedule: "", city: "" },
  });
  const results = useMemo(
    () => matching.manual.data ?? matching.fromProfile.data ?? [],
    [matching.fromProfile.data, matching.manual.data],
  );

  return (
    <>
      <PageHeader title="Matching" description="El núcleo de Candle Match: recomendaciones ordenadas por compatibilidad clínica y logística." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buscar desde mi perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">Usa la información guardada en tu perfil de paciente.</p>
              <Button className="w-full" onClick={() => matching.fromProfile.mutate()} disabled={matching.fromProfile.isPending}>
                <Search className="h-4 w-4" /> Buscar con mi perfil
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda manual</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={form.handleSubmit((values) => matching.manual.mutate(values))}>
                <Field label="Motivo de consulta">
                  <Textarea {...form.register("mainConcern")} />
                </Field>
                <Field label="Urgencia">
                  <Select value={form.watch("urgencyLevel")} onValueChange={(value) => form.setValue("urgencyLevel", value as UrgencyLevel)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(urgencyLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Modalidad">
                  <Select value={form.watch("modality")} onValueChange={(value) => form.setValue("modality", value as Modality)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(modalityLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="Horario preferido"><Input {...form.register("preferredSchedule")} /></Field>
                <Field label="Ciudad"><Input {...form.register("city")} /></Field>
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Presupuesto mínimo"><Input type="number" {...form.register("minBudget")} /></Field>
                  <Field label="Presupuesto máximo"><Input type="number" {...form.register("maxBudget")} /></Field>
                </div>
                <Button className="w-full" disabled={matching.manual.isPending}>Buscar recomendaciones</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <section>
          <h2 className="mb-3 text-lg font-semibold">Resultados recomendados</h2>
          {results.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {results.map((recommendation) => (
                <PsychologistCard key={recommendation.psychologist.id} psychologist={recommendation.psychologist} recommendation={recommendation} />
              ))}
            </div>
          ) : (
            <EmptyState title="Ejecuta una búsqueda para ver psicólogos" description="Las recomendaciones aparecerán ordenadas por score de compatibilidad." />
          )}
        </section>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

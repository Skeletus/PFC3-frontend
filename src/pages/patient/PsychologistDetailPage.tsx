import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Calendar } from "lucide-react";
import { psychologistsApi } from "@/api/psychologists.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { RatingStars } from "@/components/shared/RatingStars";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { dayLabels, modalityLabels } from "@/lib/constants";
import { usePsychologistAvailability } from "@/features/availability/useAvailability";
import { useReviews } from "@/features/reviews/useReviews";

export function PsychologistDetailPage() {
  const { id } = useParams();
  const psychologist = useQuery({ queryKey: ["psychologists", id], queryFn: () => psychologistsApi.byId(id!), enabled: Boolean(id) });
  const availability = usePsychologistAvailability(id);
  const reviews = useReviews(id);

  if (psychologist.isLoading) return <LoadingState />;
  if (psychologist.isError || !psychologist.data) return <ErrorState />;

  const profile = psychologist.data;
  return (
    <>
      <PageHeader
        title={profile.user?.name ?? "Psicólogo"}
        description={profile.professionalTitle ?? "Perfil profesional"}
        action={
          <Button asChild>
            <Link to={`/patient/appointments/new/${profile.id}`}>
              <Calendar className="h-4 w-4" /> Reservar sesión
            </Link>
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Información profesional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RatingStars value={profile.rating} />
            <p className="text-sm text-muted-foreground">{profile.bio ?? "Bio profesional pendiente de completar."}</p>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div>Años de experiencia: {profile.yearsOfExperience ?? 0}</div>
              <div>Ciudad: {profile.city ?? "No indicada"}</div>
              <div>Tarifa: <MoneyDisplay value={profile.sessionPrice} /></div>
              <div>Modalidades: {profile.modalities?.map((m) => modalityLabels[m]).join(", ")}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.specialties?.map((specialty) => <Badge key={specialty} variant="secondary">{specialty}</Badge>)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Disponibilidad</CardTitle>
          </CardHeader>
          <CardContent>
            {availability.isLoading ? <LoadingState /> : availability.data?.length ? (
              <div className="space-y-2">
                {availability.data.map((item) => (
                  <div key={item.id} className="rounded-md border p-3 text-sm">
                    <div className="font-medium">{dayLabels[item.dayOfWeek]}</div>
                    <div className="text-muted-foreground">{item.startTime} - {item.endTime} · {modalityLabels[item.modality]}</div>
                  </div>
                ))}
              </div>
            ) : <EmptyState title="Sin disponibilidad publicada" />}
          </CardContent>
        </Card>
      </div>
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
        {reviews.data?.length ? <div className="grid gap-4 md:grid-cols-2">{reviews.data.map((review) => <ReviewCard key={review.id} review={review} />)}</div> : <EmptyState title="Aún no hay reseñas" />}
      </section>
    </>
  );
}

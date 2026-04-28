import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { usePsychologistProfile } from "@/features/psychologist/usePsychologistProfile";
import { useReviews } from "@/features/reviews/useReviews";

export function PsychologistReviewsPage() {
  const profile = usePsychologistProfile();
  const reviews = useReviews(profile.data?.id);

  if (profile.isLoading || reviews.isLoading) return <LoadingState />;
  if (profile.isError || reviews.isError) return <ErrorState />;

  const data = reviews.data ?? [];
  return (
    <>
      <PageHeader title="Reviews recibidas" description="Retroalimentación visible para futuros pacientes." />
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <MetricCard title="Rating promedio" value={(profile.data?.rating ?? 0).toFixed(1)} />
        <MetricCard title="Total reviews" value={profile.data?.totalReviews ?? data.length} />
      </div>
      {data.length ? <div className="grid gap-4 md:grid-cols-2">{data.map((review) => <ReviewCard key={review.id} review={review} />)}</div> : <EmptyState title="Aún no has recibido reseñas" />}
    </>
  );
}

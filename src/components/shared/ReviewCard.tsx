import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RatingStars } from "@/components/shared/RatingStars";
import { formatDate } from "@/lib/formatters";
import type { Review } from "@/types/api.types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{review.patient?.user?.name ?? "Paciente"}</CardTitle>
        <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
      </CardHeader>
      <CardContent>
        <RatingStars value={review.rating} />
        {review.comment ? <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p> : null}
      </CardContent>
    </Card>
  );
}

import { Calendar, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { RatingStars } from "@/components/shared/RatingStars";
import { modalityLabels } from "@/lib/constants";
import type { MatchingRecommendation, PsychologistProfile } from "@/types/api.types";

export function PsychologistCard({ psychologist, recommendation }: { psychologist: PsychologistProfile; recommendation?: MatchingRecommendation }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{psychologist.user?.name ?? "Psicólogo"}</CardTitle>
        <div className="text-sm text-muted-foreground">{psychologist.professionalTitle ?? psychologist.city ?? "Perfil profesional"}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {psychologist.specialties?.slice(0, 4).map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div>Modalidad: {psychologist.modalities?.map((m) => modalityLabels[m]).join(", ") || "Por definir"}</div>
          <div>Ciudad: {psychologist.city ?? "No indicada"}</div>
          <div>
            Tarifa: <MoneyDisplay value={psychologist.sessionPrice} />
          </div>
        </div>
        <RatingStars value={psychologist.rating} />
        {recommendation ? (
          <div className="rounded-md bg-accent p-3 text-sm">
            <div className="font-medium">Match {Math.round(recommendation.score)}%</div>
            <ul className="mt-1 list-disc pl-4 text-muted-foreground">
              {recommendation.reasons.slice(0, 3).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/patient/psychologists/${psychologist.id}`}>
            <Eye className="h-4 w-4" /> Ver perfil
          </Link>
        </Button>
        <Button asChild className="flex-1">
          <Link to={`/patient/appointments/new/${psychologist.id}`}>
            <Calendar className="h-4 w-4" /> Reservar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

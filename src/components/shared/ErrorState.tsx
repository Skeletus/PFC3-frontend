import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message = "No se pudo cargar la información.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-white p-6 text-sm">
      <div className="flex items-center gap-2 font-medium text-destructive">
        <AlertTriangle className="h-4 w-4" />
        {message}
      </div>
      {onRetry ? (
        <Button className="mt-4" variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}

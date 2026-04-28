import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Cargando información" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 rounded-lg border bg-white p-8 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

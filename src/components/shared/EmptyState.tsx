import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, actionLabel, onAction }: { title: string; description?: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="rounded-lg border border-dashed bg-white p-8 text-center">
      <Search className="mx-auto h-8 w-8 text-muted-foreground" />
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      {description ? <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

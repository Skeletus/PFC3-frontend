import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ value = 0, className }: { value?: number | null; className?: string }) {
  const rounded = Math.round(value ?? 0);
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={cn("h-4 w-4", index < rounded ? "fill-primary text-primary" : "text-muted-foreground/40")} />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">{Number(value ?? 0).toFixed(1)}</span>
    </div>
  );
}

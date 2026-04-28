import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => (
  <label className="inline-flex items-center gap-2">
    <span className="relative inline-flex h-4 w-4 items-center justify-center">
      <input
        ref={ref}
        type="checkbox"
        className={cn("peer h-4 w-4 appearance-none rounded border border-input bg-white checked:bg-primary", className)}
        {...props}
      />
      <Check className="pointer-events-none absolute h-3 w-3 opacity-0 peer-checked:opacity-100" />
    </span>
  </label>
));
Checkbox.displayName = "Checkbox";

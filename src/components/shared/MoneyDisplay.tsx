import { formatMoney } from "@/lib/formatters";

export function MoneyDisplay({ value, className }: { value?: number | null; className?: string }) {
  return <span className={className}>{formatMoney(value)}</span>;
}

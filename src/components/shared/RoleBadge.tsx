import { Badge } from "@/components/ui/badge";
import { roleLabels } from "@/lib/constants";
import type { UserRole } from "@/types/api.types";

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge variant="secondary">{roleLabels[role]}</Badge>;
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { psychologistsApi } from "@/api/psychologists.api";
import { getErrorMessage } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { RatingStars } from "@/components/shared/RatingStars";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAdminPsychologists } from "@/features/admin/useAdminDashboard";
import type { PsychologistProfile } from "@/types/api.types";

export function AdminPsychologistsPage() {
  const psychologists = useAdminPsychologists();
  const queryClient = useQueryClient();
  const verify = useMutation({
    mutationFn: psychologistsApi.verifyAdmin,
    onSuccess: () => {
      toast.success("Psicólogo verificado");
      queryClient.invalidateQueries({ queryKey: ["admin", "psychologists"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (psychologists.isLoading) return <LoadingState />;
  if (psychologists.isError) return <ErrorState />;

  return (
    <>
      <PageHeader title="Gestión de psicólogos" />
      <DataTable<PsychologistProfile>
        data={psychologists.data ?? []}
        columns={[
          { header: "Nombre", cell: (item) => item.user?.name ?? "Psicólogo" },
          { header: "Email", cell: (item) => item.user?.email ?? "-" },
          { header: "Especialidades", cell: (item) => item.specialties?.join(", ") || "-" },
          { header: "Ciudad", cell: (item) => item.city ?? "-" },
          { header: "Precio", cell: (item) => <MoneyDisplay value={item.sessionPrice} /> },
          { header: "Rating", cell: (item) => <RatingStars value={item.rating} /> },
          { header: "Verificación", cell: (item) => <StatusBadge status={item.isVerified ? "VERIFIED" : "UNVERIFIED"} /> },
          { header: "Acción", cell: (item) => item.isVerified ? "Verificado" : <Button size="sm" onClick={() => verify.mutate(item.id)}>Verificar</Button> },
        ]}
      />
    </>
  );
}

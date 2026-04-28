import { DataTable } from "@/components/shared/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatDate } from "@/lib/formatters";
import { useAdminPatients } from "@/features/admin/useAdminDashboard";
import type { PatientProfile } from "@/types/api.types";

export function AdminPatientsPage() {
  const patients = useAdminPatients();
  if (patients.isLoading) return <LoadingState />;
  if (patients.isError) return <ErrorState />;
  return (
    <>
      <PageHeader title="Gestión de pacientes" />
      <DataTable<PatientProfile>
        data={patients.data ?? []}
        columns={[
          { header: "Nombre", cell: (item) => item.user?.name ?? "Paciente" },
          { header: "Email", cell: (item) => item.user?.email ?? "-" },
          { header: "Teléfono", cell: (item) => item.user?.phone ?? "-" },
          { header: "Ciudad", cell: (item) => item.city ?? "-" },
          { header: "Registro", cell: (item) => formatDate(item.user?.createdAt) },
          { header: "Estado", cell: (item) => item.user?.isActive === false ? "Inactivo" : "Activo" },
        ]}
      />
    </>
  );
}

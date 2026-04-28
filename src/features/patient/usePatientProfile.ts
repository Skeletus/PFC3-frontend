import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/axios";
import { patientsApi } from "@/api/patients.api";
import type { PatientProfile } from "@/types/api.types";

export function usePatientProfile() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["patient-profile"], queryFn: patientsApi.me });
  const update = useMutation({
    mutationFn: (payload: Partial<PatientProfile>) => patientsApi.updateMe(payload),
    onSuccess: () => {
      toast.success("Perfil actualizado");
      queryClient.invalidateQueries({ queryKey: ["patient-profile"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  return { ...query, update };
}

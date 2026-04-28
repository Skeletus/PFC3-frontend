import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/axios";
import { psychologistsApi } from "@/api/psychologists.api";
import type { PsychologistProfile } from "@/types/api.types";

export function usePsychologistProfile() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["psychologist-profile"], queryFn: psychologistsApi.me });
  const update = useMutation({
    mutationFn: (payload: Partial<PsychologistProfile>) => psychologistsApi.updateMe(payload),
    onSuccess: () => {
      toast.success("Perfil profesional actualizado");
      queryClient.invalidateQueries({ queryKey: ["psychologist-profile"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  return { ...query, update };
}

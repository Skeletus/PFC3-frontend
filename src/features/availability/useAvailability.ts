import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { availabilityApi } from "@/api/availability.api";
import { getErrorMessage } from "@/api/axios";
import type { Availability } from "@/types/api.types";

export function useAvailability() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["availability", "me"], queryFn: availabilityApi.me });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["availability"] });
  return {
    ...query,
    create: useMutation({
      mutationFn: (payload: Omit<Availability, "id">) => availabilityApi.create(payload),
      onSuccess: () => {
        toast.success("Disponibilidad creada");
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<Availability> }) => availabilityApi.update(id, payload),
      onSuccess: () => {
        toast.success("Disponibilidad actualizada");
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
    remove: useMutation({
      mutationFn: availabilityApi.remove,
      onSuccess: () => {
        toast.success("Disponibilidad eliminada");
        invalidate();
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    }),
  };
}

export function usePsychologistAvailability(psychologistId?: string) {
  return useQuery({
    queryKey: ["availability", "psychologist", psychologistId],
    queryFn: () => availabilityApi.byPsychologist(psychologistId!),
    enabled: Boolean(psychologistId),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { appointmentsApi } from "@/api/appointments.api";
import { getErrorMessage } from "@/api/axios";
import type { CreateAppointmentPayload } from "@/types/api.types";

export function useAppointments() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["appointments", "me"], queryFn: appointmentsApi.me });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["appointments"] });
  const create = useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => appointmentsApi.create(payload),
    onSuccess: () => {
      toast.success("Cita creada");
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  const confirm = useMutation({
    mutationFn: appointmentsApi.confirm,
    onSuccess: () => {
      toast.success("Cita confirmada");
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  const cancel = useMutation({
    mutationFn: appointmentsApi.cancel,
    onSuccess: () => {
      toast.success("Cita cancelada");
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  const complete = useMutation({
    mutationFn: appointmentsApi.complete,
    onSuccess: () => {
      toast.success("Cita completada");
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  return {
    ...query,
    create,
    confirm,
    cancel,
    complete,
  };
}

export function useAppointment(id?: string) {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => appointmentsApi.byId(id!),
    enabled: Boolean(id),
  });
}

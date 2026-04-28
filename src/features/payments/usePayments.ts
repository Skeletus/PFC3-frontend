import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/axios";
import { paymentsApi } from "@/api/payments.api";

export function usePayment(appointmentId?: string) {
  return useQuery({
    queryKey: ["payments", appointmentId],
    queryFn: () => paymentsApi.byAppointment(appointmentId!),
    enabled: Boolean(appointmentId),
    retry: false,
  });
}

export function useSimulatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.simulate,
    onSuccess: (_, appointmentId) => {
      toast.success("Pago simulado correctamente");
      queryClient.invalidateQueries({ queryKey: ["payments", appointmentId] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

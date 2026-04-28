import { apiClient } from "@/api/axios";
import { normalizePayment } from "@/api/normalizers";
import type { Payment } from "@/types/api.types";

export const paymentsApi = {
  byAppointment: async (appointmentId: string) =>
    normalizePayment((await apiClient.get<Payment | null>(`/payments/appointment/${appointmentId}`)).data) as Payment,
  simulate: async (appointmentId: string) =>
    normalizePayment((await apiClient.post<Payment>(`/payments/simulate/${appointmentId}`)).data) as Payment,
};

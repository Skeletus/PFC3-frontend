import { apiClient } from "@/api/axios";
import { normalizeAppointment } from "@/api/normalizers";
import type { Appointment, CreateAppointmentPayload } from "@/types/api.types";

export const appointmentsApi = {
  me: async () => (await apiClient.get<Appointment[]>("/appointments/me")).data.map(normalizeAppointment),
  byId: async (id: string) => normalizeAppointment((await apiClient.get<Appointment>(`/appointments/${id}`)).data),
  create: async (payload: CreateAppointmentPayload) => normalizeAppointment((await apiClient.post<Appointment>("/appointments", payload)).data),
  confirm: async (id: string) => normalizeAppointment((await apiClient.patch<Appointment>(`/appointments/${id}/confirm`)).data),
  cancel: async (id: string) => normalizeAppointment((await apiClient.patch<Appointment>(`/appointments/${id}/cancel`, {})).data),
  complete: async (id: string) => normalizeAppointment((await apiClient.patch<Appointment>(`/appointments/${id}/complete`)).data),
};

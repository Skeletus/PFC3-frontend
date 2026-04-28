import { apiClient } from "@/api/axios";
import type { Availability } from "@/types/api.types";

export const availabilityApi = {
  me: async () => (await apiClient.get<Availability[]>("/availability/me")).data,
  byPsychologist: async (psychologistId: string) =>
    (await apiClient.get<Availability[]>(`/availability/psychologist/${psychologistId}`)).data,
  create: async (payload: Omit<Availability, "id">) =>
    (await apiClient.post<Availability>("/availability", payload)).data,
  update: async (id: string, payload: Partial<Availability>) =>
    (await apiClient.patch<Availability>(`/availability/${id}`, payload)).data,
  remove: async (id: string) => (await apiClient.delete<void>(`/availability/${id}`)).data,
};

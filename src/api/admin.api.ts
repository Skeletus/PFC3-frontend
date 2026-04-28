import { apiClient } from "@/api/axios";
import {
  normalizeAppointment,
  normalizeDashboard,
  normalizePatientProfile,
  normalizePsychologistProfile,
  normalizeRevenue,
  unwrapPaginated,
} from "@/api/normalizers";
import type { AdminDashboardMetrics, AdminRevenue, Appointment, PatientProfile, PsychologistProfile } from "@/types/api.types";

export const adminApi = {
  dashboard: async () => normalizeDashboard((await apiClient.get<AdminDashboardMetrics>("/admin/dashboard")).data),
  patients: async () => unwrapPaginated((await apiClient.get<PatientProfile[] | { data: PatientProfile[] }>("/admin/patients")).data).map(normalizePatientProfile),
  psychologists: async () =>
    unwrapPaginated((await apiClient.get<PsychologistProfile[] | { data: PsychologistProfile[] }>("/admin/psychologists")).data).map(normalizePsychologistProfile),
  appointments: async () => unwrapPaginated((await apiClient.get<Appointment[] | { data: Appointment[] }>("/admin/appointments")).data).map(normalizeAppointment),
  revenue: async () => normalizeRevenue((await apiClient.get<AdminRevenue>("/admin/revenue")).data),
};

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";

export function useAdminDashboard() {
  return useQuery({ queryKey: ["admin", "dashboard"], queryFn: adminApi.dashboard });
}

export function useAdminPatients() {
  return useQuery({ queryKey: ["admin", "patients"], queryFn: adminApi.patients });
}

export function useAdminPsychologists() {
  return useQuery({ queryKey: ["admin", "psychologists"], queryFn: adminApi.psychologists });
}

export function useAdminAppointments() {
  return useQuery({ queryKey: ["admin", "appointments"], queryFn: adminApi.appointments });
}

export function useAdminRevenue() {
  return useQuery({ queryKey: ["admin", "revenue"], queryFn: adminApi.revenue });
}

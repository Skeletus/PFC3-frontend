import { apiClient } from "@/api/axios";
import { normalizePatientProfile } from "@/api/normalizers";
import type { PatientProfile } from "@/types/api.types";

export const patientsApi = {
  me: async () => normalizePatientProfile((await apiClient.get<PatientProfile>("/patients/me/profile")).data),
  updateMe: async (payload: Partial<PatientProfile>) => {
    const { dateOfBirth, minBudget, maxBudget, ...rest } = payload;
    return normalizePatientProfile(
      (await apiClient.patch<PatientProfile>("/patients/me/profile", {
        ...rest,
        birthDate: dateOfBirth,
        budgetMin: minBudget,
        budgetMax: maxBudget,
      })).data,
    );
  },
};

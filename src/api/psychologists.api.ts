import { apiClient } from "@/api/axios";
import { normalizePsychologistProfile } from "@/api/normalizers";
import type { PsychologistProfile } from "@/types/api.types";

export const psychologistsApi = {
  me: async () => normalizePsychologistProfile((await apiClient.get<PsychologistProfile>("/psychologists/me/profile")).data),
  updateMe: async (payload: Partial<PsychologistProfile>) => {
    const { yearsOfExperience, ...rest } = payload;
    return normalizePsychologistProfile(
      (await apiClient.patch<PsychologistProfile>("/psychologists/me/profile", {
        ...rest,
        experienceYears: yearsOfExperience,
      })).data,
    );
  },
  byId: async (id: string) => normalizePsychologistProfile((await apiClient.get<PsychologistProfile>(`/psychologists/${id}`)).data),
  verifyAdmin: async (id: string) =>
    normalizePsychologistProfile((await apiClient.patch<PsychologistProfile>(`/psychologists/${id}/verify/admin`)).data),
};

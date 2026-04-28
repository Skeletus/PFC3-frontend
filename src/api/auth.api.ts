import { apiClient } from "@/api/axios";
import { normalizeUser } from "@/api/normalizers";
import type { AuthResponse, LoginPayload, RegisterPatientPayload, RegisterPsychologistPayload, User } from "@/types/api.types";

const normalizeAuth = (response: AuthResponse): AuthResponse => ({
  accessToken: response.accessToken,
  user: normalizeUser(response.user),
});

export const authApi = {
  login: async (payload: LoginPayload) => normalizeAuth((await apiClient.post<AuthResponse>("/auth/login", payload)).data),
  registerPatient: async (payload: RegisterPatientPayload) => {
    const { name, ...rest } = payload;
    return normalizeAuth((await apiClient.post<AuthResponse>("/auth/register/patient", { ...rest, fullName: payload.fullName ?? name })).data);
  },
  registerPsychologist: async (payload: RegisterPsychologistPayload) => {
    const { name, ...rest } = payload;
    return normalizeAuth((await apiClient.post<AuthResponse>("/auth/register/psychologist", { ...rest, fullName: payload.fullName ?? name })).data);
  },
  me: async () => normalizeUser((await apiClient.get<User>("/auth/me")).data),
};

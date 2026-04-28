import { apiClient } from "@/api/axios";
import { normalizeUser } from "@/api/normalizers";
import type { User } from "@/types/api.types";

export const usersApi = {
  me: async () => normalizeUser((await apiClient.get<User>("/auth/me")).data),
};

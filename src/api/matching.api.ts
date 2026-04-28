import { apiClient } from "@/api/axios";
import { normalizeRecommendation } from "@/api/normalizers";
import type { MatchingRecommendation, MatchingRequest } from "@/types/api.types";

export const matchingApi = {
  fromProfile: async () =>
    (await apiClient.post<MatchingRecommendation[]>("/matching/recommendations/from-profile")).data.map(normalizeRecommendation),
  recommendations: async (payload: MatchingRequest) =>
    (await apiClient.post<MatchingRecommendation[]>("/matching/recommendations", {
      mainConcern: payload.mainConcern,
      urgencyLevel: payload.urgencyLevel,
      preferredModality: payload.modality,
      preferredSchedule: payload.preferredSchedule,
      city: payload.city,
      budgetMin: payload.minBudget,
      budgetMax: payload.maxBudget,
    })).data.map(normalizeRecommendation),
};

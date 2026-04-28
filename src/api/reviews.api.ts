import { apiClient } from "@/api/axios";
import { normalizeReview } from "@/api/normalizers";
import type { CreateReviewPayload, Review } from "@/types/api.types";

export const reviewsApi = {
  byPsychologist: async (psychologistId: string) =>
    (await apiClient.get<Review[]>(`/reviews/psychologist/${psychologistId}`)).data.map(normalizeReview),
  create: async (payload: CreateReviewPayload) => normalizeReview((await apiClient.post<Review>("/reviews", {
    appointmentId: payload.appointmentId,
    rating: payload.rating,
    comment: payload.comment,
  })).data),
};

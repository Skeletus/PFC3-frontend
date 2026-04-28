import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/axios";
import { reviewsApi } from "@/api/reviews.api";
import type { CreateReviewPayload } from "@/types/api.types";

export function useReviews(psychologistId?: string) {
  return useQuery({
    queryKey: ["reviews", psychologistId],
    queryFn: () => reviewsApi.byPsychologist(psychologistId!),
    enabled: Boolean(psychologistId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewsApi.create(payload),
    onSuccess: () => {
      toast.success("Reseña enviada");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

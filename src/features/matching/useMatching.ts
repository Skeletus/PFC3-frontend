import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/axios";
import { matchingApi } from "@/api/matching.api";
import type { MatchingRequest } from "@/types/api.types";

export function useMatching() {
  const fromProfile = useMutation({
    mutationFn: matchingApi.fromProfile,
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  const manual = useMutation({
    mutationFn: (payload: MatchingRequest) => matchingApi.recommendations(payload),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  return { fromProfile, manual };
}

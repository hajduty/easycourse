import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddRating, GetCourseRating, UpdateRating } from "../api";
import type { Rating } from "@/types/rating";

const ratingKeys = {
  course: (entityId: string) => ["rating", "course", entityId] as const,
};

export const useCourseRating = (entityId: string | null, userId: string | undefined) => {
  return useQuery({
    queryKey: entityId ? ratingKeys.course(entityId) : ["rating", "course", "null"],
    queryFn: () => {
      if (!entityId) throw new Error("No entityId provided");
      return GetCourseRating(entityId, userId!);
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
    enabled: !!entityId && !!userId,
    staleTime: 1000 * 60, // 1 minute
    refetchOnMount: false,
  });
};

export const useAddRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rating: Rating) => AddRating(rating),
    onSuccess: (res) => {
      const entityId = res.data.entityId;
      if (entityId) {
        queryClient.invalidateQueries({ queryKey: ratingKeys.course(entityId) });
      }
    },
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rating: Rating) => UpdateRating(rating),
    onSuccess: (res) => {
      const entityId = res.data.entityId;
      if (entityId) {
        queryClient.invalidateQueries({ queryKey: ratingKeys.course(entityId) });
      }
    },
  });
};

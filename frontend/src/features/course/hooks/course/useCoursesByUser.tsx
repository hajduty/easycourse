import { useQuery } from "@tanstack/react-query";
import { GetCoursesByUserId } from "../../api";

export const useCoursesByUser = (userId?: string) => {
  return useQuery({
    queryKey: ["course", userId],
    queryFn: () => GetCoursesByUserId(userId!),
    enabled: Boolean(userId),
    staleTime: 1000 * 60,
  });
};

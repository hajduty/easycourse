import { useQuery } from "@tanstack/react-query";
import { GetCoursesByUserId } from "../../api";

export const useCoursesByUser = (courseId?: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => GetCoursesByUserId(courseId!),
    enabled: Boolean(courseId),
    staleTime: 1000 * 60,
  });
};

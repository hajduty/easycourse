import { useQuery } from "@tanstack/react-query";
import { GetCourseById } from "../api";

export const useCourse = (courseId?: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => GetCourseById(courseId!),
    enabled: Boolean(courseId),
    staleTime: 1000 * 60,
  });
};

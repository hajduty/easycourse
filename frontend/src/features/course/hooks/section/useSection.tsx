import { useQuery } from "@tanstack/react-query";
import { GetSections } from "../../api";

export const useSections = (courseId?: string) => {
  return useQuery({
    queryKey: ["sections", courseId],
    queryFn: async () => {
      const res = await GetSections(courseId!);
      return res.data;
    },
    enabled: Boolean(courseId),
    staleTime: 1000 * 60,
  });
};
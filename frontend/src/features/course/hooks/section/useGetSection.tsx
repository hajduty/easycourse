import { useQuery } from "@tanstack/react-query";
import { GetSection } from "../../api";

export const useSection = (courseId?: string, sectionId?: string) => {
  return useQuery({
    queryKey: ["section", sectionId],
    queryFn: async () => {
      const res = await GetSection(courseId!, sectionId!);
      return res.data;
    },
    enabled: Boolean(courseId),
    staleTime: 1000 * 60,
  });
};
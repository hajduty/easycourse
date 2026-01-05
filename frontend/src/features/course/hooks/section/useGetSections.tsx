import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetSections } from "../../api";

export const useSections = (courseId?: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["sections-fetch", courseId],
    queryFn: async () => {
      const res = await GetSections(courseId!);
      const sections = res.data;

      sections.forEach((section: any) => {
        queryClient.setQueryData(["section", section.sectionId], section);
      });

      return sections;
    },
    enabled: Boolean(courseId),
    staleTime: 1000 * 60,
    refetchOnMount: false,
  });
};

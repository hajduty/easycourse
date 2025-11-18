import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteSection } from "../../api";
import type { Section } from "@/types/section";

export const useDeleteSection = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) => DeleteSection(sectionId, courseId),
    onSuccess: (_data, sectionId) => {
      // Remove section from cached list
      queryClient.setQueryData<Section[]>(["sections-fetch", courseId], (old) =>
        old?.filter((s) => s.sectionId !== sectionId)
      );
      // Remove individual section cache
      queryClient.removeQueries({ queryKey: ["section", sectionId] });
    },
    onError: (error) => {
      console.error("Failed to delete section:", error);
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteSection } from "../../api";

export const useDeleteSection = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) => DeleteSection(sectionId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["sections", courseId]});
    },
    onError: (error) => {
      console.error("Failed to delete section:", error);
    },
  });
};
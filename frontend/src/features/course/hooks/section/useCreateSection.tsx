import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateSection } from "../../api";
import type { ApiResponse } from "@/types/apiResponse";
import type { Section } from "@/types/section";

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Section>, unknown, Section>({
    mutationFn: async (payload) => await CreateSection(payload),
    onSuccess: (data) => {
      const courseId = data.data.courseId!;
      // Add new section to cached array
      queryClient.setQueryData<Section[]>(["sections-fetch", courseId], (old) => [
        ...(old || []),
        data.data,
      ]);
      // Cache individual section
      queryClient.setQueryData(["section", data.data.sectionId], data.data);
    },
  });
};

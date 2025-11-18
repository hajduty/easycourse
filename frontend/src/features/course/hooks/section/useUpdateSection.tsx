import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateSection } from "../../api";
import type { ApiResponse } from "@/types/apiResponse";
import type { Section } from "@/types/section";

type UpdateSectionVariables = {
  data: Section;
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Section>, unknown, UpdateSectionVariables>({
    mutationFn: async ({ data }) => UpdateSection(data, data.courseId!),
    onSuccess: (res, { data }) => {
      const courseId = data.courseId!;
      // Update section in cached array
      queryClient.setQueryData<Section[]>(["sections-fetch", courseId], (old) =>
        old?.map((s) => (s.sectionId === data.sectionId ? res.data : s))
      );
      // Update individual section
      queryClient.setQueryData(["section", data.sectionId], res.data);
    },
  });
};

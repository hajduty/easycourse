import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateSection } from "../../api";
import type { ApiResponse } from "@/types/apiResponse";
import type { Section } from "@/types/section";

type UpdateSectionVariables = {
  sectionId: string;
  courseId: string;
  data: any;
};

export const useUpdateSection = () => {
  const qc = useQueryClient();

  return useMutation<ApiResponse<Section>, unknown, UpdateSectionVariables>({
    mutationFn: async ({ courseId, data }) => {
      return await UpdateSection(data, courseId);
    },
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: ["sections", courseId] });
    },
  });
};

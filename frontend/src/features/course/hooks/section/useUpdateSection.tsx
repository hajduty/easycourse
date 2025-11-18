import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateSection } from "../../api";
import type { ApiResponse } from "@/types/apiResponse";
import type { Section } from "@/types/section";

type UpdateSectionVariables = {
  data: Section;
};

export const useUpdateSection = () => {
  const qc = useQueryClient();

  return useMutation<ApiResponse<Section>, unknown, UpdateSectionVariables>({
    mutationFn: async ({ data }) => {
      return await UpdateSection(data, data.courseId!);
    },
    onSuccess: (_, { data }) => {
      qc.invalidateQueries({ queryKey: ["section", data.sectionId] });
    },
  });
};

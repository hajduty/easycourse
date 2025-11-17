import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateSection } from "../api";
import type { ApiResponse } from "@/types/apiResponse";
import type { Section } from "@/types/section";

export const useCreateSection = () => {
  const qc = useQueryClient();

  return useMutation<ApiResponse<Section>, unknown, Section>({
    mutationFn: async (payload) => await CreateSection(payload),
    onSuccess: (_, payload) => {
      qc.invalidateQueries({
        queryKey: ["sections", payload.courseId],
      });
    }
  });
};
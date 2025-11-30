import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCourse } from "../../api";
import type { CourseRequest, CourseResponse } from "@/types/course";
import type { ApiResponse } from "@/types/apiResponse";

type UpdateCourseVariables = {
  courseId: string;
  data: CourseRequest;
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();

  return useMutation<ApiResponse<CourseResponse>, unknown, UpdateCourseVariables>({
    mutationFn: async ({ courseId, data }) => {
      return await UpdateCourse(data, courseId);
    },
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
};

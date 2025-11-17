import { useMutation } from "@tanstack/react-query";
import { CreateCourse } from "../api";
import type { CourseRequest, CourseResponse } from "@/types/course";
import type { ApiResponse } from "@/types/apiResponse";

export const useCreateCourse = () => {
  return useMutation<ApiResponse<CourseResponse>, unknown, CourseRequest>({
    mutationFn: async (payload) => await CreateCourse(payload)
  });
};

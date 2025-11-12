import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { CourseResponse } from "@/types/course";
import type { CourseQuery } from "@/types/courseQuery";
import type { PagedResponse } from "@/types/pagedResponse";

export const GetCourses = async (query?: CourseQuery): Promise<ApiResponse<PagedResponse<CourseResponse>>> => {
  const { data } = await apiClient.get<ApiResponse<PagedResponse<CourseResponse>>>("/course", {
    params: query
  });

  return data;
};
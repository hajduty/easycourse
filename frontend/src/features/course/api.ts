import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { CourseResponse } from "@/types/course";
import type { CourseQuery } from "@/types/courseQuery";
import type { PagedResponse } from "@/types/pagedResponse";
import type { Section } from "@/types/section";

export const GetCourses = async (query?: CourseQuery): Promise<ApiResponse<PagedResponse<CourseResponse>>> => {
  const { data } = await apiClient.get<ApiResponse<PagedResponse<CourseResponse>>>("/course", {
    params: query
  });
  return data;
};

export const GetCoursesByUserId = async (userId: string): Promise<ApiResponse<CourseResponse[]>> => {
  const { data } = await apiClient.get<ApiResponse<CourseResponse[]>>(`/course/user/${userId}`);
  return data;
}

export const GetSections = async (courseId: string): Promise<ApiResponse<Section[]>> => {
  const { data } = await apiClient.get<ApiResponse<Section[]>>(`/course/${courseId}/section`);
  return data;
}

export const GetCourseById = async (courseId: string): Promise<ApiResponse<CourseResponse>> => {
  const { data } = await apiClient.get<ApiResponse<CourseResponse>>(`/course/${courseId}`);
  return data;
}
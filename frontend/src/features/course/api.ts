import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { CourseRequest, CourseResponse } from "@/types/course";
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

export const CreateSection = async (section: Section): Promise<ApiResponse<Section>> => {
  const { data } = await apiClient.post(`/course/${section.courseId}/section`, section);
  return data;
}

export const GetCourseById = async (courseId: string): Promise<ApiResponse<CourseResponse>> => {
  const { data } = await apiClient.get<ApiResponse<CourseResponse>>(`/course/${courseId}`);
  return data;
}

export const CreateCourse = async (course: CourseRequest): Promise<ApiResponse<CourseResponse>> => {
  const { data } = await apiClient.post<ApiResponse<CourseResponse>>("/course", course);
  return data;
}

export const UpdateCourse = async (course: CourseRequest, courseId: string): Promise<ApiResponse<CourseResponse>> => {
  const { data } = await apiClient.put<ApiResponse<CourseResponse>>(`/course/${courseId}`, course);
  return data;
}

export const UpdateSection = async (section: Section, courseId: string): Promise<ApiResponse<Section>> => {
  const { data } = await apiClient.put<ApiResponse<Section>>(`/course/${courseId}/${section.sectionId}`, section);
  return data;
}

export const DeleteSection = async (sectionId: string, courseId: string): Promise<ApiResponse<Section>> => {
  const {data} = await apiClient.delete<ApiResponse<Section>>(`/course/${courseId}/section/${sectionId}`);
  return data;
}
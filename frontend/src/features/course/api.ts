import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { CourseRequest, CourseResponse } from "@/types/course";
import type { CourseQuery } from "@/types/courseQuery";
import type { PagedResponse } from "@/types/pagedResponse";
import type { ParticipantResponse, ParticipateRequest } from "@/types/participant";
import type { Section } from "@/types/section";

export const GetCourses = async (query?: CourseQuery): Promise<ApiResponse<PagedResponse<CourseResponse>>> => {
  const { data } = await apiClient.get<ApiResponse<PagedResponse<CourseResponse>>>("/course", {
    params: query
  });
  return data;
};

export const GetCoursesByUserId = async (userId: string): Promise<ApiResponse<CourseResponse[]>> => {
  const { data } = await apiClient.get<ApiResponse<CourseResponse[]>>(`/user/${userId}/courses`);
  return data;
}

export const GetSections = async (courseId: string): Promise<ApiResponse<Section[]>> => {
  const { data } = await apiClient.get<ApiResponse<Section[]>>(`/course/${courseId}/section`);
  return data;
}

export const GetSection = async (courseId: string, sectionId: string): Promise<ApiResponse<Section>> => {
  const { data } = await apiClient.get<ApiResponse<Section>>(`/course/${courseId}/section/${sectionId}`);
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

export const DeleteCourse = async (courseId: string): Promise<ApiResponse<boolean>> => {
  const {data} = await apiClient.delete<ApiResponse<boolean>>(`/course/${courseId}`);
  return data;
}

export const UpdateSection = async (section: Section, courseId: string): Promise<ApiResponse<Section>> => {
  const { data } = await apiClient.put<ApiResponse<Section>>(`/course/${courseId}/section`, section);
  return data;
}

export const DeleteSection = async (sectionId: string, courseId: string): Promise<ApiResponse<Section>> => {
  const {data} = await apiClient.delete<ApiResponse<Section>>(`/course/${courseId}/section/${sectionId}`);
  return data;
}

export const RegisterUserAsParticipant = async (courseId: string, participantInfo: ParticipateRequest): Promise<ApiResponse<ParticipantResponse>> => {
  const {data} = await apiClient.post<ApiResponse<ParticipantResponse>>(`/course/${courseId}/participant`, participantInfo);
  return data;
}

export const RemoveUserAsParticipant = async (courseId: string, userId: string): Promise<ApiResponse<boolean>> => {
  const {data} = await apiClient.delete<ApiResponse<boolean>>(`/course/${courseId}/participant/${userId}`);
  return data;
}

export const GetParticipantInfo = async (courseId: string, userId: string): Promise<ApiResponse<ParticipantResponse>> => {
  const {data} = await apiClient.get<ApiResponse<ParticipantResponse>>(`/course/${courseId}/participant/${userId}`);
  return data;
}

export const UpdateParticipantInfo = async (courseId: string, userId: string, participantInfo: ParticipantResponse): Promise<ApiResponse<ParticipantResponse>> => {
  const { data } = await apiClient.put<ApiResponse<ParticipantResponse>>(`/course/${courseId}/participant/${userId}`, participantInfo);
  return data;
}

export const GetParticipationsByUser = async (): Promise<ApiResponse<ParticipantResponse[]>> => {
  const {data} = await apiClient.get<ApiResponse<ParticipantResponse[]>>(`/user/participations`);
  return data;
}

// move to user/api.ts
export const DeleteAccount = async (): Promise<ApiResponse<boolean>> => { 
  const { data } = await apiClient.delete<ApiResponse<boolean>>(`/user`);
  return data;
}
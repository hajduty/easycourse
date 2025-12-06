import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { Rating } from "@/types/rating";

export const AddRating = async (rating: Rating): Promise<ApiResponse<Rating>> => {
  const { data } = await apiClient.post<ApiResponse<Rating>>("/rating", rating);
  return data;
}

export const UpdateRating = async (rating: Rating): Promise<ApiResponse<Rating>> => {
  const { data } = await apiClient.put<ApiResponse<Rating>>("/rating", rating);
  return data;
}

export const GetCourseRating = async (entityId: string, userId: string): Promise<ApiResponse<Rating>> => {
  const { data } = await apiClient.get<ApiResponse<Rating>>(`/rating/course/${entityId}/user/${userId}`);
  return data;
}
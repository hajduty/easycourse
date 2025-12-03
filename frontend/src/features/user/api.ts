import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { User } from "@/types/user";

export const GetUserInfo = async (userId: string): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.get<ApiResponse<User>>(`/user/${userId}`);
  return data;
}

export const UpdateUserInfo = async (userId: string, user: Partial<User>): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.put<ApiResponse<User>>(`/user/${userId}`, user);
  return data;
}
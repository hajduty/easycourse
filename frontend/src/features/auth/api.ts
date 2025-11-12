import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { AuthResponse } from "@/types/auth";

export const sendLoginRequest = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", {
    email,
    password,
  });

  //console.log("sendlogin returns:", JSON.stringify(data));

  return data;
};

export const sendRegisterRequest = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", {
    email,
    password,
  });

  //console.log("sendRegisterRequest returns:", JSON.stringify(data));

  return data;
};
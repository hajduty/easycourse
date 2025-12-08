import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/apiResponse";
import type { Comment, CommentRequest } from "@/types/comment";

export const getCommentsForEntity = async (entityType: string, entityId: string): Promise<ApiResponse<Comment[]>> => {
  const { data } = await apiClient.get<ApiResponse<Comment[]>>(`/comment/type/${entityType}/${entityId}`);
  return data;
};

export const getComment = async (commentId: number): Promise<ApiResponse<Comment>> => {
  const { data } = await apiClient.get<ApiResponse<Comment>>(`/comment/${commentId}`);
  return data;
};

export const createComment = async (request: CommentRequest): Promise<ApiResponse<Comment>> => {
  const { data } = await apiClient.post<ApiResponse<Comment>>("/comment", request);
  return data;
};

export const updateComment = async (commentId: number, request: CommentRequest): Promise<ApiResponse<Comment>> => {
  const { data } = await apiClient.put<ApiResponse<Comment>>(`/comment/${commentId}`, request);
  return data;
};

export const deleteComment = async (commentId: number): Promise<ApiResponse<boolean>> => {
  const { data } = await apiClient.delete<ApiResponse<boolean>>(`/comment/${commentId}`);
  return data;
};

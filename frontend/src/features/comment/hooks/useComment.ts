import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, getComment, getCommentsForEntity, updateComment } from "../api";
import type { Comment, CommentRequest } from "@/types/comment";

const commentKeys = {
  entity: (entityType: string, entityId: string) => ["comment", "entity", entityType, entityId] as const,
  single: (commentId: number) => ["comment", commentId] as const,
};

export const useCommentsForEntity = (entityType: string, entityId: string) => {
  return useQuery({
    queryKey: commentKeys.entity(entityType, entityId),
    queryFn: () => getCommentsForEntity(entityType, entityId),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
    enabled: !!entityType && !!entityId,
    staleTime: 1000 * 60, // 1 minute
    refetchOnMount: false,
  });
};

export const useComment = (commentId: number) => {
  return useQuery({
    queryKey: commentKeys.single(commentId),
    queryFn: () => getComment(commentId),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
    enabled: !!commentId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CommentRequest) => createComment(request),
    onSuccess: (res) => {
      const { entityType, entityId } = res.data;
      if (entityType && entityId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.entity(entityType, entityId) });
      }
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, request }: { commentId: number; request: CommentRequest }) => updateComment(commentId, request),
    onSuccess: (res, { commentId }) => {
      const { entityType, entityId } = res.data;
      if (entityType && entityId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.entity(entityType, entityId) });
      }
      queryClient.invalidateQueries({ queryKey: commentKeys.single(commentId) });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      // Note: We don't have entity info in the delete response, so we can't selectively invalidate
      // This will invalidate all comment queries, which is acceptable for delete operations
      queryClient.invalidateQueries({ queryKey: ["comment"] });
    },
  });
};

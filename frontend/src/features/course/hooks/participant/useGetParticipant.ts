import { useQuery } from "@tanstack/react-query";
import { GetParticipantInfo } from "../../api";

export const participantKeys = {
  byCourseUser: (courseId: string, userId: string) =>
    ["participant", courseId, userId] as const,
};

export const useParticipantInfo = (courseId: string, userId: string) =>
  useQuery({
    queryKey: participantKeys.byCourseUser(courseId, userId),
    queryFn: async () => {
      try {
        return await GetParticipantInfo(courseId, userId);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!courseId && !!userId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
    staleTime: 1000 * 60,
  });

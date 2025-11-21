import { useQuery } from "@tanstack/react-query";
import { GetParticipantInfo } from "../../api";

export const participantKeys = {
  byCourseUser: (courseId: string, userId: string) =>
    ["participant", courseId, userId] as const,
};

export const useParticipantInfo = (courseId: string, userId: string) =>
  useQuery({
    queryKey: participantKeys.byCourseUser(courseId, userId),
    queryFn: () => GetParticipantInfo(courseId, userId),
    enabled: !!courseId && !!userId,
  });

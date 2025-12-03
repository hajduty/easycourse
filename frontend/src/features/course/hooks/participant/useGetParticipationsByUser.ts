import { useQuery, useQueryClient } from "@tanstack/react-query"
import { GetParticipationsByUser } from "../../api"
import type { ParticipantResponse } from "@/types/participant";
import { participantKeys } from "./useGetParticipant";

export const useGetParticipationsByUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["participations"],
    queryFn: async () => {
      const participations = await GetParticipationsByUser(userId);

      participations.data.forEach((p: ParticipantResponse) => {
        if (p.course) {
          queryClient.setQueryData(["course", p.courseId], {
            success: true,
            message: "",
            data: p.course
          });
        }

        queryClient.setQueryData(participantKeys.byCourseUser(p.courseId, p.userId),
          {
            success: true,
            message: "",
            data: p
          });
      });

      return participations;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false
  })
}
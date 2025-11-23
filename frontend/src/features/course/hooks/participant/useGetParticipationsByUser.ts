import { useQuery, useQueryClient } from "@tanstack/react-query"
import { GetParticipationsByUser } from "../../api"
import type { ParticipantResponse } from "@/types/participant";
import type { Section } from "@/types/section";
import { participantKeys } from "./useGetParticipant";

export const useGetParticipationsByUser = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["participations"],
    queryFn: async () => {
      const participations = await GetParticipationsByUser();

      participations.data.forEach((p: ParticipantResponse) => {
        if (p.course) {
          queryClient.setQueryData(["course", p.course.courseId], p.course);

          p.course.sections?.forEach((section: Section) => {
            queryClient.setQueryData(["section", section.sectionId], section);
          });

          queryClient.setQueryData(
            participantKeys.byCourseUser(p.courseId, p.userId),
            p
          );
        }
      });

      return participations;
    },
    staleTime: 1000 * 60,
  });
};

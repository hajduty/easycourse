import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ParticipateRequest } from "@/types/participant";
import { RegisterUserAsParticipant } from "../../api";
import { participantKeys } from "./useGetParticipant";

export const useRegisterParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      participantInfo,
    }: {
      courseId: string;
      userId: string;
      participantInfo: ParticipateRequest;
    }) => RegisterUserAsParticipant(courseId, participantInfo),

    onSuccess: (_, { courseId, userId }) => {
      queryClient.invalidateQueries({
        queryKey: participantKeys.byCourseUser(courseId, userId),
      });

      queryClient.invalidateQueries({
        queryKey: ["participations"],
      });
    },
  });
};

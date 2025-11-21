import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Participant } from "@/types/participant";
import { RegisterUserAsParticipant } from "../../api";
import { participantKeys } from "./useGetParticipant";

export const useRegisterParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      userId,
      participantInfo,
    }: {
      courseId: string;
      userId: string;
      participantInfo: Participant;
    }) =>
      RegisterUserAsParticipant(courseId, userId, participantInfo),

    onSuccess: (_, { courseId, userId }) =>
      queryClient.invalidateQueries({
        queryKey: participantKeys.byCourseUser(courseId, userId),
      }),
  });
};

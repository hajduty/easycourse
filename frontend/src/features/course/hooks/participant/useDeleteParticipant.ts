import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RemoveUserAsParticipant } from "../../api";
import { participantKeys } from "./useGetParticipant";

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      userId,
    }: {
      courseId: string;
      userId: string;
    }) => RemoveUserAsParticipant(courseId, userId),

    onSuccess: (_, { courseId, userId }) =>
      queryClient.invalidateQueries({
        queryKey: participantKeys.byCourseUser(courseId, userId),
      }),
  });
};

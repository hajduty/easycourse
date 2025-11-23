/* export const useRemoveParticipant = () => {
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
 */

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteCourse } from "../../api";

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => DeleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};


/* export const useCreateCourse = () => {
  return useMutation<ApiResponse<CourseResponse>, unknown, CourseRequest>({
    mutationFn: async (payload) => await CreateCourse(payload)
  });
};
 */
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

import { useMutation } from "@tanstack/react-query"
import { DeleteCourse } from "../../api";

export const useDeleteCourse = () => {
  return useMutation({
    mutationFn: ({
      courseId
    }: {
      courseId: string;
    }) => DeleteCourse(courseId)
  })
}

/* export const useCreateCourse = () => {
  return useMutation<ApiResponse<CourseResponse>, unknown, CourseRequest>({
    mutationFn: async (payload) => await CreateCourse(payload)
  });
};
 */
import type { ApiResponse } from "@/types/apiResponse";
import type { User, UserUpdate } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateUserInfo } from "../api";

type UpdateUser = {
  userId: string;
  data: UserUpdate;
};

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation<ApiResponse<User>, unknown, UpdateUser>({
    mutationFn: async ({ userId, data }) => {
      return await UpdateUserInfo(userId, data);
    },
    onSuccess: (_, { userId }) => {
      qc.invalidateQueries({ queryKey: ["user", userId] });
    }
  })
}
import { useQuery } from "@tanstack/react-query";
import { GetUserInfo } from "../api";

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => (await GetUserInfo(userId!)).data,
    enabled: Boolean(userId),
    staleTime: 1000 * 60, // 1 minute
    refetchOnMount: false,
  });
};

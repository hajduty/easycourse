import { useQuery } from "@tanstack/react-query"
import { GetParticipationsByUser } from "../../api"

export const useGetParticipationsByUser = () => {
  return useQuery({
    queryKey: ["participations"],
    queryFn: () => GetParticipationsByUser(),
    staleTime: 1000 * 60,
  })
}
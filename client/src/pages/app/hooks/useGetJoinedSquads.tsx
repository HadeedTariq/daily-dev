import { profileApi } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetJoinedSquads = () => {
  const query = useQuery({
    queryKey: ["getUserSquads"],
    queryFn: async () => {
      const { data } = await profileApi.get("/get-my-joined-squads");
      return data.squads as JoinedSquad[];
    },
  });
  return query;
};
export const useGetUserJoinedSquads = (userId: number | undefined) => {
  const query = useQuery({
    queryKey: [`getUserJoinedSquads_${userId}`],
    queryFn: async () => {
      const { data } = await profileApi.get(
        `/get-user-joined-squads?userId=${userId}`
      );
      return data.squads as JoinedSquad[];
    },
    enabled: userId !== undefined,
  });
  return query;
};

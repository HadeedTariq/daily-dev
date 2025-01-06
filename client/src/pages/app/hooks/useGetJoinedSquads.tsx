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

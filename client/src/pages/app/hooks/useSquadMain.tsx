import { useQuery } from "@tanstack/react-query";
import { squadApi } from "@/lib/axios";

import { useDispatch } from "react-redux";
import { setCurrentSquad } from "@/reducers/fullAppReducer";

export const useSquadMain = (squad_handle: string) => {
  const dispatch = useDispatch();

  const squadHandleQuery = useQuery({
    queryKey: [`squad-${squad_handle}`],
    queryFn: async () => {
      const { data } = await squadApi.get(`/details/${squad_handle}`);

      dispatch(setCurrentSquad(data));

      return data as SquadDetails;
    },
  });

  return { ...squadHandleQuery };
};

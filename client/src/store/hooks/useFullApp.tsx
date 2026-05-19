import { postApi } from "@/lib/axios";
import { StoreState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useFullApp = () => {
  const fullApp = useSelector((state: StoreState) => state.fullAppReducer);
  return { ...fullApp };
};

export const useGetMyPostDetails = (id: number) => {
  let queryKey = `get-my-post-details-${id}`;
  let url = `/get-my-post/details/${id}`;
  const result = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data } = await postApi.get(url);
      return data as TGetMyPostDetailsResponse;
    },
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnMount: true,
  });

  return result;
};

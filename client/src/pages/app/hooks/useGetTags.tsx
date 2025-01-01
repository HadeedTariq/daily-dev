import { postApi } from "@/lib/axios";
import { setTags } from "@/reducers/fullAppReducer";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useGetTags = () => {
  const dispatch = useDispatch();

  const queryData = useQuery({
    queryKey: ["getTags"],
    queryFn: async () => {
      const { data } = await postApi.get("/tags");
      dispatch(setTags(data.tags));
      return data.tags as Tag[];
    },
    refetchOnMount: false,
  });
  return { ...queryData };
};

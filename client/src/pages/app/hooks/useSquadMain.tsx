import { useQuery } from "@tanstack/react-query";
import { squadApi } from "@/lib/axios";

import { useGetTags } from "../hooks/useGetTags";
import { useDispatch } from "react-redux";
import { setCurrentSquad } from "@/reducers/fullAppReducer";
import { useFullApp } from "@/store/hooks/useFullApp";

export const useSquadMain = (squad_handle: string) => {
  const dispatch = useDispatch();
  const { tags } = useFullApp();
  const { refetch: tagRefetching, isRefetching: isTagRefetching } =
    useGetTags();

  const squadHandleQuery = useQuery({
    queryKey: [`squad-${squad_handle}`],
    queryFn: async () => {
      const { data } = await squadApi.get(`/details/${squad_handle}`);
      if (data.squad_posts) {
        const postsData = data.squad_posts.map((post: any) => {
          const postTagIds = post.post_tags;
          const postTags = postTagIds.map((postTagId: number) => {
            const tag = tags?.find((t) => t.id === postTagId);
            return `#${tag?.name.split(" ").join("-").toLowerCase()}`;
          });
          post.post_tags = postTags;
          return post;
        });
        data.squad_posts = postsData;
      }

      dispatch(setCurrentSquad(data));
      console.log(data);

      return data as SquadDetails;
    },
    enabled: tags ? true : false,
  });

  return { ...squadHandleQuery, tagRefetching, isTagRefetching };
};

import { postApi } from "@/lib/axios";
import { setPosts } from "@/reducers/fullAppReducer";
import { useFullApp } from "@/store/hooks/useFullApp";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useGetPosts = () => {
  const dispatch = useDispatch();
  const { posts } = useFullApp();
  const queryData = useQuery({
    queryKey: ["getPosts"],
    queryFn: async () => {
      const { data } = await postApi.get("/");
      dispatch(setPosts(data.posts as PostCards[]));
      return data.posts as PostCards[];
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: posts.length < 1,
  });
  return queryData;
};
export const useGetPostComments = (postId: number | undefined) => {
  const queryData = useQuery({
    queryKey: ["getPostComments"],
    queryFn: async () => {
      const { data } = await postApi.get(`/get-post-comments/${postId}`);
      return data.comments as Comment[];
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: postId !== undefined,
  });
  return queryData;
};

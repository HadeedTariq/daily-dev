import { postApi } from "@/lib/axios";
import { addNewPosts, setStopFetchingPosts } from "@/reducers/fullAppReducer";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useGetNewPosts = (
  pageSize: number = 8,
  pageNumber: number = 1
) => {
  const dispatch = useDispatch();
  const queryData = useQuery({
    queryKey: [`getPosts_${pageSize}_${pageNumber}`],
    queryFn: async () => {
      const { data } = await postApi.get(
        `?pageSize=${pageSize}&pageNumber=${pageNumber}`
      );
      if (data.posts.length < 1) {
        dispatch(setStopFetchingPosts());
      }
      dispatch(addNewPosts(data.posts as PostCards[]));
      return data.posts as PostCards[];
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return queryData;
};
export const useGetPostComments = (postId: number | undefined) => {
  const queryData = useQuery({
    queryKey: [`getPostComments_${postId}`],
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

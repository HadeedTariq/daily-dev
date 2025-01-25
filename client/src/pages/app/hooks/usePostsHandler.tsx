import { followerApi, postApi } from "@/lib/axios";
import {
  addNewComments,
  addNewFollowingPosts,
  addNewPosts,
  setStopFetchingFollowingPosts,
  setStopFetchingPostComments,
  setStopFetchingPosts,
} from "@/reducers/fullAppReducer";
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useDispatch } from "react-redux";

interface PostResponse {
  posts: PostCards[];
}

export const useGetNewPosts = (initialPageSize: number = 8) => {
  const dispatch = useDispatch();

  const fetchPosts = async ({ pageParam = 1 }: QueryFunctionContext) => {
    try {
      const { data } = await postApi.get<PostResponse>(
        `?pageSize=${initialPageSize}&pageNumber=${pageParam}`
      );

      dispatch(addNewPosts(data.posts));

      if (data.posts.length === 0) {
        dispatch(setStopFetchingPosts());
      }

      return {
        posts: data.posts,
      };
    } catch (error) {
      dispatch(setStopFetchingPosts());
      throw error;
    }
  };

  const infiniteQuery = useInfiniteQuery({
    queryKey: ["infinitePosts", initialPageSize],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.posts.length > 0 ? allPages.length + 1 : undefined;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    ...infiniteQuery,
    posts: infiniteQuery.data?.pages.flatMap((page) => page.posts) || [],
  };
};

export const useGetFollowingsPosts = (initialPageSize: number = 8) => {
  const dispatch = useDispatch();

  const fetchPosts = async ({ pageParam = 1 }: QueryFunctionContext) => {
    try {
      const { data } = await followerApi.get<PostResponse>(
        `/followings-posts?pageSize=${initialPageSize}&pageNumber=${pageParam}`
      );

      dispatch(addNewFollowingPosts(data.posts));

      if (data.posts.length === 0) {
        dispatch(setStopFetchingFollowingPosts());
      }

      return {
        posts: data.posts,
      };
    } catch (error) {
      dispatch(setStopFetchingFollowingPosts());
      throw error;
    }
  };

  const infiniteQuery = useInfiniteQuery({
    queryKey: ["infiniteFollowingPosts", initialPageSize],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.posts.length > 0 ? allPages.length + 1 : undefined;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    ...infiniteQuery,
    posts: infiniteQuery.data?.pages.flatMap((page) => page.posts) || [],
  };
};

export const useGetPostComments = (
  postId: number | undefined,
  pageSize: number = 8,
  pageNumber: number = 1
) => {
  const dispatch = useDispatch();

  const queryData = useQuery({
    queryKey: [`getPostComments`, pageNumber],
    queryFn: async () => {
      const { data } = await postApi.get(
        `/get-post-comments/${postId}?pageSize=${pageSize}&pageNumber=${pageNumber}`
      );

      if (data.comments.length < 1) {
        dispatch(setStopFetchingPostComments(true));
      }

      dispatch(addNewComments(data.comments as Comments[]));
      return data.comments as Comments[];
    },
    refetchOnWindowFocus: false,
    enabled: postId !== undefined,
  });
  return queryData;
};

export const useGetCurrentPost = (postSlug: string, isPostExists: boolean) => {
  const queryData = useQuery({
    queryKey: [`getCurrentPost_${postSlug}`],
    queryFn: async () => {
      const { data } = await postApi.get(`/post-by-slug?postSlug=${postSlug}`);
      return data as PostCards;
    },
    refetchOnWindowFocus: false,
    enabled: !isPostExists,
  });
  return queryData;
};

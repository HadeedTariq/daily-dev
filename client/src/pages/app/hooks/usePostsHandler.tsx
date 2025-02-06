import { followerApi, postApi } from "@/lib/axios";
import {
  addNewComments,
  addNewFollowingPosts,
  addNewPosts,
  addNewSortedPosts,
  setStopFetchingPostComments,
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

export const useGetNewPosts = (
  initialPageSize: number = 8,
  sortingOrder: string,
  main = true
) => {
  const dispatch = useDispatch();

  const fetchPosts = async ({ pageParam = 1 }: QueryFunctionContext) => {
    try {
      const { data } = await postApi.get<PostResponse>(
        `?pageSize=${initialPageSize}&pageNumber=${pageParam}&sortingOrder=${sortingOrder}`
      );
      if (main) {
        dispatch(addNewPosts(data.posts));
      } else {
        dispatch(addNewSortedPosts(data.posts));
      }

      return {
        posts: data.posts,
      };
    } catch (error) {
      throw error;
    }
  };

  const infiniteQuery = useInfiniteQuery({
    queryKey: [`infinitePosts_${sortingOrder}_${initialPageSize}`],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.posts.length > 0 ? allPages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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

  const fetchPosts = async ({ pageParam = 0 }: QueryFunctionContext) => {
    try {
      const { data } = await followerApi.get<PostResponse>(
        `/followings-posts?pageSize=${initialPageSize}&lastId=${pageParam}`
      );

      dispatch(addNewFollowingPosts(data.posts));

      return {
        posts: data.posts,
      };
    } catch (error) {
      throw error;
    }
  };

  const infiniteQuery = useInfiniteQuery({
    queryKey: ["infiniteFollowingPosts", initialPageSize],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const post = lastPage.posts[lastPage.posts.length - 1];

      return lastPage.posts.length > 0 ? post?.id : undefined;
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

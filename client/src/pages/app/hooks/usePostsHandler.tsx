import { followerApi, postApi } from "@/lib/axios";
import {
  addNewComments,
  addNewFollowingPosts,
  addNewPosts,
  addNewSortedPosts,
  setCurrentPost,
} from "@/reducers/fullAppReducer";
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
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

  const fetchPosts = async ({ pageParam = 0 }: QueryFunctionContext) => {
    try {
      const { data } = await postApi.get<PostResponse>(
        `?pageSize=${initialPageSize}&cursor=${pageParam}&sortingOrder=${sortingOrder}`
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
    getNextPageParam: (lastPage) => {
      const post = lastPage.posts[lastPage.posts.length - 1];

      return lastPage.posts.length > 0 ? post?.id : undefined;
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

export const useGetNewExplorePosts = (
  initialPageSize: number = 8,
  sortingOrder: string,
  main = true
) => {
  const dispatch = useDispatch();

  const fetchPosts = async ({
    pageParam = `${sortingOrder}:${100000},postId:${0}`,
  }: QueryFunctionContext) => {
    try {
      const { data } = await postApi.get<PostResponse>(
        `?pageSize=${initialPageSize}&cursor=${pageParam}&sortingOrder=${sortingOrder}`
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
    initialPageParam: `${sortingOrder}:${100000},postId:${0}`,
    getNextPageParam: (lastPage) => {
      const post = lastPage.posts[lastPage.posts.length - 1];
      const sortOrderValue = post[sortingOrder as "views" | "upvotes"];
      return lastPage.posts.length > 0
        ? `${sortingOrder}:${sortOrderValue},postId:${post.id}`
        : undefined;
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
  initialPageSize: number = 8
) => {
  const dispatch = useDispatch();

  const fetchComments = async ({ pageParam = 1 }: QueryFunctionContext) => {
    try {
      const { data } = await postApi.get(
        `/get-post-comments/${postId}?pageSize=${initialPageSize}&pageNumber=${pageParam}`
      );

      dispatch(addNewComments(data.comments as Comments[]));

      return {
        pageParam,
        comments: data.comments,
      };
    } catch (error) {
      throw error;
    }
  };

  const infiniteQuery = useInfiniteQuery({
    queryKey: ["infiniteComments", initialPageSize],
    queryFn: fetchComments,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.comments.length > 0
        ? Number(lastPage.pageParam) + 1
        : undefined;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    ...infiniteQuery,
    posts: infiniteQuery.data?.pages.flatMap((page) => page.comments) || [],
  };
};

export const useGetCurrentPost = (postSlug: string) => {
  const dispatch = useDispatch();
  const queryData = useMutation({
    mutationKey: [`getCurrentPost_${postSlug}`],
    mutationFn: async (slug: string) => {
      const { data } = await postApi.get(`/post-by-slug?postSlug=${slug}`);
      dispatch(setCurrentPost(data));
    },
  });
  return queryData;
};

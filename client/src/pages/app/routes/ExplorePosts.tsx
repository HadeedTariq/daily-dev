import { useFullApp } from "@/store/hooks/useFullApp";

import { useGetNewExplorePosts } from "../hooks/usePostsHandler";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SortingElements from "../components/posts/SortingOrder";
import { ExplorePostCard } from "../components/posts/ExplorePostCard";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { emptySortedPosts } from "@/reducers/fullAppReducer";
type SortOption = "upvotes" | "views";
const ExplorePosts = () => {
  const [activeSort, setActiveSort] = useState<SortOption>("upvotes");
  const dispatch = useDispatch();

  const { sortedPosts } = useFullApp();
  const uniquePosts = new Set();

  const posts = sortedPosts.filter((post) => {
    if (!uniquePosts.has(post.id)) {
      uniquePosts.add(post.id);
      return true;
    }
    return false;
  });

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isFetched,
    isPending,
  } = useGetNewExplorePosts(8, activeSort, false);

  const { ref, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      isFetched &&
      !isFetching &&
      !isPending &&
      !isLoading &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  useEffect(() => {
    dispatch(emptySortedPosts());
    return () => {
      window.scrollTo(0, 0);
    };
  }, [activeSort]);
  return (
    <>
      <SortingElements
        activeSort={activeSort}
        setActiveSort={(sort) => setActiveSort(sort)}
      />
      <main className="flex mx-auto px-4 py-8 flex-wrap gap-x-8 gap-y-8 justify-center">
        {posts?.map((post, index) => (
          <ExplorePostCard
            key={post.id}
            {...post}
            ref={index === posts.length - 1 ? ref : undefined}
          />
        ))}
      </main>

      {(isLoading || isFetchingNextPage) && <div>Loading...</div>}

      {!hasNextPage && (
        <div className="text-center my-4">No more posts to load</div>
      )}
    </>
  );
};

export default ExplorePosts;

import { useFullApp } from "@/store/hooks/useFullApp";

import { useGetNewPosts } from "../hooks/usePostsHandler";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SortingElements from "../components/posts/SortingOrder";
import { ExplorePostCard } from "../components/posts/ExplorePostCard";

const ExplorePosts = () => {
  const { sortedPosts: posts, stopFetchingPosts } = useFullApp();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetNewPosts(8, "popular", false);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !stopFetchingPosts) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    stopFetchingPosts,
    fetchNextPage,
  ]);
  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
    };
  }, []);
  return (
    <>
      <SortingElements />
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

      {stopFetchingPosts && (
        <div className="text-center my-4">No more posts to load</div>
      )}
    </>
  );
};

export default ExplorePosts;

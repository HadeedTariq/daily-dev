import { useFullApp } from "@/store/hooks/useFullApp";
import { HomePostCard } from "../components/posts/HomePostCard";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useGetFollowingsPosts } from "../hooks/usePostsHandler";

const FollowingPosts = () => {
  const { followingPosts } = useFullApp();

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetFollowingsPosts(8);

  const { ref, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <main className="flex mx-auto px-4 py-8 flex-wrap gap-x-8 gap-y-8 justify-center">
        {followingPosts?.map((post, index) => (
          <HomePostCard
            key={post.id}
            {...post}
            ref={index === followingPosts.length - 1 ? ref : undefined}
          />
        ))}
      </main>

      {(isLoading || isFetchingNextPage) && <div>Loading...</div>}

      {!hasNextPage && <div className="text-center my-4">No posts to load</div>}
    </>
  );
};

export default FollowingPosts;
